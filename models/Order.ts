import { Schema, model, models, Document, Types } from 'mongoose';

interface GeoLocation {
  latitude?: number;
  longitude?: number;
}

export interface Order extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  agentId?: Types.ObjectId;
  commodityName: string;
  commodityCategory?: string;
  isFragile: boolean;
  imageUrl?: string;
  deliveryAddress: string;
  area: string;
  pincode: string;
  geoLocation?: GeoLocation;
  orderStatus: 'CREATED' | 'CONFIRMED' | 'DELIVERED' | 'FAILED';
  deliveryDate?: Date;
  finalSlotId?: Types.ObjectId;
  deliveryAttemptCount: number;
  firstAttemptSuccess?: boolean;
  createdAt?: Date;
}

const geoLocationSchema = new Schema<GeoLocation>(
  {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    commodityName: { type: String, required: true },
    commodityCategory: { type: String },
    isFragile: { type: Boolean, default: false },
    imageUrl: { type: String },
    deliveryAddress: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    geoLocation: { type: geoLocationSchema },
    orderStatus: { type: String, enum: ['CREATED', 'CONFIRMED', 'DELIVERED', 'FAILED'], default: 'CREATED' },
    deliveryDate: { type: Date },
    finalSlotId: { type: Schema.Types.ObjectId, ref: 'DeliverySlot' },
    deliveryAttemptCount: { type: Number, default: 0 },
    firstAttemptSuccess: { type: Boolean },
    createdAt: { type: Date },
  },
  { timestamps: true, collection: 'orders' }
);

const OrderModel = models.Order || model<Order>('Order', orderSchema);

export default OrderModel;
