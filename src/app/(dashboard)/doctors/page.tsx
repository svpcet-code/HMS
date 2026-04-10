import { getDoctors } from "@/actions/doctors";
import { DoctorClient } from "@/components/doctors/doctor-client";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DoctorClient initialData={doctors} />
    </div>
  );
}
