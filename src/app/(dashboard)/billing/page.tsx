import { getInvoices } from "@/actions/billing";
import { getPatients } from "@/actions/patients";
import { BillingClient } from "@/components/billing/billing-client";

export default async function BillingPage() {
  const [invoices, patients] = await Promise.all([
    getInvoices(),
    getPatients(),
  ]);

  // Transform data if needed (e.g., date formats or mapping types)
  const patientsList = patients.map(p => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BillingClient 
        initialInvoices={invoices as any[]} 
        patients={patientsList} 
      />
    </div>
  );
}
