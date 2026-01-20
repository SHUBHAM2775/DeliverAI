import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import NotificationModel from '@/models/notification';
import OrderModel from '@/models/Order';
import UniqueLinkModel from '@/models/UniqueLink';
import UserModel from '@/models/User';
import { sendEmergencyAlertEmail } from '@/services/emailService';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId, disruption } = body || {};

    if (!orderId || !disruption) {
      return NextResponse.json({ error: 'orderId and disruption are required' }, { status: 400 });
    }

    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const receiver = await UserModel.findById(order.receiverId).lean();
    const receiverEmail = receiver?.email;
    const receiverName = receiver?.name || 'Customer';
    if (!receiverEmail) {
      return NextResponse.json({ error: 'Receiver email not found' }, { status: 400 });
    }

    // Ensure UniqueLink exists for this order
    let uniqueLink = await UniqueLinkModel.findOne({ orderId: order._id });
    if (!uniqueLink) {
      uniqueLink = await UniqueLinkModel.create({ orderId: order._id, uuid: uuidv4() });
    }

    // Create notification for sender
    await NotificationModel.create({
      userId: order.senderId,
      type: 'ALERT',
      message: `Driver reported disruption: ${disruption}`,
      orderId: order._id,
    });

    // Send customer email
    await sendEmergencyAlertEmail(receiverEmail, receiverName, uniqueLink.uuid, disruption);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Driver emergency error:', error);
    return NextResponse.json({ error: 'Failed to process driver emergency' }, { status: 500 });
  }
}
