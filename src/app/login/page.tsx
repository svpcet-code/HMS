"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeartPulse, Lock, Mail, ArrowRight, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const selectRole = formData.get("role") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Role-Portal Sync Check
      const session = await getSession();
      const userRole = session?.user?.role;

      if (portal === "STAFF" && userRole === "PATIENT") {
        setError("This account is for the Patient Portal. Please switch and try again.");
        setLoading(false);
        return;
      }

      if (portal === "PATIENT" && userRole !== "PATIENT") {
        setError("This account is for the Doctor/Staff Portal. Please switch and try again.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    }
  };

  const [portal, setPortal] = useState<"PATIENT" | "STAFF">("STAFF");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blocks */}
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Welcome back to the HMS Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button
              onClick={() => setPortal("STAFF")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${portal === "STAFF" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Doctor / Staff
            </button>
            <button
              onClick={() => setPortal("PATIENT")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${portal === "PATIENT" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Patient Portal
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="role" value={portal} />
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-3 border transition-colors outline-none"
                  placeholder="admin@hms.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all">
                  Forgot your password?
                </Link>
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
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Don&apos;t have an account?</span>
              </div>
            </div>
            
            <Link 
              href="/register" 
              className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all font-semibold"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create new account
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Demo Credentials</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-slate-600 space-y-1">
              <p>Admin: admin@hms.com / password</p>
              <p>Doctor: doctor1@hms.com / password</p>
              <p>Patient: patient1@hms.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
