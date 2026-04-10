import { getPatients } from "@/actions/patients";
import { PatientClient } from "@/components/patients/patient-client";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PatientClient initialData={patients} />
    </div>
  );
}
