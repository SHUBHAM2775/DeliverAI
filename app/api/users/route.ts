import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is required");
}

async function connectDB() {
  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log("✓ Database connected successfully");

    const database = client.db("Rubix");
    const collection = database.collection("users");
    const users = await collection.find({}).toArray();

    console.log("✓ Users fetched from database:");
    console.log(users);

    return users;
  } catch (error) {
    console.error("✗ Database connection error:", error);
    throw error;
  } finally {
    await client.close();
    console.log("✓ Database connection closed");
  }
}

// Call the function
connectDB().catch((err) => console.error(err));
