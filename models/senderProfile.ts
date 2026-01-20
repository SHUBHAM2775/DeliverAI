import { Schema, model, models, Document, Types } from "mongoose";

export interface SenderProfile extends Document {
  userId: Types.ObjectId;
  organizationName?: string;
  defaultPickupAddress?: string;
  startHour?: number;
  endHour?: number;
  totalOrders: number;
  failedDeliveryRate?: number;
}

const senderProfileSchema = new Schema<SenderProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationName: { type: String },
    defaultPickupAddress: { type: String },
    startHour: { type: Number, min: 0, max: 23 },
    endHour: { type: Number, min: 0, max: 23 },
    totalOrders: { type: Number, default: 0 },
    failedDeliveryRate: { type: Number },
  },
  { collection: "sender_profiles" },
);

const SenderProfileModel =
  models.SenderProfile ||
  model<SenderProfile>("SenderProfile", senderProfileSchema);

export default SenderProfileModel;
