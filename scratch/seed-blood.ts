import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@base-ui/react/node_modules/@prisma/adapter-pg' // Wait, path might be wrong. I'll use a simpler script.

const prisma = new PrismaClient();

async function seedBlood() {
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
  console.log("Blood bank seeded!");
}

seedBlood().catch(console.error).finally(() => prisma.$disconnect());
