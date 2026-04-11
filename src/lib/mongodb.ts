import { MongoClient, Db } from "mongodb";
import { getLocale } from "./getLocale";

// 🔒 Extend global (for dev hot-reload in Next.js)
declare global {
  // eslint-disable-next-line no-var
  var _mongo: {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
}

// 🌍 Global cache
const globalMongo = global._mongo || { client: null, promise: null };

if (!global._mongo) {
  global._mongo = globalMongo;
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ Missing MONGODB_URI in environment");
  }

  // ✅ Create connection only once
  if (!globalMongo.promise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10, // optional (default is fine too)
    });

    globalMongo.promise = client.connect();

    console.log("🚀 Creating new MongoDB connection...");
  }

  const client = await globalMongo.promise;

  // 🌍 Choose DB dynamically (your logic)
  const locale = await getLocale();
  const isPt = locale === "pt";

  const dbName = isPt
    ? process.env.MONGODB_DB_PT
    : process.env.MONGODB_DB;

  if (!dbName) {
    throw new Error("❌ Missing database name in env");
  }

  return client.db(dbName);
}