"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}

export async function createPatient(data: {
  name: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address?: string;
  bloodGroup?: string;
}) {
  try {
    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        contactNumber: data.contactNumber,
        address: data.address,
        bloodGroup: data.bloodGroup,
      },
    });
    
    revalidatePath("/patients");
    return { success: true, patient };
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePatient(id: string) {
  try {
    // Check for active admissions or appointments
    const activeData = await prisma.patient.findUnique({
      where: { id },
      include: {
        admissions: { where: { discharge: null } },
        appointments: { where: { status: "SCHEDULED" } },
      },
    });

    if (activeData?.admissions.length || activeData?.appointments.length) {
      return { 
        success: false, 
        error: "Cannot delete patient with active admissions or scheduled appointments." 
      };
    }

    await prisma.patient.delete({
      where: { id },
    });
    
    revalidatePath("/patients");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    return { success: false, error: error.message };
  }
}
