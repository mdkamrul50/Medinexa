import { MongoClient, Db } from "mongodb";
import dns from "dns";

const DNS_SERVERS = process.env.DNS_SERVERS;
if (DNS_SERVERS) {
  dns.setServers(DNS_SERVERS.split(","));
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}
const MONGO_URI: string = MONGODB_URI;

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
  _mongoPromise?: Promise<void>;
};

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (globalForMongo._mongoDb) return { client: globalForMongo._mongoClient!, db: globalForMongo._mongoDb };

  if (!globalForMongo._mongoPromise) {
    globalForMongo._mongoPromise = (async () => {
      const client = new MongoClient(MONGO_URI, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 3000,
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
