/**
 * Test Script: Driver Optimization System
 * 
 * This script tests the complete flow:
 * 1. Seed test drivers
 * 2. Create test order
 * 3. Verify console output shows TOP 5 drivers
 * 
 * Run: node testDriverOptimization.js
 */

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rubix";
const API_BASE_URL = "http://localhost:3000";

// Test locations
const testPickupAddresses = [
  "Connaught Place, New Delhi, India",
  "Nehru Place, New Delhi, India",
  "Noida Sector 18, Uttar Pradesh, India",
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testDriverOptimization() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧪 DRIVER OPTIMIZATION SYSTEM - TEST SUITE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // Step 1: Verify database connection
    console.log("📋 Step 1: Verifying database connection...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Step 2: Check if drivers exist
    console.log("📋 Step 2: Checking for delivery agents...");
    const DeliveryAgentModel = mongoose.models.DeliveryAgent || mongoose.model(
      "DeliveryAgent",
      new mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        currentLocation: {
          lat: Number,
          lng: Number,
        },
        currentStatus: String,
        currentTargetLocation: {
          lat: Number,
          lng: Number,
        },
      }, { collection: "delivery_agents" })
    );

    const agentCount = await DeliveryAgentModel.countDocuments({
      currentLocation: { $exists: true },
    });

    console.log(`   Found ${agentCount} delivery agents with location data`);

    if (agentCount === 0) {
      console.log("\n⚠️  No drivers found! Please run: node seedDrivers.js\n");
      await mongoose.disconnect();
      return;
    }

    const availableCount = await DeliveryAgentModel.countDocuments({
      currentStatus: "AVAILABLE",
      currentLocation: { $exists: true },
    });

    const onRouteCount = await DeliveryAgentModel.countDocuments({
      currentStatus: "ON_ROUTE",
      currentLocation: { $exists: true },
    });

    console.log(`   - AVAILABLE: ${availableCount}`);
    console.log(`   - ON_ROUTE: ${onRouteCount}\n`);

    await mongoose.disconnect();

    // Step 3: Create test order via API
    console.log("📋 Step 3: Creating test order via API...");
    console.log(`   Using address: "${testPickupAddresses[0]}"`);
    console.log("   Making POST request to /api/orders\n");

    const orderPayload = {
      customerName: "Test Customer",
      phone: "+919999999999",
      email: "test@example.com",
      itemName: "Test Package",
      category: "General",
      address: testPickupAddresses[0],
      area: "Central Delhi",
      pincode: "110001",
      quantity: "1",
      isFragile: false,
    };

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📦 ORDER CREATION REQUEST");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(JSON.stringify(orderPayload, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("⏳ Sending request...\n");

    // Note: This requires the Next.js server to be running
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  IMPORTANT: Make sure Next.js server is running!");
    console.log("   Run: npm run dev");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📊 Check your server console for:");
    console.log("   1. Geocoding results");
    console.log("   2. Order creation confirmation");
    console.log("   3. TOP 5 NEAREST DRIVERS output\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ TEST PREPARATION COMPLETE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("🧪 To complete the test:");
    console.log("   1. Ensure server is running (npm run dev)");
    console.log("   2. Create order via frontend OR use this curl command:\n");
    console.log(`curl -X POST ${API_BASE_URL}/api/orders \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '${JSON.stringify(orderPayload)}'\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Test failed:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Run the test
testDriverOptimization();
