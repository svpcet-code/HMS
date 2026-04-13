"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse, LayoutDashboard, Users, Stethoscope, Calendar,
  BedDouble, Droplet, Receipt, Settings, Pill, TestTube,
  ShieldCheck, Info, CalendarDays, X
} from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useSession } from "next-auth/react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Doctors", href: "/doctors", icon: Stethoscope, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Pharmacy", href: "/pharmacy", icon: Pill, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Laboratory", href: "/laboratory", icon: TestTube, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Beds", href: "/beds", icon: BedDouble },
  { name: "Blood Bank", href: "/blood-bank", icon: Droplet, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Insurance", href: "/insurance", icon: ShieldCheck, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Payments", href: "/billing", icon: Receipt, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "About Us", href: "/about-us", icon: Info },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { data: session } = useSession();
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  const userRole = session?.user?.role || "PATIENT";

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true; // Accessible to everyone
    return item.roles.includes(userRole);
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Panel - Glassmorphism incorporated */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col backdrop-blur-xl bg-slate-900/90 dark:bg-slate-950/80 border-r border-slate-700/50 text-white shadow-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-0"
          }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between gap-3 px-6 bg-black/20 dark:bg-black/40 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group py-1">
            <div className="relative h-11 w-11 shrink-0 transition-all duration-500 group-hover:scale-110 flex items-center justify-center">
              {/* Animated Bubbles */}
              <div className="bubble left-2" style={{ animationDelay: '0s' }}></div>
              <div className="bubble left-5" style={{ animationDelay: '0.4s' }}></div>
              <div className="bubble left-8" style={{ animationDelay: '0.8s' }}></div>
              
              <Image
                src="/hms-logo.svg"
                alt="HMS Logo"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">HMS</span>
              <span className="text-[8px] font-black tracking-[0.4em] text-blue-500/80 uppercase mt-0.5 leading-none transition-colors group-hover:text-blue-400">Hospital Management</span>
            </div>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide py-6">
          <nav className="flex-1 space-y-1.5 px-4 w-64">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out relative overflow-hidden ${isActive ? "bg-blue-600/20 text-blue-400" : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                >
                  <div className={`absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-full transition-transform origin-center ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`} />
                  <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"}`} aria-hidden="true" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
