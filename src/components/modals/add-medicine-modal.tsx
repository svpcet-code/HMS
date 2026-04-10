"use client";

import { useState } from "react";
import { createMedicine } from "@/actions/pharmacy";
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
import { Plus, Loader2, Pill } from "lucide-react";

export function AddMedicineModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      price: Number(formData.get("price")),
      expiryDate: formData.get("expiryDate") as string,
    };

    const res = await createMedicine(data);
    
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
            <Plus className="mr-2 h-4 w-4" /> Add Medicine
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" /> Add New Medicine
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medicine Name</Label>
            <Input id="name" name="name" placeholder="Paracetamol" required className="rounded-xl border-slate-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Analgesics">Analgesics</SelectItem>
                <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                <SelectItem value="Antiseptics">Antiseptics</SelectItem>
                <SelectItem value="Antipyretics">Antipyretics</SelectItem>
                <SelectItem value="Vitamins">Vitamins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input id="stock" name="stock" type="number" placeholder="100" required className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (per unit)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="9.99" required className="rounded-xl border-slate-200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" name="expiryDate" type="date" required className="rounded-xl border-slate-200" />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 rounded-xl transition-all cursor-pointer" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Adding..." : "Add to Inventory"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
