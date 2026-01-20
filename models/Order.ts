import { Schema, model, models, Document, Types } from "mongoose";

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Order extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  agentId?: Types.ObjectId;
  commodityName: string;
  commodityCategory?: string;
  description?: string;
  quantity?: string;
  isFragile: boolean;
  imageUrl?: string;
  pickupLocation?: GeoLocation;
  deliveryAddress: GeoLocation;
  area: string;
  pincode: string;
  workingStartTime?: string;
  workingEndTime?: string;
  geoLocation?: GeoLocation;
  orderStatus: "CREATED" | "CONFIRMED" | "DELIVERED" | "FAILED";
  deliveryDate?: Date;
  finalSlotId?: Types.ObjectId;
  deliveryAttemptCount: number;
  firstAttemptSuccess?: boolean;
  confirmationUuid?: string;
  receiverPhone?: string;
  createdAt?: Date;
}

const geoLocationSchema = new Schema<GeoLocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<Order>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agentId: { type: Schema.Types.ObjectId, ref: "User" },
    commodityName: { type: String, required: true },
    commodityCategory: { type: String },
    description: { type: String },
    quantity: { type: String },
    isFragile: { type: Boolean, default: false },
    imageUrl: { type: String },
    pickupLocation: { type: geoLocationSchema },
    deliveryAddress: { type: geoLocationSchema, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    workingStartTime: { type: String },
    workingEndTime: { type: String },
    geoLocation: { type: geoLocationSchema },
    orderStatus: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "DELIVERED", "FAILED"],
      default: "CREATED",
    },
    deliveryDate: { type: Date },
    finalSlotId: { type: Schema.Types.ObjectId, ref: "DeliverySlot" },
    deliveryAttemptCount: { type: Number, default: 0 },
    firstAttemptSuccess: { type: Boolean },
    confirmationUuid: { type: String },
    receiverPhone: { type: String },
    createdAt: { type: Date },
  },
  { timestamps: true, collection: "orders" },
);

const OrderModel = models.Order || model<Order>("Order", orderSchema);

export default OrderModel;
