"use client";

import { useState } from "react";
import { createLabTest } from "@/actions/laboratory";
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
import { FileText, Loader2, FlaskConical } from "lucide-react";

export function NewTestModal({ patients }: { patients: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      testName: formData.get("testName") as string,
      patientId: formData.get("patientId") as string,
    };

    const res = await createLabTest(data);
    
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
            <FileText className="mr-2 h-4 w-4" /> New Test Request
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl overflow-hidden p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
            <FlaskConical className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <DialogTitle className="text-xl font-bold">Request Diagnostic Test</DialogTitle>
            <p className="text-xs text-blue-100 mt-1 font-medium">Select patient and test type to proceed.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-slate-700 font-bold">Patient Name</Label>
            <Select name="patientId" required>
              <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 cursor-pointer">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testName" className="text-slate-700 font-bold">Test Type</Label>
            <Select name="testName" required>
              <SelectTrigger className="py-6 rounded-2xl border-slate-200 bg-slate-50/50">
                <SelectValue placeholder="Choose diagnostic test..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                <SelectItem value="Full Blood Count">Full Blood Count</SelectItem>
                <SelectItem value="Lipid Profile">Lipid Profile</SelectItem>
                <SelectItem value="Blood Sugar (Fasting)">Blood Sugar (Fasting)</SelectItem>
                <SelectItem value="Kidney Function Test">Kidney Function Test</SelectItem>
                <SelectItem value="Liver Function Test">Liver Function Test</SelectItem>
                <SelectItem value="Thyroid Profile">Thyroid Profile</SelectItem>
                <SelectItem value="Urine Analysis">Urine Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-2xl transition-all shadow-lg shadow-blue-200 cursor-pointer" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Generating Request..." : "Confirm Test Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
