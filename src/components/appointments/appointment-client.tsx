"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Calendar, User, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookAppointmentModal } from "@/components/modals/book-appointment-modal";
import { RemoveAppointmentModal } from "@/components/modals/remove-appointment-modal";

interface Appointment {
  id: string;
  patient: { name: string };
  doctor: { name: string };
  date: Date;
  status: string;
}

export function AppointmentClient({ 
  initialData, 
  patients, 
  doctors 
}: { 
  initialData: Appointment[],
  patients: { id: string, name: string }[],
  doctors: { id: string, name: string }[]
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = initialData.filter(a => 
    a.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <RemoveAppointmentModal 
            appointments={initialData.map(a => ({ 
              id: a.id, 
              patientName: a.patient.name, 
              doctorName: a.doctor.name, 
              date: a.date 
            }))} 
          />
          <BookAppointmentModal patients={patients} doctors={doctors} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by patient or doctor name..." 
              className="pl-9 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 dark:hover:bg-slate-800">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
            <TableRow className="dark:border-slate-700">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Patient</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Doctor</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Date & Time</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-700 transition-colors cursor-pointer group">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    {appointment.patient.name}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-400" />
                    {appointment.doctor.name}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(appointment.date).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="dark:border-slate-700">
                <TableCell colSpan={5} className="h-24 text-center text-slate-500 dark:text-slate-400">
                  No appointments found in database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
