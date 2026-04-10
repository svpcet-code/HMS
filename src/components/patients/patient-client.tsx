"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical } from "lucide-react";
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
import { AddPatientModal } from "@/components/modals/add-patient-modal";
import { RemovePatientModal } from "@/components/modals/remove-patient-modal";

interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  contactNumber: string;
  createdAt: Date;
}

export function PatientClient({ initialData }: { initialData: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = initialData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Patients</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <RemovePatientModal patients={initialData} />
          <AddPatientModal />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search patients by name or ID..." 
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
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Patient ID</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Name</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Gender</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Contact</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Date Added</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-700 transition-colors cursor-pointer group">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100 italic text-xs">{patient.id}</TableCell>
                  <TableCell className="font-medium text-blue-600 dark:text-blue-400 group-hover:underline">{patient.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.gender === 'Female' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {patient.gender}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{patient.contactNumber}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {new Date(patient.createdAt).toLocaleDateString()}
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
                <TableCell colSpan={6} className="h-24 text-center text-slate-500 dark:text-slate-400">
                  No patients found in database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
