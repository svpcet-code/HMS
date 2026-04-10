"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Lock, Mail, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { registerUser } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-600 p-3 shadow-lg">
            <HeartPulse className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join the HMS Portal today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <ShieldCheck className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-slate-600">Redirecting you to login...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center transition-all animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}

              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setRole("PATIENT")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${role === "PATIENT" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Join as Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole("DOCTOR")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${role === "DOCTOR" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Join as Doctor
                </button>
              </div>

              <input type="hidden" name="role" value={role} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-3 border transition-colors outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-3 border transition-colors outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-3 border transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
