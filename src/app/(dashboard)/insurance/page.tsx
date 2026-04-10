import { ShieldCheck, FileCheck, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InsurancePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Insurance Claims</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage network providers and claim approvals.</p>
        </div>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
          <FileCheck className="mr-2 h-4 w-4" /> File New Claim
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[500px] transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by claim ID or patient..." className="pl-9 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700">
            <Filter className="mr-2 h-4 w-4" /> Filter Status
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-32 space-y-4">
          <ShieldCheck className="w-16 h-16 text-slate-200 dark:text-slate-700" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Insurance Network API offline</h3>
          <p className="text-sm max-w-sm text-center">We will integrate the claims processing pipeline with the Prisma database shortly.</p>
        </div>
      </div>
    </div>
  );
}
