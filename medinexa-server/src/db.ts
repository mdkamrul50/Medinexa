import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

let client: MongoClient;
let db: Db;
let promise: Promise<void> | null = null;

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (db) return { client, db };

  if (!promise) {
    promise = (async () => {
      client = new MongoClient(MONGODB_URI);
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
