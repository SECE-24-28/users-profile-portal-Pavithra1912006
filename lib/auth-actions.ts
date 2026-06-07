"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid credentials" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid credentials" };

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Seed admin user if none exists
export async function seedAdmin() {
  const exists = await prisma.user.findUnique({ where: { email: "admin@mfi.com" } });
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: { email: "admin@mfi.com", password: hashed, role: "admin" },
    });
  }
}
