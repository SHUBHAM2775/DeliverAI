import { Schema, model, models, Document } from 'mongoose';

export interface User extends Document {
  role: 'ADMIN' | 'SENDER' | 'RECEIVER' | 'AGENT';
  name: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt?: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<User>(
  {
    role: { type: String, enum: ['ADMIN', 'SENDER', 'RECEIVER', 'AGENT'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    createdAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, collection: 'users' }
);

const UserModel = models.User || model<User>('User', userSchema);

export default UserModel;
