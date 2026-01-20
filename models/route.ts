import { Schema, model, models, Document, Types } from 'mongoose';

export interface Route extends Document {
  agentId: Types.ObjectId;
  date: Date;
  orders?: Types.ObjectId[];
  estimatedTime?: string;
  routeDistance?: number;
  routeDuration?: number;
  routeFeasibilityScore?: number;
  conflicts?: string[];
}

const routeSchema = new Schema<Route>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    estimatedTime: { type: String },
    routeDistance: { type: Number },
    routeDuration: { type: Number },
    routeFeasibilityScore: { type: Number },
    conflicts: [{ type: String }],
  },
  { collection: 'routes' }
);

const RouteModel = models.Route || model<Route>('Route', routeSchema);

export default RouteModel;
