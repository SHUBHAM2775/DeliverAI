import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "This endpoint moved to /api/admin_apis/dashboard/overview",
    },
    { status: 410 },
  );
}
