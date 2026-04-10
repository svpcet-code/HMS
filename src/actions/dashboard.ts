"use server";

import prisma from "@/lib/prisma";

export async function getDashboardChartsData() {
  try {
    // 1. Get Patients by Department (Doctor Specialization)
    const appts = await prisma.appointment.findMany({
      include: {
        doctor: true
      }
    });

    const deptCounts: Record<string, number> = {};
    appts.forEach(a => {
      // Standardize to case-sensitive or whatever we use in colors
      const dept = a.doctor.specialization;
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const barColors: Record<string, string> = {
      Cardiology: "#ef4444",
      Neurology: "#8b5cf6",
      Orthopedics: "#f59e0b",
      Pediatrics: "#10b981",
      Oncology: "#6366f1",
      Gynecology: "#ec4899",
    };

    const barData = Object.entries(deptCounts).map(([label, value]) => ({
      label,
      value: Number(value),
      color: barColors[label] || "#94a3b8"
    }));

    // 2. Get Patient Status (Admissions)
    const admissions = await prisma.admission.findMany();

    const statusCounts: Record<string, number> = {};
    admissions.forEach(a => {
      const status = a.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusColors: Record<string, string> = {
      Recovered: "#10b981",
      "In Treatment": "#f59e0b",
      Critical: "#ef4444",
    };

    const donutData = Object.entries(statusCounts).map(([label, value]) => ({
      label,
      value: Number(value),
      color: statusColors[label] || "#94a3b8"
    }));

    // Ensure we return valid arrays even if empty
    return { 
      barData: barData.length > 0 ? barData : [
        { label: "Cardiology", value: 0, color: "#ef4444" },
        { label: "Neurology", value: 0, color: "#8b5cf6" }
      ], 
      donutData: donutData.length > 0 ? donutData : [
        { label: "In Treatment", value: 0, color: "#f59e0b" }
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
