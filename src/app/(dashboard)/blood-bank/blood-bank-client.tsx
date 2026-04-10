"use client";

import { Droplet, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateBloodModal } from "@/components/modals/update-blood-modal";
import { AddDonorModal } from "@/components/modals/add-donor-modal";

interface BloodInventoryItem {
  id: string;
  bloodGroup: string;
  units: number;
}

export default function BloodBankClient({ inventory }: { inventory: BloodInventoryItem[] }) {
  const getStatus = (units: number) => {
    if (units <= 10) return "Critical";
    if (units <= 30) return "Low";
    return "Healthy";
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Healthy": return "text-green-600 bg-green-50 border-green-200";
      case "Low": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Critical": return "text-red-600 bg-red-50 border-red-200 animate-pulse";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getPercentage = (units: number) => {
    return Math.min((units / 100) * 100, 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Blood Bank Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Live tracking of blood availability</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <UpdateBloodModal />
          <AddDonorModal />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const status = getStatus(item.units);
          return (
            <div key={item.bloodGroup} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all group relative overflow-hidden">
              <Droplet className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 dark:text-slate-800 opacity-50 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 shadow-inner group-hover:bg-red-50 transition-colors">
                    <span className="text-xl font-black text-red-600">{item.bloodGroup}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{item.units}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Units</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${status === 'Critical' ? 'bg-red-500' : status === 'Low' ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${getPercentage(item.units)}%`, transition: 'width 1s ease-in-out' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/20 rounded-full blur-3xl opacity-50 -z-0 translate-x-1/3 -translate-y-1/3"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
            <HeartPulse className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Blood Donation Drive</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Next drive is scheduled for October 25th. Organize now to replenish critical groups.</p>
          </div>
        </div>
        <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white relative z-10">
          View Details
        </Button>
      </div>
    </div>
  );
}
