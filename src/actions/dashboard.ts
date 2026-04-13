"use server";

import prisma from "@/lib/prisma";

import { unstable_noStore as noStore } from "next/cache";

export async function getDashboardChartsData() {
  noStore();
  try {
    // 1. Get Doctors by Department (Specialization)
    const doctors = await prisma.doctor.findMany();

    const deptCounts: Record<string, number> = {};
    doctors.forEach(d => {
      const dept = d.specialization;
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const barColors: Record<string, string> = {
      Cardiology: "#ef4444",
      Neurology: "#8b5cf6",
      Orthopedics: "#f59e0b",
      Pediatrics: "#10b981",
      Oncology: "#6366f1",
      Gynecology: "#ec4899",
      "General Medicine": "#3b82f6",
    };

    const barData = Object.entries(deptCounts).map(([label, value]) => ({
      label,
      value: Number(value),
      color: barColors[label] || "#94a3b8"
    }));

    // 2. Get Patient Gender Distribution (replacing Admission Status for better visibility)
    const patients = await prisma.patient.findMany();

    const genderCounts: Record<string, number> = {};
    patients.forEach(p => {
      const gender = p.gender || "Other";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    const genderColors: Record<string, string> = {
      Male: "#3b82f6",
      Female: "#ec4899",
      Other: "#94a3b8",
    };

    const donutData = Object.entries(genderCounts).map(([label, value]) => ({
      label,
      value: Number(value),
      color: genderColors[label] || "#94a3b8"
    }));

    // Ensure we return valid arrays even if empty
    return { 
      barData: barData.length > 0 ? barData : [
        { label: "Cardiology", value: 0, color: "#ef4444" },
        { label: "Neurology", value: 0, color: "#8b5cf6" }
      ], 
      donutData: donutData.length > 0 ? donutData : [
        { label: "Male", value: 0, color: "#3b82f6" },
        { label: "Female", value: 0, color: "#ec4899" }
      ]
    };
  } catch (error) {
    console.error("Error fetching dashboard chart data:", error);
    return { barData: [], donutData: [] };
  }
}

export async function getDashboardStats() {
  try {
    const [patientCount, apptToday, doctorCount, activeAdmissions] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.doctor.count(),
      prisma.admission.count({
        where: {
          discharge: null
        }
      })
    ]);

    return {
      patientCount,
      apptToday,
      doctorCount,
      activeAdmissions
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      patientCount: 0,
      apptToday: 0,
      doctorCount: 0,
      activeAdmissions: 0
    };
  }
}
