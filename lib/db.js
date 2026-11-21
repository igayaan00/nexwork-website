import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";

const dataPath = path.join(process.cwd(), "data", "site-data.json");
const uri = process.env.MONGODB_URI;

let clientPromise;

async function getCollection() {
  if (!uri || uri.includes("<db_password>")) return null;
  try {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
    const connectedClient = await clientPromise;
    return connectedClient.db("nexwork_db").collection("site_config");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    global._mongoClientPromise = null;
    return null;
  }
}

async function readLocalSeed() {
  const file = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(file);
}

export async function readData() {
  const col = await getCollection();
  if (!col) {
    return readLocalSeed();
  }

  try {
    const doc = await col.findOne({ _id: "main" });
    if (!doc) {
      const seed = await readLocalSeed();
      await col.insertOne({ _id: "main", ...seed });
      return seed;
    }

    const { _id, ...cleanData } = doc;
    return cleanData;
  } catch (err) {
    console.error("MongoDB Read Error:", err.message);
    return readLocalSeed();
  }
}

export async function writeData(data) {
  const col = await getCollection();
  if (!col) {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
    return;
  }

  const { _id, ...cleanData } = data;
  await col.updateOne(
    { _id: "main" },
    { $set: cleanData },
    { upsert: true }
  );
}