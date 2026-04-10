import { getBloodInventory } from "@/actions/blood-bank";
import BloodBankClient from "./blood-bank-client";

export const metadata = {
  title: "Blood Bank | HMS Portal",
  description: "Manage hospital blood inventory and donations.",
};

export default async function BloodBankPage() {
  const inventory = await getBloodInventory();

  return <BloodBankClient inventory={inventory} />;
}
