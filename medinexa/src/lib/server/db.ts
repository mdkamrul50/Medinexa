import { MongoClient, Db } from "mongodb";

const RAW_URI: string = process.env.MONGODB_URI ?? "";
if (!RAW_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

interface SRVRecord {
  name: string;
  port: number;
  priority: number;
  weight: number;
}

async function resolveSRVDoh(hostname: string): Promise<SRVRecord[]> {
  const url = `https://dns.google/resolve?name=_mongodb._tcp.${hostname}&type=SRV`;
  const res = await fetch(url);
  const data = await res.json() as { Answer?: { name: string; data: string; type: number }[] };
  const answers = data.Answer?.filter((a) => a.type === 33) ?? [];
  return answers.map((a) => {
    const parts = a.data.split(" ");
    return {
      priority: parseInt(parts[0], 10),
      weight: parseInt(parts[1], 10),
      port: parseInt(parts[2], 10),
      name: parts[3].replace(/\.$/, ""),
    };
  });
}

async function resolveTXTDoh(hostname: string): Promise<string[]> {
  const url = `https://dns.google/resolve?name=${hostname}&type=TXT`;
  const res = await fetch(url);
  const data = await res.json() as { Answer?: { data: string; type: number }[] };
  const answers = data.Answer?.filter((a) => a.type === 16) ?? [];
  return answers.map((a) => a.data.replace(/"/g, ""));
}

async function resolveSRV(rawURI: string): Promise<string> {
  const srvMatch = rawURI.match(
    /^mongodb\+srv:\/\/(?:([^@]+)@)?([^/?]+)(\/[^?]*)?(\?.*)?$/
  );
  if (!srvMatch) return rawURI;

  const credentials = srvMatch[1] || "";
  const host = srvMatch[2];
  const dbPath = srvMatch[3] || "";
  const query = srvMatch[4] || "";

  const [srvRecords, txtRecords] = await Promise.all([
    resolveSRVDoh(host),
    resolveTXTDoh(host).catch(() => []),
  ]);

  if (srvRecords.length === 0) {
    throw new Error(`No SRV records found for _mongodb._tcp.${host}`);
  }

  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const txtParams = txtRecords.flat().join("&");
  const separator = query ? "&" : "?";

  return `mongodb://${credentials ? credentials + "@" : ""}${hosts}${dbPath}${query}${separator}tls=true${txtParams ? "&" + txtParams : ""}`;
}

let _resolvedURI: string | null = null;

async function getResolvedURI(): Promise<string> {
  if (!_resolvedURI) {
    _resolvedURI = await resolveSRV(RAW_URI);
  }
  return _resolvedURI;
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
  _mongoPromise?: Promise<void>;
};

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("doctors").createIndexes([
      { key: { department: 1, status: 1 } },
      { key: { createdAt: -1 } },
      { key: { rating: -1 } },
      { key: { userId: 1 } },
    ]),
    db.collection("patients").createIndexes([
      { key: { userId: 1 } },
      { key: { assignedDoctor: 1 } },
      { key: { bloodGroup: 1, status: 1 } },
      { key: { createdAt: -1 } },
    ]),
    db.collection("users").createIndexes([
      { key: { email: 1 }, unique: true },
    ]),
    db.collection("appointments").createIndexes([
      { key: { date: 1 } },
      { key: { userId: 1 } },
    ]),
  ]);
}

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (globalForMongo._mongoDb) return { client: globalForMongo._mongoClient!, db: globalForMongo._mongoDb };

  if (!globalForMongo._mongoPromise) {
    globalForMongo._mongoPromise = (async () => {
      const uri = await getResolvedURI();
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      globalForMongo._mongoClient = client;
      globalForMongo._mongoDb = client.db();
      await ensureIndexes(globalForMongo._mongoDb);
    })();
  }

  await globalForMongo._mongoPromise;
  return { client: globalForMongo._mongoClient!, db: globalForMongo._mongoDb! };
}

export async function getClient(): Promise<MongoClient> {
  const c = await connectDB();
  return c.client;
}

export async function getDB(): Promise<Db> {
  const c = await connectDB();
  return c.db;
}
