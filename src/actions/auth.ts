"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as any || "PATIENT";

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    });

    // Automatically create the corresponding profile
    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name: name,
          specialization: "General Medicine",
          contactNumber: "Not Provided",
        }
      });
    } else if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          name: name,
          dateOfBirth: new Date(1990, 0, 1),
          gender: "Not Specified",
          contactNumber: "Not Provided",
        }
      });
    }

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Internal server error" };
  }
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // For security, don't reveal if user exists
      return { success: true, message: "If an account exists, a reset link has been generated." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      }
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    // Simulate email sending
    console.log("------------------------------------------");
    console.log("PASSWORD RESET REQUEST FOR:", email);
    console.log("RESET LINK:", resetLink);
    console.log("------------------------------------------");

    return { 
      success: true, 
      message: "Password reset link generated. Check server logs (Simulation Mode).",
      token // Returning token for easy testing in demo
    };
  } catch (error) {
    console.error("Reset request error:", error);
    return { error: "Internal server error" };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) return { error: "Missing token or password" };

  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return { error: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Reset error:", error);
    return { error: "Internal server error" };
  }
}
