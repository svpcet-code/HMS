"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getDoctors() {
  noStore();
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function createDoctor(data: {
  name: string;
  specialization: string;
  contactNumber: string;
  userId: string;
  image?: string;
}) {
  try {
    const doctor = await prisma.doctor.upsert({
      where: { userId: data.userId },
      update: {
        name: data.name,
        specialization: data.specialization,
        contactNumber: data.contactNumber,
        image: data.image,
      },
      create: {
        name: data.name,
        specialization: data.specialization,
        contactNumber: data.contactNumber,
        userId: data.userId,
        image: data.image,
      },
    });
    
    revalidatePath("/doctors");
    return { success: true, doctor };
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDoctor(id: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: { where: { status: "SCHEDULED" } },
      },
    });

    if (!doctor) return { success: false, error: "Doctor not found" };

    if (doctor.appointments.length) {
      return { success: false, error: "Cannot delete doctor with scheduled appointments." };
    }

    // Delete doctor and their user account
    await prisma.$transaction([
      prisma.doctor.delete({ where: { id } }),
      prisma.user.delete({ where: { id: doctor.userId } }),
    ]);
    
    revalidatePath("/doctors");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting doctor:", error);
    return { success: false, error: error.message };
  }
}
