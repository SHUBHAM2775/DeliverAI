import { Schema, model, models, Document, Types } from 'mongoose';

export interface DeliveryRisk extends Document {
  orderId: Types.ObjectId;
  slotId?: Types.ObjectId;
  riskType?: 'TRAFFIC' | 'WEATHER' | 'AGENT';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  description?: string;
  actionSuggested?: string;
  createdAt?: Date;
}

const deliveryRiskSchema = new Schema<DeliveryRisk>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'DeliverySlot' },
    riskType: { type: String, enum: ['TRAFFIC', 'WEATHER', 'AGENT'] },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    description: { type: String },
    actionSuggested: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'delivery_risks' }
);

const DeliveryRiskModel = models.DeliveryRisk || model<DeliveryRisk>('DeliveryRisk', deliveryRiskSchema);

export default DeliveryRiskModel;
