"use client";

import { useState } from "react";
import { deletePatient } from "@/actions/patients";
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

export function RemovePatientModal({ patients }: { patients: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const patientId = formData.get("patientId") as string;

    const res = await deletePatient(patientId);
    
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
            <Trash2 className="mr-2 h-4 w-4" /> Manage Patients
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-red-50 p-6 border-b border-red-100 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-600" />
            <DialogTitle className="text-xl font-bold text-red-900">Remove Patient</DialogTitle>
            <p className="text-xs text-red-600 mt-1 font-medium">This will permanently delete the patient record. This cannot be undone if there are no active dependencies.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Select Patient</Label>
            <Select name="patientId" required>
              <SelectTrigger className="py-7 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                <SelectValue placeholder="Search or select patient..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1 max-h-[300px]">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 cursor-pointer">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-8 rounded-2xl transition-all shadow-xl shadow-red-100 uppercase tracking-widest cursor-pointer" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Deleting..." : "Confirm Deletion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
