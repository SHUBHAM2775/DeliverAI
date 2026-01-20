import { Schema, model, models, Document, Types } from "mongoose";

export interface Notification extends Document {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  type?: "REMINDER" | "ALERT";
  message: string;
}

const notificationSchema = new Schema<Notification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    type: { type: String, enum: ["REMINDER", "ALERT"] },
    message: { type: String, required: true },
  },
  { collection: "notifications" },
);

const NotificationModel =
  models.Notification ||
  model<Notification>("Notification", notificationSchema);

export default NotificationModel;
