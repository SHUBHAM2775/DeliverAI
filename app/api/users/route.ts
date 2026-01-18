import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri =
  "mongodb+srv://shubhamu1332:12345@rubix.a8hul0j.mongodb.net/Rubix?appName=RUBIX";

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Rubix");
    const collection = database.collection("users");
    const users = await collection.find({}).toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}

export async function POST() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Database connected");
    const database = client.db("Rubix");
    const collection = database.collection("users");

    // Insert a random user value
    const randomUser = {
      name: `User ${Math.floor(Math.random() * 1000)}`,
      age: Math.floor(Math.random() * 100),
    };
    await collection.insertOne(randomUser);
    console.log("Random user inserted:", randomUser);

    return NextResponse.json({ message: "User inserted", user: randomUser });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
