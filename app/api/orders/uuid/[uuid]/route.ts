import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UniqueLinkModel from "@/models/UniqueLink";
import OrderModel from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> | { uuid: string } }
) {
  try {
    await connectDB();

    // Handle both sync and async params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params;
    const { uuid } = resolvedParams;

    if (!uuid) {
      return NextResponse.json(
        { error: "UUID is required" },
        { status: 400 }
      );
    }

    // Find the unique link
    const uniqueLink = await UniqueLinkModel.findOne({ uuid }).lean();

    if (!uniqueLink) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (uniqueLink.expiresAt && new Date(uniqueLink.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Link has expired" },
        { status: 410 }
      );
    }

    // Check if link has been used
    if (uniqueLink.isUsed) {
      return NextResponse.json(
        { error: "Link has already been used" },
        { status: 410 }
      );
    }

    // Fetch the order with populated sender and receiver details
    const order = await OrderModel.findById(uniqueLink.orderId)
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone")
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Return order details
    return NextResponse.json({
      order: {
        id: order._id.toString(),
        commodityName: order.commodityName,
        commodityCategory: order.commodityCategory,
        description: order.description,
        quantity: order.quantity,
        isFragile: order.isFragile,
        imageUrl: order.imageUrl,
        deliveryAddress: order.deliveryAddress,
        area: order.area,
        pincode: order.pincode,
        workingStartTime: order.workingStartTime,
        workingEndTime: order.workingEndTime,
        orderStatus: order.orderStatus,
        deliveryDate: order.deliveryDate,
        receiverName: (order.receiverId as any)?.name,
        receiverEmail: (order.receiverId as any)?.email,
        receiverPhone: (order.receiverId as any)?.phone || order.receiverPhone,
        senderName: (order.senderId as any)?.name,
        senderEmail: (order.senderId as any)?.email,
        createdAt: order.createdAt,
      },
      uniqueLink: {
        uuid: uniqueLink.uuid,
        isUsed: uniqueLink.isUsed,
        expiresAt: uniqueLink.expiresAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch order by UUID", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch order: ${message}` },
      { status: 500 }
    );
  }
}
