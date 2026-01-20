/**
 * COMPREHENSIVE UNIFIED SEED SCRIPT
 * Consolidates seed-all.js, seed.js, and seedDrivers.js into one file
 *
 * Creates:
 * - Basic users (Admin, Sender, Receiver, Agents)
 * - Delivery agents with GPS locations (5 AVAILABLE, 5 ON_ROUTE)
 * - Sender profiles
 * - Delivery slots
 * - Orders with locations
 * - Routes
 * - Slot predictions
 * - Delivery risks
 * - Slot confirmations
 * - Notifications
 * - Delivery feedback
 *
 * Run: node seed.js
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
const SenderProfile = require("./models/senderProfile").default;
const DeliverySlot = require("./models/DeliverySlot").default;
const Order = require("./models/Order").default;
const Route = require("./models/route").default;
const SlotPrediction = require("./models/slotPrediction").default;
const DeliveryRisk = require("./models/deliveryRisk").default;
const SlotConfirmation = require("./models/slotConfirmation").default;
const Notification = require("./models/notification").default;
const DeliveryFeedback = require("./models/deliveryFeedback").default;

// Mumbai test locations for delivery agents
const testLocations = [
  { lat: 19.2183, lng: 72.8469, name: "Borivali" },
  { lat: 19.1136, lng: 72.8697, name: "Andheri" },
  { lat: 19.0596, lng: 72.8295, name: "Bandra" },
  { lat: 19.076, lng: 72.8777, name: "Dadar" },
  { lat: 18.9676, lng: 72.8194, name: "Fort" },
  { lat: 19.2039, lng: 72.8521, name: "Malad" },
  { lat: 19.144, lng: 72.8479, name: "Kala Ghoda" },
  { lat: 19.0176, lng: 72.8479, name: "Colaba" },
];

// Target locations for ON_ROUTE drivers
const targetLocations = [
  { lat: 19.1527, lng: 72.8473, name: "Juhu" },
  { lat: 19.1033, lng: 72.8536, name: "Powai" },
  { lat: 19.0833, lng: 72.8333, name: "Worli" },
];

async function seed() {
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
      DeliveryFeedback.deleteMany({}),
      Notification.deleteMany({}),
      SlotConfirmation.deleteMany({}),
      DeliveryRisk.deleteMany({}),
      SlotPrediction.deleteMany({}),
      Route.deleteMany({}),
      Order.deleteMany({}),
      DeliverySlot.deleteMany({}),
      SenderProfile.deleteMany({}),
      DeliveryAgent.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("✅ Database cleaned\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: CREATE BASIC USERS
    // ═══════════════════════════════════════════════════════════════
    console.log("👥 Creating basic users...");
    const basicUsers = await User.create([
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
    console.log(`✅ Created ${basicUsers.length} basic users\n`);

    const adminUser = basicUsers[0];
    const senderUser = basicUsers[1];
    const receiverUser = basicUsers[2];

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: CREATE DELIVERY AGENTS WITH GPS LOCATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("📍 Creating delivery agents with GPS locations...\n");

    const allUsers = basicUsers;
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

      allUsers.push(agentUser);

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
        `   Current Location: ${location.name} (${location.lat}, ${location.lng})`,
      );
      if (!isAvailable && agentData.currentTargetLocation) {
        const target = targetLocations[(i - 6) % targetLocations.length];
        console.log(
          `   Target Location: ${target.name} (${target.lat}, ${target.lng})`,
        );
      }
      console.log("");
    }

    const agentUser1 = allUsers[3]; // First agent (AVAILABLE)
    const agentUser2 = allUsers[4]; // Second agent (AVAILABLE)

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: CREATE SENDER PROFILE
    // ═══════════════════════════════════════════════════════════════
    console.log("🏢 Creating sender profile...");
    await SenderProfile.create({
      userId: senderUser._id,
      organizationName: "TechMart Electronics",
      defaultPickupAddress: "42 Tech Plaza, Mumbai, Maharashtra 400001",
      startHour: 10,
      endHour: 22,
      totalOrders: 156,
      failedDeliveryRate: 0.05,
    });
    console.log("✅ Sender profile created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: CREATE DELIVERY SLOTS
    // ═══════════════════════════════════════════════════════════════
    console.log("📅 Creating delivery slots...");
    const slots = await DeliverySlot.create([
      {
        date: new Date(),
        startTime: "09:00",
        endTime: "11:00",
        area: "Andheri",
        capacity: 10,
        bookedCount: 3,
        isAiRecommended: true,
        successProbability: 0.9,
        riskLevel: "LOW",
      },
      {
        date: new Date(),
        startTime: "11:00",
        endTime: "13:00",
        area: "Andheri",
        capacity: 8,
        bookedCount: 4,
        isAiRecommended: false,
        successProbability: 0.78,
        riskLevel: "MEDIUM",
      },
      {
        date: new Date(),
        startTime: "13:00",
        endTime: "15:00",
        area: "Andheri",
        capacity: 12,
        bookedCount: 6,
        isAiRecommended: true,
        successProbability: 0.82,
        riskLevel: "LOW",
      },
      {
        date: new Date(),
        startTime: "15:00",
        endTime: "17:00",
        area: "Andheri",
        capacity: 9,
        bookedCount: 2,
        isAiRecommended: false,
        successProbability: 0.68,
        riskLevel: "MEDIUM",
      },
      {
        date: new Date(),
        startTime: "17:00",
        endTime: "19:00",
        area: "Andheri",
        capacity: 7,
        bookedCount: 1,
        isAiRecommended: true,
        successProbability: 0.61,
        riskLevel: "HIGH",
      },
    ]);
    console.log(`✅ Created ${slots.length} delivery slots\n`);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: CREATE ORDERS
    // ═══════════════════════════════════════════════════════════════
    console.log("📦 Creating orders...");
    const orders = await Order.create([
      {
        senderId: senderUser._id,
        receiverId: receiverUser._id,
        agentId: agentUser1._id,
        commodityName: "Wireless Headphones",
        commodityCategory: "Electronics",
        isFragile: true,
        pickupLocation: { lat: 19.076, lng: 72.8777 },
        // Customer location (Andheri)
        deliveryLocation: { lat: 19.1136, lng: 72.8697 },
        deliveryAddress: "Andheri, Mumbai",
        area: "Andheri",
        pincode: "400053",
        orderStatus: "DELIVERED",
        deliveryDate: new Date(),
        finalSlotId: slots[0]._id,
        deliveryAttemptCount: 1,
        firstAttemptSuccess: true,
      },
      {
        senderId: senderUser._id,
        receiverId: receiverUser._id,
        agentId: agentUser1._id,
        commodityName: "Books",
        commodityCategory: "Education",
        isFragile: false,
        pickupLocation: { lat: 19.076, lng: 72.8777 },
        // Customer location (Andheri)
        deliveryLocation: { lat: 19.1136, lng: 72.8697 },
        deliveryAddress: "Andheri, Mumbai",
        area: "Andheri",
        pincode: "400058",
        orderStatus: "CONFIRMED",
        deliveryDate: new Date(),
        finalSlotId: slots[2]._id,
        deliveryAttemptCount: 1,
        firstAttemptSuccess: true,
      },
      {
        senderId: senderUser._id,
        receiverId: receiverUser._id,
        agentId: agentUser2._id,
        commodityName: "Glassware Set",
        commodityCategory: "Home",
        isFragile: true,
        pickupLocation: { lat: 19.076, lng: 72.8777 },
        // Customer location (Bandra)
        deliveryLocation: { lat: 19.0596, lng: 72.8295 },
        deliveryAddress: "Bandra, Mumbai",
        area: "Andheri",
        pincode: "400069",
        orderStatus: "FAILED",
        deliveryDate: new Date(),
        finalSlotId: slots[4]._id,
        deliveryAttemptCount: 2,
        firstAttemptSuccess: false,
      },
    ]);
    console.log(`✅ Created ${orders.length} orders\n`);

    const order1 = orders[0];
    const order2 = orders[1];
    const order3 = orders[2];

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: CREATE ROUTES
    // ═══════════════════════════════════════════════════════════════
    console.log("🗺️  Creating routes...");
    await Route.create({
      agentId: agentUser1._id,
      date: new Date(),
      orders: [order1._id, order2._id],
      estimatedTime: "4h",
      routeDistance: 24.5,
      routeDuration: 240,
      routeFeasibilityScore: 0.85,
      conflicts: ["Peak traffic near Western Express Highway"],
    });
    console.log("✅ Routes created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: CREATE SLOT PREDICTIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("🔮 Creating slot predictions...");
    await SlotPrediction.create([
      {
        area: "Andheri",
        slotId: slots[0]._id,
        predictedSuccessProbability: 0.9,
        store_id: "store-100",
        pickup_availability_window: "08:00-09:00",
        seller_allowed_time_range: "09:00-19:00",
        parcel_category: "Electronics",
        store_location: { latitude: 19.076, longitude: 72.8777 },
        delivery_location: { latitude: 19.1197, longitude: 72.8464 },
      },
      {
        area: "Andheri",
        slotId: slots[2]._id,
        predictedSuccessProbability: 0.82,
        store_id: "store-101",
        pickup_availability_window: "10:00-12:00",
        seller_allowed_time_range: "09:00-19:00",
        parcel_category: "Books",
        store_location: { latitude: 19.076, longitude: 72.8777 },
        delivery_location: { latitude: 19.1136, longitude: 72.8697 },
      },
      {
        area: "Andheri",
        slotId: slots[4]._id,
        predictedSuccessProbability: 0.6,
        store_id: "store-102",
        pickup_availability_window: "14:00-15:00",
        seller_allowed_time_range: "09:00-19:00",
        parcel_category: "Fragile",
        store_location: { latitude: 19.076, longitude: 72.8777 },
        delivery_location: { latitude: 19.1075, longitude: 72.8263 },
      },
    ]);
    console.log("✅ Slot predictions created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: CREATE DELIVERY RISKS
    // ═══════════════════════════════════════════════════════════════
    console.log("⚠️  Creating delivery risks...");
    await DeliveryRisk.create([
      {
        orderId: order1._id,
        slotId: slots[0]._id,
        riskType: "TRAFFIC",
        riskLevel: "LOW",
        description: "Minor traffic expected in Andheri area",
        actionSuggested: "Monitor traffic conditions",
      },
      {
        orderId: order2._id,
        slotId: slots[1]._id,
        riskType: "AGENT",
        riskLevel: "MEDIUM",
        description: "Agent has recent delay history on this route",
        actionSuggested: "Assign backup agent or provide route optimization",
      },
      {
        orderId: order3._id,
        slotId: slots[4]._id,
        riskType: "WEATHER",
        riskLevel: "HIGH",
        description: "Heavy monsoon rain expected during evening slot",
        actionSuggested: "Consider rescheduling to earlier slot",
      },
      {
        orderId: order1._id,
        slotId: slots[2]._id,
        riskType: "TRAFFIC",
        riskLevel: "MEDIUM",
        description: "Moderate congestion on Western Express Highway",
        actionSuggested: "Plan for 15-20 minute delay buffer",
      },
      {
        orderId: order2._id,
        slotId: slots[3]._id,
        riskType: "WEATHER",
        riskLevel: "HIGH",
        description: "Heavy rainfall warning in delivery area",
        actionSuggested: "Postpone delivery or prepare contingency plan",
      },
    ]);
    console.log("✅ Delivery risks created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: CREATE SLOT CONFIRMATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("✔️  Creating slot confirmations...");
    await SlotConfirmation.create([
      {
        orderId: order1._id,
        receiverId: receiverUser._id,
        slotId: slots[0]._id,
        confirmationStatus: "CONFIRMED",
        confirmedAt: new Date(),
        cutoffTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        rescheduleCount: 0,
      },
      {
        orderId: order2._id,
        receiverId: receiverUser._id,
        slotId: slots[2]._id,
        confirmationStatus: "PENDING",
        cutoffTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
        rescheduleCount: 1,
      },
      {
        orderId: order3._id,
        receiverId: receiverUser._id,
        slotId: slots[4]._id,
        confirmationStatus: "CONFIRMED",
        confirmedAt: new Date(),
        cutoffTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        rescheduleCount: 0,
      },
    ]);
    console.log("✅ Slot confirmations created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: CREATE NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log("📢 Creating notifications...");
    await Notification.create([
      {
        userId: receiverUser._id,
        orderId: order1._id,
        type: "REMINDER",
        message: "Your delivery is scheduled between 09:00-11:00.",
      },
      {
        userId: receiverUser._id,
        orderId: order3._id,
        type: "ALERT",
        message: "Weather delay expected. Please consider rescheduling.",
      },
      {
        userId: agents[8]._id,
        orderId: order3._id,
        type: "ALERT",
        message: "High risk on route. Check alternate paths.",
      },
      {
        userId: senderUser._id,
        orderId: order1._id,
        type: "REMINDER",
        message: "Customer confirmed delivery slot for Wireless Headphones.",
        isRead: false,
      },
      {
        userId: senderUser._id,
        orderId: order2._id,
        type: "REMINDER",
        message: "Books delivery is out for delivery.",
        isRead: false,
      },
      {
        userId: senderUser._id,
        orderId: order3._id,
        type: "ALERT",
        message: "Glassware Set delivery failed. Customer unavailable.",
        isRead: false,
      },
    ]);
    console.log("✅ Notifications created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 11: CREATE DELIVERY FEEDBACK
    // ═══════════════════════════════════════════════════════════════
    console.log("⭐ Creating delivery feedback...");
    await DeliveryFeedback.create([
      {
        receiverId: receiverUser._id,
        wasConvenient: true,
        rating: 5,
        comment:
          "Excellent delivery service, arrived on time despite Mumbai traffic.",
        submittedAt: new Date(),
      },
      {
        receiverId: receiverUser._id,
        wasConvenient: false,
        rating: 3,
        comment: "Package arrived but got wet in the monsoon rain.",
        submittedAt: new Date(),
      },
    ]);
    console.log("✅ Delivery feedback created\n");

    // ═══════════════════════════════════════════════════════════════
    // SECTION 12: DATABASE VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 VERIFICATION - Database Contents");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const stats = await Promise.all([
      User.countDocuments(),
      DeliveryAgent.countDocuments(),
      Order.countDocuments(),
      DeliverySlot.countDocuments(),
      SenderProfile.countDocuments(),
      Route.countDocuments(),
      SlotPrediction.countDocuments(),
      DeliveryRisk.countDocuments(),
      SlotConfirmation.countDocuments(),
      Notification.countDocuments(),
      DeliveryFeedback.countDocuments(),
    ]);

    console.log(`Users:              ${stats[0]}`);
    console.log(`Delivery Agents:    ${stats[1]} (10 with GPS locations)`);
    console.log(`Orders:             ${stats[2]}`);
    console.log(`Delivery Slots:     ${stats[3]}`);
    console.log(`Sender Profiles:    ${stats[4]}`);
    console.log(`Routes:             ${stats[5]}`);
    console.log(`Slot Predictions:   ${stats[6]}`);
    console.log(`Delivery Risks:     ${stats[7]}`);
    console.log(`Slot Confirmations: ${stats[8]}`);
    console.log(`Notifications:      ${stats[9]}`);
    console.log(`Delivery Feedback:  ${stats[10]}`);

    // Show agent with location
    const totalAgents = await DeliveryAgent.countDocuments();
    const agentsWithLocation = await DeliveryAgent.countDocuments({
      currentLocation: { $exists: true, $ne: null },
    });

    console.log(`\nTotal Delivery Agents: ${totalAgents}`);
    console.log(`Agents with Location: ${agentsWithLocation}`);

    const sampleAgent = await DeliveryAgent.findOne({
      currentLocation: { $exists: true },
    });

    if (sampleAgent) {
      console.log("\n📍 Sample Agent (with location):");
      console.log(`   _id: ${sampleAgent._id}`);
      console.log(
        `   currentLocation: ${JSON.stringify(sampleAgent.currentLocation)}`,
      );
      console.log(
        `   currentTargetLocation: ${JSON.stringify(sampleAgent.currentTargetLocation)}`,
      );
      console.log(`   currentStatus: ${sampleAgent.currentStatus}`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Seeding completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📝 Summary:");
    console.log(`   ✓ Created 13 users (3 basic + 10 agents)`);
    console.log(`   ✓ 10 delivery agents with GPS locations`);
    console.log(`   ✓ 5 AVAILABLE drivers and 5 ON_ROUTE drivers`);
    console.log(`   ✓ Complete order management data`);
    console.log(`   ✓ All models populated and tested\n`);

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

seed();
