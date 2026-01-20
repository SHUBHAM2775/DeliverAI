import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliverySlotModel from "@/models/DeliverySlot";

export async function GET() {
  try {
    await connectDB();

    const slots = await DeliverySlotModel.find()
      .sort({ date: -1, startTime: 1 })
      .limit(50)
      .lean();

    const slotData = slots.map((slot) => ({
      slotId: slot._id,
      date: slot.date,
      timeRange: slot.startTime && slot.endTime ? `${slot.startTime} - ${slot.endTime}` : "Not specified",
      area: slot.area,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      successProbability: slot.successProbability ? `${(slot.successProbability * 100).toFixed(1)}%` : "N/A",
      riskLevel: slot.riskLevel || "LOW",
      isAiRecommended: slot.isAiRecommended,
      availabilityPercentage: `${(((slot.capacity - slot.bookedCount) / slot.capacity) * 100).toFixed(1)}%`,
      trafficCongestion: "Medium *",
      weatherCondition: "Clear *",
      demandForecast: "Stable *",
    }));

    return NextResponse.json({
      success: true,
      data: slotData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching slot intelligence",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
