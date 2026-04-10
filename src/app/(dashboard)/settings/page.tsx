"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Bell, Shield, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Tabs - mock visually stringing them together */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4">
          <button className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 flex items-center whitespace-nowrap">
            <User className="w-4 h-4 mr-2" /> Profile
          </button>
          <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 border-transparent transition-colors flex items-center whitespace-nowrap">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </button>
          <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 border-transparent transition-colors flex items-center whitespace-nowrap">
            <Shield className="w-4 h-4 mr-2" /> Security
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100">Personal Information</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use a permanent address where you can receive mail.</p>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input 
                    defaultValue={session?.user?.name || "Admin User"}
                    className="pl-9 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input 
                    defaultValue={session?.user?.email || "admin@hms.com"}
                    className="pl-9 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-400"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Contact IT to change your email.</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <div className="mt-2 text-sm font-semibold px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 inline-block capitalize text-slate-900 dark:text-slate-100">
                  {session?.user?.role || "ADMIN"}
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Password Section */}
          <section>
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100">Change Password</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input type="password" placeholder="••••••••" className="pl-9 dark:bg-slate-950 dark:border-slate-700" />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input type="password" placeholder="••••••••" className="pl-9 dark:bg-slate-950 dark:border-slate-700" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-end border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" className="mr-3 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300">Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
