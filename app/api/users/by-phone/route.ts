import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }

    await connectDB();

    const user = await UserModel.findOne({ phone: phone.trim() })
      .select("name role roles phone email")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      role: user.role,
      roles: user.roles || [],
      phone: user.phone,
      email: user.email,
    });
  } catch (error) {
    console.error("Lookup user by phone failed", error);
    return NextResponse.json({ error: "Unable to lookup user" }, { status: 500 });
  }
}
