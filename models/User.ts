import { Schema, model, models, Document } from "mongoose";

export type UserRole = "ADMIN" | "SENDER" | "RECEIVER" | "AGENT" | "DRIVER";

export interface User extends Document {
  role?: UserRole; // primary role for legacy compatibility
  roles: UserRole[];
  name: string;
  email?: string;
  phone: string;
  password: string;
  isFirstTime: boolean;
  status: "ACTIVE" | "SUSPENDED";
  createdAt?: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<User>(
  {
    role: {
      type: String,
      enum: ["ADMIN", "SENDER", "RECEIVER", "AGENT", "DRIVER"],
      required: false,
    },
    roles: {
      type: [String],
      enum: ["ADMIN", "SENDER", "RECEIVER", "AGENT", "DRIVER"],
      default: [],
    },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isFirstTime: { type: Boolean, default: true },
    status: { type: String, enum: ["ACTIVE", "SUSPENDED"], default: "ACTIVE" },
    createdAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, collection: "users" },
);

const UserModel = models.User || model<User>("User", userSchema);

export default UserModel;
