import { Pill, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getMedicines } from "@/actions/pharmacy";
import { AddMedicineModal } from "@/components/modals/add-medicine-modal";
import { RemoveMedicineModal } from "@/components/modals/remove-medicine-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string | Date | null;
}

export default async function PharmacyPage() {
  const medicines = await getMedicines() as unknown as Medicine[];

  const totalMedicines = medicines.length;
  const lowStockItems = medicines.filter((m) => m.stock < 10).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pharmacy Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage medicines, prescriptions, and stock limits.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <RemoveMedicineModal medicines={medicines} />
          <AddMedicineModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Pill className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Medicines</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalMedicines.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 flex items-center transition-colors">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${lowStockItems > 0 ? 'bg-red-50 dark:bg-red-900/50 animate-pulse' : 'bg-slate-50 dark:bg-slate-800'}`}>
              <AlertTriangle className={`h-6 w-6 ${lowStockItems > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Alert</p>
              <p className={`text-2xl font-bold ${lowStockItems > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{lowStockItems} Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inventory Status</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search drug registry..." className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-medium" />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="dark:border-slate-800">
              <TableHead className="font-bold">Drug Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Stock</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold">Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.length > 0 ? (
              medicines.map((item) => (
                <TableRow key={item.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className={`font-bold ${item.stock < 10 ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.stock} Units
                  </TableCell>
                  <TableCell className="font-mono text-sm">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Pill className="h-12 w-12 text-slate-100 dark:text-slate-800 mb-4" />
                    <p>No medicines found in inventory</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
