import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("password", 10);

    // 1. Create a Doctor User
    const docUser = await prisma.user.upsert({
      where: { email: "doctor1@hms.com" },
      update: { password: hashedPassword },
      create: {
        email: "doctor1@hms.com",
        password: hashedPassword,
        name: "Dr. Sarah Jenkins",
        role: "DOCTOR",
      }
    });

    // 2. Create an Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@hms.com" },
      update: { password: hashedPassword },
      create: {
        email: "admin@hms.com",
        password: hashedPassword,
        name: "Super Admin",
        role: "ADMIN",
      }
    });

    // 2. Create the Doctor Profile
    const doctor = await prisma.doctor.upsert({
      where: { userId: docUser.id },
      update: {},
      create: {
        userId: docUser.id,
        name: docUser.name || "Dr. Sarah Jenkins",
        specialization: "Cardiology",
        contactNumber: "+91 9876543210",
        workingHours: "09:00 AM - 05:00 PM"
      }
    });

    // 3. Create Additional Doctors for different departments
    const extraDepts = ["Neurology", "Orthopedics", "Pediatrics", "Oncology", "Gynecology"];
    for (const dept of extraDepts) {
      const email = `${dept.toLowerCase()}@hms.com`;
      const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
          email,
          password: hashedPassword,
          name: `Dr. ${dept} Expert`,
          role: "DOCTOR",
        }
      });
      await prisma.doctor.upsert({
        where: { userId: user.id },
        update: { specialization: dept },
        create: {
          userId: user.id,
          name: `Dr. ${dept} Expert`,
          specialization: dept,
          contactNumber: "+91 0000000000",
        }
      });
    }


    // 4. Create a Patient User
    const patientUser = await prisma.user.upsert({
      where: { email: "patient1@hms.com" },
      update: { password: hashedPassword },
      create: {
        email: "patient1@hms.com",
        password: hashedPassword,
        name: "Rahul Sharma",
        role: "PATIENT",
      }
    });

    // 5. Create Patients
    let patient1 = await prisma.patient.findFirst({ where: { contactNumber: "+91 9988776655" } });
    if (!patient1) {
      patient1 = await prisma.patient.create({
        data: {
          name: "Rahul Sharma",
          dateOfBirth: new Date("1985-06-15"),
          gender: "Male",
          contactNumber: "+91 9988776655",
          address: "New Delhi, India",
          bloodGroup: "O+",
          userId: patientUser.id
        }
      });
    } else {
      await prisma.patient.update({
        where: { id: patient1.id },
        data: { userId: patientUser.id }
      });
    }

    let patient2 = await prisma.patient.findFirst({ where: { contactNumber: "+91 8877665544" } });
    if (!patient2) {
      patient2 = await prisma.patient.create({
        data: {
          name: "Priya Patel",
          dateOfBirth: new Date("1992-02-28"),
          gender: "Female",
          contactNumber: "+91 8877665544",
          address: "Mumbai, India",
          bloodGroup: "A+",
        }
      });
    }

    // 5. Clean and Seed Appointments (for Bar Chart)
    await prisma.appointment.deleteMany({});
    const doctors = await prisma.doctor.findMany();
    for (let i = 0; i < 20; i++) {
      const doc = doctors[i % doctors.length];
      await prisma.appointment.create({
        data: {
          patientId: i % 2 === 0 ? patient1.id : patient2.id,
          doctorId: doc.id,
          date: new Date(),
          status: "SCHEDULED"
        }
      });
    }
    
    // 6. Initialize Blood Bank
    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    for (const group of bloodGroups) {
      await prisma.bloodBank.upsert({
        where: { bloodGroup: group },
        update: {},
        create: {
          bloodGroup: group,
          units: Math.floor(Math.random() * 50) + 10,
        }
      });
    }

    // 7. Initialize/Clean Beds
    const wards = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology"];
    for (let i = 1; i <= 10; i++) {
        await prisma.bed.upsert({
            where: { id: `bed-${i}` },
            update: {},
            create: {
                id: `bed-${i}`,
                bedNumber: `B-${i}`,
                ward: wards[i % wards.length],
                status: (i % 3 === 0) ? "AVAILABLE" : "OCCUPIED"
            }
        });
    }

    // 8. Clean and Seed Admissions (for Donut Chart)
    await prisma.admission.deleteMany({});
    const statuses = ["Recovered", "In Treatment", "Critical"];
    for (let i = 1; i <= 12; i++) {
        await prisma.admission.create({
            data: {
                patientId: i % 2 === 0 ? patient1.id : patient2.id,
                bedId: `bed-${(i % 10) + 1}`,
                status: statuses[i % 3]
            }
        });
    }

    return NextResponse.json({ message: "Seed successful! Dashboard data initialized." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
