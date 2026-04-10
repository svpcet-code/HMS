"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export async function createInvoice(data: {
  patientId: string;
  amount: number;
  type: string;
  status: string;
}) {
  console.log("Creating invoice with data:", data);
  
  try {
    // Basic validation
    if (!data.patientId) throw new Error("Patient ID is required");
    if (isNaN(data.amount) || data.amount <= 0) throw new Error("A valid positive amount is required");
    if (!data.type) throw new Error("Service type is required");

    const invoice = await prisma.invoice.create({
      data: {
        patientId: data.patientId,
        amount: data.amount,
        type: data.type,
        status: data.status,
      },
    });
    
    console.log("Invoice created successfully:", invoice.id);
    revalidatePath("/billing");
    return { success: true, invoice };
  } catch (error: any) {
    console.error("DEBUG: createInvoice failed:", {
      message: error.message,
      data: data,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    
    revalidatePath("/billing");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: error.message };
  }
}
