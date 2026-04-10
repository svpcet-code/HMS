import { BedDouble, Plus, AlertCircle, CheckCircle2, Wrench, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBeds } from "@/actions/beds";
import { AddBedModal } from "@/components/modals/add-bed-modal";
import { RemoveBedModal } from "@/components/modals/remove-bed-modal";

export default async function BedsPage() {
  const allBeds = await getBeds();

  // Group beds by ward
  const wards = allBeds.reduce((acc: any, bed) => {
    if (!acc[bed.ward]) {
      acc[bed.ward] = { name: bed.ward, beds: [] };
    }
    acc[bed.ward].beds.push(bed);
    return acc;
  }, {});

  const wardList = Object.values(wards);

  const totalAvailable = allBeds.filter(b => b.status === "AVAILABLE").length;
  const totalOccupied = allBeds.filter(b => b.status === "OCCUPIED").length;
  const totalMaintenance = allBeds.filter(b => b.status === "MAINTENANCE").length;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE": return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
      case "OCCUPIED": return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
      case "MAINTENANCE": return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
      default: return "bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE": return <CheckCircle2 className="w-3 h-3" />;
      case "OCCUPIED": return <AlertCircle className="w-3 h-3" />;
      case "MAINTENANCE": return <Wrench className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Bed Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor bed availability across wards</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <RemoveBedModal beds={allBeds.map(b => ({ id: b.id, bedNumber: b.bedNumber, ward: b.ward }))} />
          <AddBedModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Available</p>
            <p className="text-3xl font-bold text-green-600">{totalAvailable}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Occupied</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalOccupied}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-900/40 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Maintenance</p>
            <p className="text-3xl font-bold text-amber-600">{totalMaintenance}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Wrench className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {(wardList as any[]).length > 0 ? (wardList as any[]).map((ward) => {
          const availableCount = ward.beds.filter((b: any) => b.status.toUpperCase() === "AVAILABLE").length;
          const occupiedCount = ward.beds.filter((b: any) => b.status.toUpperCase() === "OCCUPIED").length;
          
          return (
            <div key={ward.name} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <BedDouble className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{ward.name}</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">In-Patient Services</p>
                    </div>
                </div>
                <div className="flex gap-6 text-sm font-black italic">
                  <span className="text-green-600 tracking-tighter uppercase">{availableCount} AVAILABLE</span>
                  <span className="text-red-500 tracking-tighter uppercase">{occupiedCount} OCCUPIED</span>
                </div>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                  {(ward.beds as any[]).map((bed) => (
                    <div 
                      key={bed.id}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-105 active:scale-95 ${getStatusColor(bed.status)}`}
                      title={`${bed.bedNumber} - ${bed.status}`}
                    >
                      <BedDouble className="h-7 w-7 mb-1 opacity-90" />
                      <span className="text-[10px] font-black tracking-widest uppercase">{bed.bedNumber}</span>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap pointer-events-none z-10 hidden sm:flex items-center gap-1.5">
                        {getStatusIcon(bed.status)} {bed.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 py-20 text-center">
                <BedDouble className="h-12 w-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Beds Provisioned</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Start by adding your first ward and bed from the management console.</p>
            </div>
        )}
      </div>
    </div>
  );
}
