import { getDoctors } from "@/actions/doctors";
import { DoctorClient } from "@/components/doctors/doctor-client";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  noStore();
  const doctors = await getDoctors();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DoctorClient initialData={doctors} />
    </div>
  );
}
