"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLabTests() {
  try {
    return await prisma.labTest.findMany({
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    return [];
  }
}

export async function createLabTest(data: {
  testName: string;
  patientId: string;
  status?: string;
}) {
  try {
    const test = await prisma.labTest.create({
      data: {
        testName: data.testName,
        patientId: data.patientId,
        status: data.status || "PENDING",
      },
    });
    
    revalidatePath("/laboratory");
    return { success: true, test };
  } catch (error: any) {
    console.error("Error creating lab test:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLabTest(id: string) {
  try {
    await prisma.labTest.delete({
      where: { id },
    });
    
    revalidatePath("/laboratory");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lab test:", error);
    return { success: false, error: error.message };
  }
}
