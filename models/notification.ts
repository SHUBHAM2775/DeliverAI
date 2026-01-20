import { Schema, model, models, Document, Types } from "mongoose";

export interface Notification extends Document {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  type?: "REMINDER" | "ALERT";
  message: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<Notification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    type: { type: String, enum: ["REMINDER", "ALERT"] },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { collection: "notifications", timestamps: true },
);

const NotificationModel =
  models.Notification ||
  model<Notification>("Notification", notificationSchema);

export default NotificationModel;
