import { getAppointments } from "@/actions/appointments";
import { getPatients } from "@/actions/patients";
import { getDoctors } from "@/actions/doctors";
import { AppointmentClient } from "@/components/appointments/appointment-client";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();
  const patients = await getPatients();
  const doctors = await getDoctors();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AppointmentClient 
        initialData={appointments} 
        patients={patients.map(p => ({ id: p.id, name: p.name }))}
        doctors={doctors.map(d => ({ id: d.id, name: d.name }))}
      />
    </div>
  );
}
