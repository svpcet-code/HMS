"use client";

import { useState } from "react";
import { deleteDoctor } from "@/actions/doctors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export function RemoveDoctorModal({ doctors }: { doctors: { id: string, name: string, specialization: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const doctorId = formData.get("doctorId") as string;

    const res = await deleteDoctor(doctorId);
    
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
          <Button variant="outline" className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all shadow-sm">
            <Trash2 className="mr-2 h-4 w-4" /> Manage Doctors
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-red-50 p-6 border-b border-red-100">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-600" />
            <DialogTitle className="text-xl font-bold text-red-900 text-center">Remove Doctor</DialogTitle>
            <p className="text-xs text-red-600 mt-1 text-center font-medium">This will delete the doctor profile and their associated login account.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doctorId" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Select Doctor</Label>
            <Select name="doctorId" required>
              <SelectTrigger className="py-7 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                <SelectValue placeholder="Choose doctor to remove..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1 max-h-[300px]">
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="rounded-lg py-3 cursor-pointer">
                    <div className="flex flex-col">
                        <span className="font-bold">{d.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{d.specialization}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-8 rounded-2xl transition-all shadow-xl shadow-red-100 uppercase tracking-widest cursor-pointer" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Removing..." : "Confirm Removal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
