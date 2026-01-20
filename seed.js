// Load env from .env.local first (Next.js convention), fallback to default .env.
require("dotenv").config({ path: ".env.local", override: true });
require("dotenv").config();

// Force ts-node to transpile TS models to CommonJS so named exports from mongoose resolve correctly.
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

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(uri);

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
    {
      role: "AGENT",
      name: "Rahul Kumar",
      email: "agent1@example.com",
      phone: "+91 98765 43212",
    },
    {
      role: "AGENT",
      name: "Anita Singh",
      email: "agent2@example.com",
      phone: "+91 98765 43213",
    },
  ]);

  const adminUser = users[0];
  const senderUser = users[1];
  const receiverUser = users[2];
  const agentUser1 = users[3];
  const agentUser2 = users[4];

  await DeliveryAgent.create([
    {
      userId: agentUser1._id,
      age: 32,
      rating: 4.6,
      successRate: 0.93,
      avgDelayMinutes: 6,
      preferredAreas: ["Andheri", "Bandra"],
    },
    {
      userId: agentUser2._id,
      age: 29,
      rating: 4.4,
      successRate: 0.9,
      avgDelayMinutes: 9,
      preferredAreas: ["Andheri", "Powai"],
    },
  ]);

  await SenderProfile.create({
    userId: senderUser._id,
    organizationName: "TechMart Electronics",
    defaultPickupAddress: "42 Tech Plaza, Mumbai, Maharashtra 400001",
    startHour: 10,
    endHour: 22,
    totalOrders: 156,
    failedDeliveryRate: 0.05,
  });

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

  const orders = await Order.create([
    {
      senderId: senderUser._id,
      receiverId: receiverUser._id,
      agentId: agentUser1._id,
      commodityName: "Wireless Headphones",
      commodityCategory: "Electronics",
      isFragile: true,
      pickupLocation: { latitude: 19.0760, longitude: 72.8777 },
      deliveryAddress: { latitude: 19.1197, longitude: 72.8464 },
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
      agentId: agentUser2._id,
      commodityName: "Books",
      commodityCategory: "Education",
      isFragile: false,
      pickupLocation: { latitude: 19.0760, longitude: 72.8777 },
      deliveryAddress: { latitude: 19.1136, longitude: 72.8697 },
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
      pickupLocation: { latitude: 19.0760, longitude: 72.8777 },
      deliveryAddress: { latitude: 19.1075, longitude: 72.8263 },
      area: "Andheri",
      pincode: "400069",
      orderStatus: "FAILED",
      deliveryDate: new Date(),
      finalSlotId: slots[4]._id,
      deliveryAttemptCount: 2,
      firstAttemptSuccess: false,
    },
  ]);

  const order1 = orders[0];
  const order2 = orders[1];
  const order3 = orders[2];

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

  await SlotPrediction.create([
    {
      area: "Andheri",
      slotId: slots[0]._id,
      predictedSuccessProbability: 0.9,
      store_id: "store-100",
      pickup_availability_window: "08:00-09:00",
      seller_allowed_time_range: "09:00-19:00",
      parcel_category: "Electronics",
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
      delivery_location: { latitude: 19.1075, longitude: 72.8263 },
    },
  ]);

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
      userId: agentUser2._id,
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

  await DeliveryFeedback.create([
    {
      receiverId: receiverUser._id,
      wasConvenient: true,
      rating: 5,
      comment: "Excellent delivery service, arrived on time despite Mumbai traffic.",
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
}

seed()
  .then(() => {
    console.log("Seeding completed successfully");
    return mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
