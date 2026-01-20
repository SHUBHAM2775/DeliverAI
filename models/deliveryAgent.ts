import { Schema, model, models, Document, Types } from "mongoose";

interface Location {
  lat: number;
  lng: number;
}

export interface DeliveryAgent extends Document {
  userId: Types.ObjectId;
  age?: number;
  rating?: number;
  totalDeliveries: number;
  successRate?: number;
  avgDelayMinutes?: number;
  preferredAreas?: string[];
  currentStatus: "AVAILABLE" | "ON_ROUTE";
  currentLocation?: Location;
  currentTargetLocation?: Location;
}

const locationSchema = new Schema<Location>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const deliveryAgentSchema = new Schema<DeliveryAgent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    currentLocation: { type: locationSchema, default: null },
    currentTargetLocation: { type: locationSchema, default: null },
  },
  { collection: "delivery_agents" },
);

const DeliveryAgentModel =
  models.DeliveryAgent ||
  model<DeliveryAgent>("DeliveryAgent", deliveryAgentSchema);

export default DeliveryAgentModel;
