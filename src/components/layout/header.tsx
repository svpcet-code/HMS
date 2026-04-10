"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useTheme } from "next-themes";
import { Bell, LogOut, User as UserIcon, Clock, Menu, Sun, Moon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarToggle } from "@/components/layout/sidebar-toggle";

import Image from "next/image";

export function Header() {
  const { data: session } = useSession();
  const [time, setTime] = useState<Date | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setTime(new Date());
    }
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Left items - Custom Sidebar Toggle & Mobile Logo */}
      <div className="flex items-center gap-4 -ml-2">
        <SidebarToggle />
        <Link href="/" className="lg:hidden flex items-center gap-2 group">
          <div className="relative h-8 w-8 transition-all duration-500 group-hover:scale-110 flex items-center justify-center">
            {/* Animated Bubbles */}
            <div className="bubble left-1" style={{ animationDelay: '0s' }}></div>
            <div className="bubble left-3" style={{ animationDelay: '0.5s' }}></div>
            
            <Image 
              src="/hms-logo.png" 
              alt="HMS Logo" 
              fill 
              className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white leading-none">HMS</span>
            <span className="text-[6px] font-black tracking-widest text-blue-500 uppercase leading-none">Medical</span>
          </div>
        </Link>
      </div>

      {/* Right items */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        
        {/* Role Badge */}
        {session?.user?.role && (
          <div className="hidden md:flex items-center px-4 py-1.5 rounded-full border border-white/10 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 shadow-inner">
            <div className={`h-1.5 w-1.5 rounded-full mr-2 animate-pulse ${session.user.role === 'PATIENT' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${session.user.role === 'PATIENT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {session.user.role}
            </span>
          </div>
        )}

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

        {/* Live Date, Time & Username Cluster */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-200">
          {session && (
            <div className="flex items-center gap-2 border-r border-slate-300 dark:border-slate-600 pr-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <UserIcon className="h-3 w-3" />
              </div>
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{session.user?.name || "Admin"}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-3 lg:gap-x-5">
          
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 relative transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-slate-800/50 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 shadow-2xl rounded-xl border-slate-200 dark:border-slate-800">
              <DropdownMenuLabel className="font-bold text-slate-900 dark:text-white px-2 py-3 flex items-center justify-between">
                Notifications
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">1 New</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
              <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:bg-slate-50 dark:focus:bg-slate-800">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">New Appointment Booked</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patient Sarah Jenkins has a new appointment with Dr. Wilson.</p>
                  <p className="text-[10px] text-blue-500 font-medium mt-1">Just now</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
              <div className="p-2 text-center">
                <button className="text-xs text-blue-600 font-semibold hover:underline">View all updates</button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Logout/Login Button */}
          <div className="relative">
            {session ? (
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-full p-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <LogOut className="h-4 w-4 ml-1" />
                <span className="pr-2 hidden sm:inline-block">Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
