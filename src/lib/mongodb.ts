import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "handyman";

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

let client: MongoClient | null = null;
let db: Db | null = null;

// Reuse the client in dev to avoid creating many connections on HMR
export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}
