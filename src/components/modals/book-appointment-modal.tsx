"use client";

import { useState } from "react";
import { createAppointment } from "@/actions/appointments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Calendar } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

export function BookAppointmentModal({ 
  patients, 
  doctors 
}: { 
  patients: Option[], 
  doctors: Option[] 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      patientId: formData.get("patientId") as string,
      doctorId: formData.get("doctorId") as string,
      date: formData.get("date") as string,
      status: "SCHEDULED",
    };

    const res = await createAppointment(data);
    
    setLoading(false);
    if (res.success) {
      setOpen(false);
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-all shadow-md font-semibold cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-slate-700 font-semibold flex items-center gap-2">
               Select Patient
            </Label>
            <Select name="patientId" required>
              <SelectTrigger className="py-6 rounded-xl border-slate-200 focus:ring-blue-500 transition-all bg-slate-50/50">
                <SelectValue placeholder="Search or select a patient..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold uppercase">{p.name.charAt(0)}</div>
                      {p.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctorId" className="text-slate-700 font-semibold flex items-center gap-2">
               Select Doctor
            </Label>
            <Select name="doctorId" required>
              <SelectTrigger className="py-6 rounded-xl border-slate-200 focus:ring-blue-500 transition-all bg-slate-50/50">
                <SelectValue placeholder="Choose a specialist..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="rounded-lg py-3 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100/50 flex items-center justify-center text-xs font-bold uppercase text-blue-600">DR</div>
                      {d.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-700 font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" /> Appointment Date & Time
            </Label>
            <Input 
              id="date" 
              name="date" 
              type="datetime-local" 
              required 
              className="py-6 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-6" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
