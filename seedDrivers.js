/**
 * Seed Script: Populate Delivery Agents with Location Data
 * 
 * This script creates test delivery agents with:
 * - currentLocation (lat, lng)
 * - currentStatus (AVAILABLE or ON_ROUTE)
 * - currentTargetLocation (for ON_ROUTE agents)
 * 
 * Run this script to test the driver optimization system:
 * node seedDrivers.js
 */

const mongoose = require("mongoose");

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rubix";

// Sample locations in Mumbai metro area
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

// Target locations for ON_ROUTE drivers in Mumbai
const targetLocations = [
  { lat: 19.1527, lng: 72.8473, name: "Juhu" },
  { lat: 19.1033, lng: 72.8536, name: "Powai" },
  { lat: 19.0833, lng: 72.8333, name: "Worli" },
];

async function seedDrivers() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Define schemas
    const userSchema = new mongoose.Schema(
      {
        role: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        status: { type: String, default: "ACTIVE" },
      },
      { collection: "users" }
    );

    const locationSchema = new mongoose.Schema(
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      { _id: false }
    );

    const deliveryAgentSchema = new mongoose.Schema(
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        age: { type: Number },
        rating: { type: Number },
        totalDeliveries: { type: Number, default: 0 },
        successRate: { type: Number },
        avgDelayMinutes: { type: Number },
        preferredAreas: [{ type: String }],
        currentStatus: {
          type: String,
          enum: ["AVAILABLE", "ON_ROUTE"],
          default: "AVAILABLE",
        },
        currentLocation: { type: locationSchema },
        currentTargetLocation: { type: locationSchema },
      },
      { collection: "delivery_agents" }
    );

    const User = mongoose.models.User || mongoose.model("User", userSchema);
    const DeliveryAgent = mongoose.models.DeliveryAgent || mongoose.model("DeliveryAgent", deliveryAgentSchema);

    console.log("🗑️  Cleaning existing test agents...");
    await User.deleteMany({ email: { $regex: /^test_driver/ } });
    await DeliveryAgent.deleteMany({});

    console.log("📦 Creating delivery agents with location data...\n");

    const agents = [];

    // Create 10 delivery agents (5 AVAILABLE, 5 ON_ROUTE)
    for (let i = 1; i <= 10; i++) {
      const isAvailable = i <= 5;
      const location = testLocations[i % testLocations.length];

      // Create user
      const user = await User.create({
        role: "DRIVER",
        name: `Test Driver ${i}`,
        email: `test_driver_${i}@example.com`,
        phone: `+91${9000000000 + i}`,
        status: "ACTIVE",
      });

      // Create delivery agent
      const agentData = {
        userId: user._id,
        age: 25 + Math.floor(Math.random() * 15),
        rating: 3.5 + Math.random() * 1.5,
        totalDeliveries: Math.floor(Math.random() * 500),
        successRate: 0.85 + Math.random() * 0.14,
        avgDelayMinutes: Math.floor(Math.random() * 15),
        preferredAreas: ["Central Delhi", "South Delhi", "Noida"],
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
      agents.push({ user, agent, location });

      console.log(`✅ Agent ${i}: ${user.name}`);
      console.log(`   Status: ${agentData.currentStatus}`);
      console.log(`   Location: ${location.name} (${location.lat}, ${location.lng})`);
      if (!isAvailable && agentData.currentTargetLocation) {
        const target = targetLocations[(i - 6) % targetLocations.length];
        console.log(`   Target: ${target.name} (${target.lat}, ${target.lng})`);
      }
      console.log("");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Successfully seeded ${agents.length} delivery agents!`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📝 Summary:");
    console.log(`   - 5 AVAILABLE drivers`);
    console.log(`   - 5 ON_ROUTE drivers`);
    console.log("\n🧪 You can now test the driver optimization system!");
    console.log("   Create a new order and check the console for TOP 5 nearest drivers.\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDrivers();
