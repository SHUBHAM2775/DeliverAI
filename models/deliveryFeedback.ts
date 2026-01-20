import { Schema, model, models, Document, Types } from "mongoose";

export interface DeliveryFeedback extends Document {
  receiverId: Types.ObjectId;
  wasConvenient?: boolean;
  rating?: number;
  comment?: string;
  submittedAt?: Date;
}

const deliveryFeedbackSchema = new Schema<DeliveryFeedback>(
  {
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wasConvenient: { type: Boolean },
    rating: { type: Number },
    comment: { type: String },
    submittedAt: { type: Date },
  },
  { collection: "delivery_feedback" },
);

const DeliveryFeedbackModel =
  models.DeliveryFeedback ||
  model<DeliveryFeedback>("DeliveryFeedback", deliveryFeedbackSchema);

export default DeliveryFeedbackModel;
