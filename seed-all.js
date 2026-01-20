/**
 * UNIFIED SEED SCRIPT
 * Seeds both basic data AND delivery agents with GPS locations
 * 
 * Run: node seed-all.js
 */

require("dotenv").config({ path: ".env.local", override: true });
require("dotenv").config();

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: "CommonJS",
  moduleResolution: "node",
  esModuleInterop: true,
});
require("ts-node/register/transpile-only");

const mongoose = require("mongoose");

const User = require("./models/User").default;
const DeliveryAgent = require("./models/deliveryAgent").default;
const Order = require("./models/Order").default;

// Mumbai locations
const testLocations = [
  { lat: 19.2183, lng: 72.8469, name: "Borivali" },
  { lat: 19.1136, lng: 72.8697, name: "Andheri" },
  { lat: 19.0596, lng: 72.8295, name: "Bandra" },
  { lat: 19.0760, lng: 72.8777, name: "Dadar" },
  { lat: 18.9676, lng: 72.8194, name: "Fort" },
  { lat: 19.2039, lng: 72.8521, name: "Malad" },
  { lat: 19.1440, lng: 72.8479, name: "Kala Ghoda" },
  { lat: 19.0176, lng: 72.8479, name: "Colaba" },
];

// Target locations for ON_ROUTE drivers
const targetLocations = [
  { lat: 19.1527, lng: 72.8473, name: "Juhu" },
  { lat: 19.1033, lng: 72.8536, name: "Powai" },
  { lat: 19.0833, lng: 72.8333, name: "Worli" },
];

async function seedAll() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    console.log("🗑️  Cleaning up database...");
    await Promise.all([
      User.deleteMany({}),
      DeliveryAgent.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("✅ Database cleaned\n");

    // Create basic users
    console.log("👥 Creating basic users...");
    const users = await User.create([
      {
        role: "ADMIN",
        name: "Amit Sharma",
        email: "admin@example.com",
        status: "ACTIVE",
      },
      {
        role: "SENDER",
        name: "TechMart Electronics",
        email: "sender@example.com",
        phone: "+91 98765 43210",
      },
      {
        role: "RECEIVER",
        name: "Priya Patel",
        email: "receiver@example.com",
        phone: "+91 98765 43211",
      },
    ]);
    console.log(`✅ Created ${users.length} basic users\n`);

    // Create delivery agents with GPS locations
    console.log("📍 Creating delivery agents with GPS locations...\n");

    const agents = [];

    for (let i = 1; i <= 10; i++) {
      const isAvailable = i <= 5;
      const location = testLocations[i % testLocations.length];

      // Create user for agent
      const agentUser = await User.create({
        role: "AGENT",
        name: `Test Driver ${i}`,
        email: `test_driver_${i}@example.com`,
        phone: `+91${9000000000 + i}`,
        status: "ACTIVE",
      });

      // Build agent data
      const agentData = {
        userId: agentUser._id,
        age: 25 + Math.floor(Math.random() * 15),
        rating: 3.5 + Math.random() * 1.5,
        totalDeliveries: Math.floor(Math.random() * 500),
        successRate: 0.85 + Math.random() * 0.14,
        avgDelayMinutes: Math.floor(Math.random() * 15),
        preferredAreas: ["Borivali", "Andheri", "Bandra"],
        currentStatus: isAvailable ? "AVAILABLE" : "ON_ROUTE",
        currentLocation: {
          lat: location.lat,
          lng: location.lng,
        },
      };

      // Add target location for ON_ROUTE drivers
      if (!isAvailable) {
        const target = targetLocations[(i - 6) % targetLocations.length];
        agentData.currentTargetLocation = {
          lat: target.lat,
          lng: target.lng,
        };
      }

      const agent = await DeliveryAgent.create(agentData);
      agents.push(agent);

      console.log(`✅ Agent ${i}: ${agentUser.name}`);
      console.log(`   Email: ${agentUser.email}`);
      console.log(`   Status: ${agentData.currentStatus}`);
      console.log(
        `   Current Location: ${location.name} (${location.lat}, ${location.lng})`
      );
      if (!isAvailable && agentData.currentTargetLocation) {
        const target = targetLocations[(i - 6) % targetLocations.length];
        console.log(
          `   Target Location: ${target.name} (${target.lat}, ${target.lng})`
        );
      }
      console.log("");
    }

    // Verify data in database
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 VERIFICATION - Checking Database");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const totalAgents = await DeliveryAgent.countDocuments();
    const agentsWithLocation = await DeliveryAgent.countDocuments({
      currentLocation: { $exists: true, $ne: null },
    });

    console.log(`Total Delivery Agents: ${totalAgents}`);
    console.log(`Agents with Location: ${agentsWithLocation}`);

    // Show sample agent
    const sampleAgent = await DeliveryAgent.findOne({
      currentLocation: { $exists: true },
    });

    if (sampleAgent) {
      console.log("\n📍 Sample Agent (with location):");
      console.log(`   _id: ${sampleAgent._id}`);
      console.log(`   currentLocation: ${JSON.stringify(sampleAgent.currentLocation)}`);
      console.log(`   currentTargetLocation: ${JSON.stringify(sampleAgent.currentTargetLocation)}`);
      console.log(`   currentStatus: ${sampleAgent.currentStatus}`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Successfully seeded ${agents.length} delivery agents!`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📝 Summary:");
    console.log(`   - 5 AVAILABLE drivers with GPS locations`);
    console.log(`   - 5 ON_ROUTE drivers with current + target locations`);
    console.log(`   - All agents ready for driver optimization\n`);

    console.log("🧪 Next steps:");
    console.log("   1. Start server: npm run dev");
    console.log("   2. Create new order with address");
    console.log("   3. Check console for TOP 5 nearest drivers\n");

    console.log("📍 Test addresses (Mumbai):");
    console.log("   - Borivali, Mumbai");
    console.log("   - Andheri, Mumbai");
    console.log("   - Bandra, Mumbai");
    console.log("   - Juhu, Mumbai\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAll();
