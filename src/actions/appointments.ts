"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { date: "desc" },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function createAppointment(data: {
  patientId: string;
  doctorId: string;
  date: string;
  status?: string;
}) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        status: data.status || "SCHEDULED",
      },
    });
    
    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });
    
    revalidatePath("/appointments");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.message };
  }
}
