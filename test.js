require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const result = await client.db("myapp").collection("test").insertOne({ hello: "world" });
  await client.close();
}

main().catch(console.error);