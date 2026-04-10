"use client";

import { useState } from "react";
import { recordDonation } from "@/actions/blood-bank";
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
import { Plus, Loader2, Heart } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function AddDonorModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const group = formData.get("group") as string;
    const amount = parseInt(formData.get("amount") as string);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      setLoading(false);
      return;
    }

    const res = await recordDonation(group, amount);

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
          <Button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 transition-all shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Add Donor
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-red-600 p-6 text-center text-white space-y-0">
            <Heart className="h-10 w-10 mx-auto mb-2 opacity-80" />
            <DialogTitle className="text-xl font-bold text-white">Record New Donation</DialogTitle>
            <p className="text-xs text-red-100 mt-1">Add units to the blood bank inventory.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="donorName" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Donor Name (Optional)</Label>
            <Input
              id="donorName"
              name="donorName"
              placeholder="Full Name"
              className="py-6 rounded-2xl border-slate-200 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Blood Group</Label>
              <Select name="group" required>
                <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1">
                  {bloodGroups.map((g) => (
                    <SelectItem key={g} value={g} className="rounded-lg py-3 cursor-pointer">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Units (ml/pts)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="e.g. 1"
                className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-bold"
                required
                min="1"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-8 rounded-2xl transition-all shadow-xl shadow-red-100 uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Recording..." : "Finalize Donation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
