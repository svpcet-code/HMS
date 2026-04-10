"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Calendar, Stethoscope, Activity, Loader2, RefreshCw } from "lucide-react";
import ChartCanvas from "@/components/3d/ChartCanvas";
import BarChart3D from "@/components/3d/BarChart3D";
import DonutChart3D from "@/components/3d/DonutChart3D";
import { ChartLegend } from "@/components/3d/ChartLegend";
import { getDashboardChartsData, getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [chartsData, setChartsData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, charts] = await Promise.all([
        getDashboardStats(),
        getDashboardChartsData()
      ]);
      setStatsData(stats);
      setChartsData(charts);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const stats = [
    { name: "Total Patients", value: statsData?.patientCount ?? 0, icon: Users },
    { name: "Appointments Today", value: statsData?.apptToday ?? 0, icon: Calendar },
    { name: "Available Doctors", value: statsData?.doctorCount ?? 0, icon: Stethoscope },
    { name: "Active Admissions", value: statsData?.activeAdmissions ?? 0, icon: Activity },
  ];

  if (loading && !statsData) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest text-[10px] uppercase">Initializing Dashboard Stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Hospital Management Analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="h-8 rounded-full border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all font-bold px-4"
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 p-6 relative group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[100px] -z-10 blur-xl"></div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.name}</dt>
                  <dd>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5 tracking-tight">
                      {loading && !statsData ? "..." : stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Visualizations Section */}
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-8 mb-4">Core Medical Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        
        {/* Weekly Appointments 3D Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-1 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/5 min-h-[450px]">
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-lg leading-none">Patients by Department</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 tracking-tighter shadow-sm">Live Distribution History</p>
          </div>
          
          {chartsData && !loading && (
            <>
              <ChartLegend 
                title="Departments" 
                items={chartsData.barData} 
              />
              <div key={`bar-${refreshKey}`} className="w-full h-full flex-1 min-h-[400px]">
                <ChartCanvas cameraPos={[0, 6, 12]}>
                  <BarChart3D data={chartsData.barData} />
                </ChartCanvas>
              </div>
            </>
          )}

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin opacity-20" />
            </div>
          )}
        </div>

        {/* Patient Demographics 3D Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-1 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-500/5 min-h-[450px]">
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-lg leading-none">Overall Patient Status</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 tracking-tighter shadow-sm">Real-time Recovery Metrics</p>
          </div>

          {chartsData && !loading && (
            <>
              <ChartLegend 
                title="Health Status" 
                items={chartsData.donutData} 
              />
              <div key={`donut-${refreshKey}`} className="w-full h-full flex-1 min-h-[400px]">
                <ChartCanvas cameraPos={[0, 5, 8]}>
                  <DonutChart3D data={chartsData.donutData} />
                </ChartCanvas>
              </div>
            </>
          )}

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-emerald-500 animate-spin opacity-20" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
