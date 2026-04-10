"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMedicines() {
  try {
    return await prisma.medicine.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
}

export async function createMedicine(data: {
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate?: string;
}) {
  try {
    const medicine = await prisma.medicine.create({
      data: {
        name: data.name,
        category: data.category,
        stock: Number(data.stock),
        price: Number(data.price),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });
    
    revalidatePath("/pharmacy");
    return { success: true, medicine };
  } catch (error: any) {
    console.error("Error creating medicine:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMedicine(id: string) {
  try {
    await prisma.medicine.delete({
      where: { id },
    });
    
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting medicine:", error);
    return { success: false, error: error.message };
  }
}
