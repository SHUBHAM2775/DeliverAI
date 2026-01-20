import { Schema, model, models, Document, Types } from "mongoose";

interface DeliveryLocation {
  latitude?: number;
  longitude?: number;
}

export interface SlotPrediction extends Document {
  area: string;
  slotId: Types.ObjectId;
  predictedSuccessProbability?: number;
  store_id?: string;
  pickup_availability_window?: string;
  seller_allowed_time_range?: string;
  parcel_category?: string;
  delivery_location?: DeliveryLocation;
}

const deliveryLocationSchema = new Schema<DeliveryLocation>(
  {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const slotPredictionSchema = new Schema<SlotPrediction>(
  {
    area: { type: String, required: true },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "DeliverySlot",
      required: true,
    },
    predictedSuccessProbability: { type: Number },
    store_id: { type: String },
    pickup_availability_window: { type: String },
    seller_allowed_time_range: { type: String },
    parcel_category: { type: String },
    delivery_location: { type: deliveryLocationSchema },
  },
  { collection: "slot_predictions" },
);

const SlotPredictionModel =
  models.SlotPrediction ||
  model<SlotPrediction>("SlotPrediction", slotPredictionSchema);

export default SlotPredictionModel;
