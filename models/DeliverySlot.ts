import { Schema, model, models, Document } from 'mongoose';

export interface DeliverySlot extends Document {
  date: Date;
  startTime?: string;
  endTime?: string;
  area: string;
  capacity: number;
  bookedCount: number;
  isEnabled: boolean;
  isAiRecommended: boolean;
  successProbability?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

const deliverySlotSchema = new Schema<DeliverySlot>(
  {
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    area: { type: String, required: true },
    capacity: { type: Number, required: true },
    bookedCount: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    isAiRecommended: { type: Boolean, default: false },
    successProbability: { type: Number },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  },
  { collection: 'delivery_slots' }
);

const DeliverySlotModel = models.DeliverySlot || model<DeliverySlot>('DeliverySlot', deliverySlotSchema);

export default DeliverySlotModel;
