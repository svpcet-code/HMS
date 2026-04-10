"use client";

import { useState } from "react";
import { createInvoice } from "@/actions/billing";
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
import { Receipt, Loader2 } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

export function AddInvoiceModal({ patients }: { patients: Patient[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const patientId = formData.get("patientId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as string;
    const status = formData.get("status") as string;
    
    console.log("Submitting form with data:", { patientId, amount, type, status });

    if (!patientId || patientId === "undefined") {
      alert("Please select a valid patient.");
      setLoading(false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      setLoading(false);
      return;
    }

    const res = await createInvoice({
      patientId,
      amount,
      type,
      status,
    });

    setLoading(false);
    if (res.success) {
      console.log("Invoice created successfully!");
      setOpen(false);
    } else {
      console.error("Invoice creation failed:", res.error);
      alert("Error: " + res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
            <Receipt className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-blue-600 p-6 text-center text-white space-y-0">
            <Receipt className="h-10 w-10 mx-auto mb-2 opacity-80" />
            <DialogTitle className="text-xl font-bold text-white">New Patient Invoice</DialogTitle>
            <p className="text-xs text-blue-100 mt-1 font-medium">Generate a new billing request for diagnostic or consultation services.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Target Patient</Label>
            <Select name="patientId" required>
              <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1 max-h-[250px]">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 cursor-pointer">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Service Type</Label>
              <Select name="type" required defaultValue="Consultation">
                <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1">
                  <SelectItem value="Consultation" className="rounded-lg">Consultation</SelectItem>
                  <SelectItem value="Lab Test" className="rounded-lg">Lab Test</SelectItem>
                  <SelectItem value="Surgery" className="rounded-lg">Surgery</SelectItem>
                  <SelectItem value="Pharmacy" className="rounded-lg">Pharmacy</SelectItem>
                  <SelectItem value="X-Ray" className="rounded-lg">X-Ray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Payment Status</Label>
              <Select name="status" required defaultValue="UNPAID">
                <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold text-red-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1">
                  <SelectItem value="PAID" className="rounded-lg text-green-600 font-bold">Paid</SelectItem>
                  <SelectItem value="UNPAID" className="rounded-lg text-red-600 font-bold">Unpaid</SelectItem>
                  <SelectItem value="PENDING" className="rounded-lg text-amber-600 font-bold">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Amount (₹)</Label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8 py-6 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-lg"
                    required
                />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
