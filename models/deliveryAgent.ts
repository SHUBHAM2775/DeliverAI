import { Schema, model, models, Document, Types } from "mongoose";

export interface DeliveryAgent extends Document {
  userId: Types.ObjectId;
  age?: number;
  rating?: number;
  totalDeliveries: number;
  successRate?: number;
  avgDelayMinutes?: number;
  preferredAreas?: string[];
  currentStatus: "AVAILABLE" | "ON_ROUTE";
}

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
  },
  { collection: "delivery_agents" },
);

const DeliveryAgentModel =
  models.DeliveryAgent ||
  model<DeliveryAgent>("DeliveryAgent", deliveryAgentSchema);

export default DeliveryAgentModel;
