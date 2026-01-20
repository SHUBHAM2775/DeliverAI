import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import UniqueLinkModel from "@/models/UniqueLink";
import OrderModel from "@/models/Order";
import SlotSelectionClient from "./SlotSelectionClient";

interface OrderData {
  id: string;
  commodityName: string;
  commodityCategory?: string;
  description?: string;
  quantity?: string;
  isFragile: boolean;
  imageUrl?: string;
  deliveryAddress: string;
  area: string;
  pincode: string;
  workingStartTime?: string;
  workingEndTime?: string;
  orderStatus: string;
  deliveryDate?: Date;
  receiverName?: string;
  receiverEmail?: string;
  receiverPhone?: string;
  senderName?: string;
  senderEmail?: string;
  createdAt?: Date;
}

async function getOrderByUuid(uuid: string): Promise<OrderData | null> {
  try {
    await connectDB();

    // Find the unique link
    const uniqueLink = await UniqueLinkModel.findOne({ uuid }).lean();

    if (!uniqueLink) {
      console.error(`Unique link not found for UUID: ${uuid}`);
      return null;
    }

    // Check if link has expired
    if (uniqueLink.expiresAt && new Date(uniqueLink.expiresAt) < new Date()) {
      console.error(`Link expired for UUID: ${uuid}, expiresAt: ${uniqueLink.expiresAt}`);
      return null;
    }

    // Check if link has been used
    if (uniqueLink.isUsed) {
      console.error(`Link already used for UUID: ${uuid}`);
      return null;
    }

    // Fetch the order with populated sender and receiver details
    const order = await OrderModel.findById(uniqueLink.orderId)
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone")
      .lean();

    if (!order) {
      console.error(`Order not found for orderId: ${uniqueLink.orderId}`);
      return null;
    }

    console.log(`Successfully fetched order for UUID: ${uuid}, orderId: ${order._id}`);

    // Format order data
    return {
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
    };
  } catch (error) {
    console.error("Failed to fetch order by UUID", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    uuid: string;
  }> | {
    uuid: string;
  };
}

export default async function SlotSelectionPage({ params }: PageProps) {
  // Handle both sync and async params (Next.js 15+ uses Promise)
  const resolvedParams = params instanceof Promise ? await params : params;
  const { uuid } = resolvedParams;

  if (!uuid || typeof uuid !== 'string') {
    console.error("Invalid UUID in params:", uuid);
    notFound();
  }

  const orderData = await getOrderByUuid(uuid);

  if (!orderData) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8 min-h-full flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600">
              This link is invalid, expired, or has already been used. Please
              contact the sender for a new link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <SlotSelectionClient orderData={orderData} uuid={uuid} />;
}
