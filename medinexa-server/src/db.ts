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

let client: MongoClient;
let db: Db;
let promise: Promise<void> | null = null;

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (db) return { client, db };

  if (!promise) {
    promise = (async () => {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      db = client.db();
    })();
  }

  await promise;
  return { client, db };
}

export async function getClient(): Promise<MongoClient> {
  const c = await connectDB();
  return c.client;
}

export async function getDB(): Promise<Db> {
  const c = await connectDB();
  return c.db;
}
