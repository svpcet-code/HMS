"use client";

import { useState } from "react";
import { createBed } from "@/actions/beds";
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
  SelectValue 
} from "@/components/ui/select";
import { Plus, Loader2, BedDouble } from "lucide-react";

export function AddBedModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      bedNumber: formData.get("bedNumber") as string,
      ward: formData.get("ward") as string,
      status: "AVAILABLE",
    };

    const res = await createBed(data);
    
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
            <Plus className="mr-2 h-4 w-4" /> Add Bed
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white text-center">
            <BedDouble className="h-10 w-10 mx-auto mb-2 text-blue-400 opacity-80" />
            <DialogTitle className="text-xl font-bold italic tracking-tight uppercase">Provision New Bed</DialogTitle>
            <p className="text-[10px] text-slate-400 mt-1 tracking-[0.2em] font-medium">HOSPITAL INVENTORY SYSTEM v2.0</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ward" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Target Ward / Section</Label>
            <Select name="ward" required>
              <SelectTrigger className="py-7 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                <SelectValue placeholder="Select ward location..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                <SelectItem value="General Ward A" className="rounded-lg py-3 cursor-pointer">General Ward A</SelectItem>
                <SelectItem value="General Ward B" className="rounded-lg py-3 cursor-pointer">General Ward B</SelectItem>
                <SelectItem value="ICU" className="rounded-lg py-3 cursor-pointer">ICU (Intensive Care)</SelectItem>
                <SelectItem value="Maternity Ward" className="rounded-lg py-3 cursor-pointer">Maternity Ward</SelectItem>
                <SelectItem value="Pediatric Ward" className="rounded-lg py-3 cursor-pointer">Pediatric Ward</SelectItem>
                <SelectItem value="Emergency" className="rounded-lg py-3 cursor-pointer">Emergency / ER</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedNumber" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Bed Identifier (Room/Bed #)</Label>
            <Input id="bedNumber" name="bedNumber" placeholder="e.g. ICU-304" required className="py-7 rounded-2xl border-slate-200 bg-slate-50/50 font-bold" />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest cursor-pointer" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Allocating..." : "Finalize Allocation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
