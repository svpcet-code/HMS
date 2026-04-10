import prisma from "../src/lib/prisma";

async function checkBloodBank() {
  const data = await prisma.bloodBank.findMany();
  console.log("Blood Bank Data:", data);
}

checkBloodBank()
  .catch(console.error)
  .finally(() => process.exit());
