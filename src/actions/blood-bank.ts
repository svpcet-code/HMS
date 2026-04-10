"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBloodInventory() {
  try {
    const inventory = await prisma.bloodBank.findMany({
      orderBy: { bloodGroup: "asc" },
    });
    return inventory;
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    return [];
  }
}

export async function updateBloodUnits(group: string, units: number) {
  try {
    if (units < 0) throw new Error("Units cannot be negative");
    
    await prisma.bloodBank.update({
      where: { bloodGroup: group },
      data: { units },
    });
    
    revalidatePath("/blood-bank");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating blood units:", error);
    return { success: false, error: error.message };
  }
}

export async function recordDonation(group: string, amount: number) {
  try {
    if (amount <= 0) throw new Error("Donation amount must be positive");
    
    await prisma.bloodBank.update({
      where: { bloodGroup: group },
      data: {
        units: {
          increment: amount,
        },
      },
    });
    
    revalidatePath("/blood-bank");
    return { success: true };
  } catch (error: any) {
    console.error("Error recording donation:", error);
    return { success: false, error: error.message };
  }
}
