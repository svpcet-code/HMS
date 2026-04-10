"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, HeartPulse, CheckCircle2, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debugToken, setDebugToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(result.message || "Reset link generated.");
      if (result.token) setDebugToken(result.token);
      setLoading(false);
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
          Forgot password?
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {success ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
                <div className="flex justify-center mb-3">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Request Sent</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>

              {debugToken && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Debug Link (Simulation)</p>
                  <Link 
                    href={`/reset-password?token=${debugToken}`}
                    className="text-sm text-blue-600 hover:underline break-all font-mono"
                  >
                    Click here to reset password ↗
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}
              
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
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-3 border outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
