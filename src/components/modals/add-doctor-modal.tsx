"use client";

import { useState } from "react";
import { createDoctor } from "@/actions/doctors";
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
import { Plus, Loader2 } from "lucide-react";
import { registerUser } from "@/actions/auth";

export function AddDoctorModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Step 1: Create the User for the Doctor
    const registerFormData = new FormData();
    registerFormData.append("name", formData.get("name") as string);
    registerFormData.append("email", formData.get("email") as string);
    registerFormData.append("password", formData.get("password") as string);
    registerFormData.append("role", "DOCTOR");

    const userRes = await registerUser(registerFormData);

    if (userRes.error) {
      alert("Error creating user: " + userRes.error);
      setLoading(false);
      return;
    }

    // Step 2: Create the Doctor record
    const doctorData = {
      name: formData.get("name") as string,
      specialization: formData.get("specialization") as string,
      contactNumber: formData.get("contact") as string,
      userId: userRes.user!.id,
      image: formData.get("image") as string || undefined,
    };

    const res = await createDoctor(doctorData);
    
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
            <Plus className="mr-2 h-4 w-4" /> Add Doctor
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Doctor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Dr. Sarah Jenkins" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" name="specialization" placeholder="Cardiologist" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" name="contact" placeholder="+1 234 567 8900" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Photo URL (Optional)</Label>
            <Input id="image" name="image" placeholder="https://example.com/photo.jpg" />
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-slate-500 mb-4">Doctor Account Credentials</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" placeholder="sarah@hms.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Login Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-6" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Registering..." : "Create Doctor Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
