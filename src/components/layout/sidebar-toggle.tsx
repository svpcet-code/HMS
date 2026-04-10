"use client";

import { useSidebar } from "./sidebar-context";

export function SidebarToggle() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div 
      onClick={toggleSidebar}
      className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full cursor-pointer shadow-inner border border-slate-200 dark:border-slate-700 w-32 h-10 select-none group"
    >
      {/* Sliding Shadow Overlay */}
      <div 
        className={`absolute h-8 w-[60px] bg-white dark:bg-slate-900 rounded-full shadow-md transition-all duration-300 ease-in-out border border-slate-200/50 dark:border-slate-700/50 ${
          isOpen ? "translate-x-0" : "translate-x-[60px]"
        }`}
      />
      
      {/* Open/Full Label */}
      <div className={`relative z-10 w-1/2 text-center text-[10px] font-black tracking-widest transition-colors duration-300 ${
        isOpen ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
      }`}>
        FULL
      </div>
      
      {/* Mini Label */}
      <div className={`relative z-10 w-1/2 text-center text-[10px] font-black tracking-widest transition-colors duration-300 ${
        !isOpen ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
      }`}>
        MINI
      </div>
      
      {/* Interactive hover effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
    </div>
  );
}
