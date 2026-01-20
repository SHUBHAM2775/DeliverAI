import { Schema, model, models, Document, Types } from "mongoose";

export interface UniqueLink extends Document {
  uuid: string;
  orderId: Types.ObjectId;
  createdAt?: Date;
  expiresAt?: Date;
  isUsed?: boolean;
}

const uniqueLinkSchema = new Schema<UniqueLink>(
  {
    uuid: { 
      type: String, 
      required: true, 
      unique: true,
      index: true,
    },
    orderId: { 
      type: Schema.Types.ObjectId, 
      ref: "Order", 
      required: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      // Links expire after 30 days by default
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    createdAt: { type: Date },
  },
  { timestamps: true, collection: "unique_links" },
);

// Index for faster lookups
uniqueLinkSchema.index({ uuid: 1 });
uniqueLinkSchema.index({ orderId: 1 });

const UniqueLinkModel = models.UniqueLink || model<UniqueLink>("UniqueLink", uniqueLinkSchema);

export default UniqueLinkModel;
