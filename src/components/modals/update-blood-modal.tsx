"use client";

import { useState } from "react";
import { updateBloodUnits } from "@/actions/blood-bank";
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
import { RefreshCcw, Loader2 } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function UpdateBloodModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const group = formData.get("group") as string;
    const units = parseInt(formData.get("units") as string);

    if (isNaN(units) || units < 0) {
      alert("Please enter a valid unit count.");
      setLoading(false);
      return;
    }

    const res = await updateBloodUnits(group, units);

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
          <Button variant="outline" className="flex-1 sm:flex-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm transition-colors">
            <RefreshCcw className="mr-2 h-4 w-4" /> Update
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-slate-900 p-6 text-center text-white space-y-0">
            <RefreshCcw className="h-10 w-10 mx-auto mb-2 opacity-80" />
            <DialogTitle className="text-xl font-bold text-white">Update Blood Units</DialogTitle>
            <p className="text-xs text-slate-400 mt-1">Manually adjust the current stock levels.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="group" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Blood Group</Label>
            <Select name="group" required>
              <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                <SelectValue placeholder="Select group..." />
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
            <Label htmlFor="units" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Current Units</Label>
            <Input
              id="units"
              name="units"
              type="number"
              placeholder="e.g. 50"
              className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-lg"
              required
              min="0"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-8 rounded-2xl transition-all shadow-xl uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Updating..." : "Update Inventory"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
