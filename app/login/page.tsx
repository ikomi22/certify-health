"use client";

import { useState } from "react";
import { signIn } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleDemo(demoEmail: string) {
    setError("");
    setLoading(true);
    const result = await signIn(demoEmail, "CertifyDemo2026!");
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#052e16] flex flex-col items-center justify-center px-4 py-12">
      {/* Branding */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 bg-brand rounded-xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_0_4px_rgba(22,163,74,0.2)]">
          <div className="w-7 h-7 bg-white rounded-md" />
        </div>
        <h1 className="text-white font-bold text-xl tracking-tight">
          Certify Health
        </h1>
        <p className="text-[#4ade80] text-sm mt-1">
          Federal Medical Centre, Asaba
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#f9fafb] rounded-2xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <h2 className="text-gray-900 font-semibold text-base mb-5">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs text-gray-500 mb-1.5"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div>
            <label
              className="block text-xs text-gray-500 mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or use a demo account</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDemo("adaeze.okonkwo@fmcasaba.gov.ng")}
            disabled={loading}
            className="w-full h-10 border border-brand text-brand text-sm font-medium rounded-lg hover:bg-green-50 transition-colors disabled:opacity-60"
          >
            Demo: Healthcare Worker
          </button>
          <button
            type="button"
            onClick={() => handleDemo("matron.ibrahim@fmcasaba.gov.ng")}
            disabled={loading}
            className="w-full h-10 border border-brand text-brand text-sm font-medium rounded-lg hover:bg-green-50 transition-colors disabled:opacity-60"
          >
            Demo: Facility Admin
          </button>
        </div>
      </div>
    </main>
  );
}
