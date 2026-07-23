import { MongoClient, Db } from "mongodb";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const RAW_URI: string = process.env.MONGODB_URI ?? "";
if (!RAW_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

async function buildDirectURI(rawURI: string): Promise<string> {
  const srvMatch = rawURI.match(/^mongodb\+srv:\/\/(.+@)?([^\/\?]+)(\/[^?]*)?(\?.*)?$/);
  if (!srvMatch) return rawURI;

  const creds = srvMatch[1] || "";
  const host = srvMatch[2];
  const dbPath = srvMatch[3] || "";
  const query = srvMatch[4] || "";

  const [srvRecords, txtRecords] = await Promise.all([
    dns.promises.resolveSrv(`_mongodb._tcp.${host}`),
    dns.promises.resolveTxt(host).catch(() => [] as string[][]),
  ]);

  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const txtExtra = txtRecords.flat().join("&");

  return `mongodb://${creds}${hosts}${dbPath}${query}${query ? "&" : "?"}tls=true${txtExtra ? `&${txtExtra}` : ""}`;
}

let _directURI: string | null = null;

async function getDirectURI(): Promise<string> {
  if (!_directURI) {
    _directURI = await buildDirectURI(RAW_URI);
  }
  return _directURI;
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
  _mongoPromise?: Promise<void>;
};

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (globalForMongo._mongoDb) return { client: globalForMongo._mongoClient!, db: globalForMongo._mongoDb };

  if (!globalForMongo._mongoPromise) {
    globalForMongo._mongoPromise = (async () => {
      const uri = await getDirectURI();
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      globalForMongo._mongoClient = client;
      globalForMongo._mongoDb = client.db();
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
