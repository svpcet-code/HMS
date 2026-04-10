import { Users, Building, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto py-12">
        <HeartPulse className="h-16 w-16 text-blue-600 mb-2" />
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Our Mission</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          We are dedicated to providing world-class healthcare with integrity, compassion, and innovation. 
          Our hospital system bridges the gap between advanced medical technology and personalized patient care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
          <div className="mx-auto h-16 w-16 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-6">
            <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">Modern Facilities</h3>
          <p className="text-slate-500 dark:text-slate-400">Equipped with state-of-the-art diagnostic and surgical technology.</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
          <div className="mx-auto h-16 w-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">Expert Team</h3>
          <p className="text-slate-500 dark:text-slate-400">Hundreds of specialized doctors and dedicated nursing staff.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
          <div className="mx-auto h-16 w-16 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">Quality Care</h3>
          <p className="text-slate-500 dark:text-slate-400">Patient safety and rapid recovery are our absolute highest priorities.</p>
        </div>
      </div>
    </div>
  );
}
