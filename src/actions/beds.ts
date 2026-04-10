"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBeds() {
  try {
    return await prisma.bed.findMany({
      include: {
        admissions: true
      },
      orderBy: { bedNumber: "asc" },
    });
  } catch (error) {
    console.error("Error fetching beds:", error);
    return [];
  }
}

export async function createBed(data: {
  bedNumber: string;
  ward: string;
  status: string;
}) {
  try {
    const bed = await prisma.bed.create({
      data: {
        bedNumber: data.bedNumber,
        ward: data.ward,
        status: data.status,
      },
    });
    
    revalidatePath("/beds");
    return { success: true, bed };
  } catch (error: any) {
    console.error("Error creating bed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBed(bedId: string) {
  try {
    // Check for active admissions first
    const activeAdmission = await prisma.admission.findFirst({
        where: { bedId, discharge: null }
    });

    if (activeAdmission) {
        return { success: false, error: "Cannot remove bed with an active admission." };
    }

    await prisma.bed.delete({
      where: { id: bedId },
    });
    
    revalidatePath("/beds");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting bed:", error);
    return { success: false, error: error.message };
  }
}
