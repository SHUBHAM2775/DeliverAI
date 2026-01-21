import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";

const roleHrefMap: Record<string, string> = {
  admin: "/admin_page/overview",
  sender: "/sender_page/dashboard",
  receiver: "/receiver_page/notifications",
  driver: "/driver_page",
};

const allowedRoles = new Set(["ADMIN", "SENDER", "RECEIVER", "AGENT", "DRIVER"]);

export async function POST(req: Request) {
  try {
    const { role, phone, password, name } = await req.json();

    if (!role || !phone || !password) {
      return NextResponse.json({ error: "role, phone, and password are required" }, { status: 400 });
    }

    const normalizedRole = String(role).trim().toUpperCase();
    const normalizedPhone = String(phone).trim();

    if (!allowedRoles.has(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await UserModel.findOne({ phone: normalizedPhone });

    // Step 1: no name provided -> credential check and decide if name is needed
    if (!name) {
      if (!existingUser) {
        return NextResponse.json({ requiresName: true }, { status: 200 });
      }

      const userRoles = existingUser.roles || [];
      const roleMatches = existingUser.role === normalizedRole || userRoles.includes(normalizedRole);
      if (!roleMatches) {
        return NextResponse.json({ error: "Role does not match this account" }, { status: 400 });
      }

      if (!existingUser.password) {
        return NextResponse.json({ requiresName: true }, { status: 200 });
      }

      const isValid = await bcrypt.compare(String(password), existingUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      if (existingUser.isFirstTime) {
        return NextResponse.json({ requiresName: true }, { status: 200 });
      }

      existingUser.lastLoginAt = new Date();
      await existingUser.save();

      const redirect = roleHrefMap[String(role).toLowerCase()] || "/";
      return NextResponse.json({ success: true, redirect, name: existingUser.name, role: existingUser.role, phone: existingUser.phone, roles: existingUser.roles });
    }

    // Step 2: name provided -> create or complete profile
    const passwordHash = await bcrypt.hash(String(password), 10);

    let finalName = String(name).trim();
    let finalRole = normalizedRole;
    let finalPhone = normalizedPhone;

    if (existingUser) {
      existingUser.name = finalName;
      existingUser.role = normalizedRole;
      const mergedRoles = new Set([...(existingUser.roles || []), normalizedRole]);
      existingUser.roles = Array.from(mergedRoles);
      existingUser.password = passwordHash;
      existingUser.isFirstTime = false;
      existingUser.lastLoginAt = new Date();
      existingUser.status = existingUser.status || "ACTIVE";
      await existingUser.save();
      finalName = existingUser.name;
      finalRole = normalizedRole;
      finalPhone = existingUser.phone;
    } else {
      const created = await UserModel.create({
        name: finalName,
        role: normalizedRole,
        roles: [normalizedRole],
        phone: normalizedPhone,
        password: passwordHash,
        isFirstTime: false,
        status: "ACTIVE",
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
      finalName = created.name;
      finalRole = created.role;
      finalPhone = created.phone;
    }

    const redirect = roleHrefMap[String(role).toLowerCase()] || "/";
    return NextResponse.json({ success: true, redirect, name: finalName, role: finalRole, phone: finalPhone, roles: [normalizedRole] });
  } catch (error) {
    console.error("Auth login error", error);
    return NextResponse.json({ error: "Unable to process login" }, { status: 500 });
  }
}
