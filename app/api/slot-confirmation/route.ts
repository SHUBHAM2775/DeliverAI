import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SlotConfirmationModel from '@/models/slotConfirmation';
import OrderModel from '@/models/Order';
import UserModel from '@/models/User';
import UniqueLinkModel from '@/models/UniqueLink';
import { Types } from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { orderId, uuid, date, slot } = body;

    if (!orderId || !date || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let receiverId = null;
    let finalOrderId = orderId;

    // Check if it's a valid MongoDB ObjectId
    if (Types.ObjectId.isValid(orderId)) {
      // Fetch order to get receiver info
      const order = await OrderModel.findById(orderId).lean();
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      receiverId = order.receiverId;
    } else {
      // For demo orders, create or use a default receiver
      const defaultReceiver = await UserModel.findOne({ role: 'RECEIVER' }).lean();
      if (defaultReceiver) {
        receiverId = defaultReceiver._id;
      }
      // For demo, generate a valid ObjectId
      finalOrderId = new Types.ObjectId().toString();
    }

    // Mark unique link as used if provided
    if (uuid) {
      await UniqueLinkModel.updateOne(
        { uuid },
        { isUsed: true }
      );
    }

    // Determine if it's a custom slot (user-defined availability) or a recommended slot
    const isCustomSlot = slot.startsWith('custom-');
    const slotData: any = {
      orderId: finalOrderId,
      receiverId: receiverId || new Types.ObjectId(),
      selectedDate: date,
      confirmationStatus: 'CONFIRMED',
      confirmedAt: new Date(),
      rescheduleCount: 0,
    };

    if (isCustomSlot) {
      // Custom time slot from slider
      slotData.customSlot = slot;
    } else {
      // AI-recommended slot
      slotData.customSlot = slot;
    }

    const confirmation = await SlotConfirmationModel.create(slotData);

    // Update the Order with the confirmed slot information
    if (Types.ObjectId.isValid(orderId)) {
      const updateData: any = {
        orderStatus: 'CONFIRMED',
        deliveryDate: new Date(date),
        customSlotTime: slot,
      };
      
      await OrderModel.findByIdAndUpdate(orderId, updateData);
    }

    return NextResponse.json(
      {
        success: true,
        confirmationId: confirmation._id,
        message: 'Slot confirmed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create slot confirmation', error);
    const message = error instanceof Error ? error.message : 'Failed to create slot confirmation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId || orderId === 'undefined' || orderId === 'null') {
      return NextResponse.json({ error: 'Valid orderId is required' }, { status: 400 });
    }

    // Validate ObjectId format using imported Types
    if (!Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid orderId format' }, { status: 400 });
    }

    const confirmation = await SlotConfirmationModel.findOne({ orderId })
      .populate('orderId')
      .populate('receiverId')
      .sort({ confirmedAt: -1 })
      .lean();

    if (!confirmation) {
      return NextResponse.json({ error: 'No confirmation found' }, { status: 404 });
    }

    return NextResponse.json(confirmation);
  } catch (error) {
    console.error('Failed to fetch slot confirmation', error);
    return NextResponse.json({ error: 'Failed to fetch confirmation' }, { status: 500 });
  }
}
