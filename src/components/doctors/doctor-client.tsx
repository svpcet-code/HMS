"use client";

import { useState } from "react";
import { Search, Filter, Phone, Award, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddDoctorModal } from "@/components/modals/add-doctor-modal";
import { RemoveDoctorModal } from "@/components/modals/remove-doctor-modal";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contactNumber: string;
  userId: string;
  image?: string | null;
}

export function DoctorClient({ initialData }: { initialData: Doctor[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = initialData.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Doctors Directory</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <RemoveDoctorModal doctors={initialData} />
          <AddDoctorModal />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search doctors by name or specialization..." 
            className="pl-9 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 dark:hover:bg-slate-800">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name} className="h-14 w-14 rounded-full object-cover border-2 border-blue-100 shadow-sm" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold shadow-inner uppercase">
                        {doctor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doctor.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <Award className="h-4 w-4 mr-3 text-slate-400" />
                    Resident Expert
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-3 text-slate-400" />
                    {doctor.contactNumber}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Active
                </span>
                <Button 
                  onClick={() => setSelectedDoctor(doctor)}
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <h3 className="text-lg font-medium text-slate-900">No doctors found in database</h3>
            <p className="mt-1 text-slate-500">Add your first doctor using the button above.</p>
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          {selectedDoctor && (
            <div className="relative">
              {/* Header/Background */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full" />
              
              {/* Content */}
              <div className="px-8 pb-8 pt-0 -mt-16 text-center">
                <div className="flex justify-center mb-4">
                  {selectedDoctor.image ? (
                    <img 
                      src={selectedDoctor.image} 
                      alt={selectedDoctor.name} 
                      className="h-32 w-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white" 
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl uppercase">
                      {selectedDoctor.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                    {selectedDoctor.name}
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  </h2>
                  <p className="text-blue-600 font-semibold tracking-wide uppercase text-xs">{selectedDoctor.specialization}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-slate-500 font-medium uppercase">Contact</span>
                    <span className="text-sm font-bold text-slate-900">{selectedDoctor.contactNumber}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-slate-500 font-medium uppercase">Location</span>
                    <span className="text-sm font-bold text-slate-900">Main Ward</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between p-4 border rounded-2xl border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-slate-500">Expertise</p>
                        <p className="text-sm font-bold">Resident Specialist</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-2xl border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-slate-500">Availability</p>
                        <p className="text-sm font-bold">Available Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-8 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all">
                  Book Consultation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
