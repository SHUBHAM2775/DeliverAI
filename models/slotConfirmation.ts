import { Schema, model, models, Document, Types } from "mongoose";

export interface SlotConfirmation extends Document {
  orderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  slotId?: Types.ObjectId;
  customSlot?: string;
  selectedDate?: string;
  confirmationStatus: "CONFIRMED" | "PENDING";
  confirmedAt?: Date;
  cutoffTime?: Date;
  rescheduleCount: number;
}

const slotConfirmationSchema = new Schema<SlotConfirmation>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "DeliverySlot",
    },
    customSlot: { type: String },
    selectedDate: { type: String },
    confirmationStatus: {
      type: String,
      enum: ["CONFIRMED", "PENDING"],
      default: "CONFIRMED",
    },
    confirmedAt: { type: Date, default: Date.now },
    cutoffTime: { type: Date },
    rescheduleCount: { type: Number, default: 0 },
  },
  { collection: "slot_confirmations", timestamps: true },
);

const SlotConfirmationModel =
  models.SlotConfirmation ||
  model<SlotConfirmation>("SlotConfirmation", slotConfirmationSchema);

export default SlotConfirmationModel;
