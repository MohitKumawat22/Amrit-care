"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";
import {
  Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Stethoscope,
  LockKeyhole, Smartphone,
} from "lucide-react";

const AUTH_MODES = [
  { id: "password", label: "Password", icon: LockKeyhole },
  { id: "otp", label: "One-time code", icon: Smartphone },
];

export default function PatientLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("password");
  const [form, setForm] = useState({ username: "", password: "" });
  const [otpPhone, setOtpPhone] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOtpChange = (i, val) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const providers = await getProviders();
      if (!providers?.google) {
        setError("Google sign-in is not configured. Please use password login.");
        return;
      }

      await signIn("google", { callbackUrl: "/patient/google-callback" });
    } catch (err) {
      setError("Google sign-in could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "password") {
      if (!form.username || !form.password) {
        setError("Please fill in all fields.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login failed.");
          setLoading(false);
          return;
        }

        sessionStorage.setItem("medconnect_patient", JSON.stringify(data.patient));
        router.push("/patient/dashboard");
      } catch (err) {
        setError("Network error. Please try again.");
        setLoading(false);
      }
    } else {
      setError("This auth mode is a demo — use Password login.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#e8f1ed]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white border border-[#d9ddd6] shadow-[0_12px_36px_rgba(43,61,56,0.1)] rounded-xl p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-lg bg-teal-700 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Patient Login</h1>
            <p className="text-sm text-gray-500">Sign in to manage your care, medicines, and appointments.</p>
          </div>

          {/* Auth mode tabs */}
          <div className="flex gap-1 p-1 rounded-lg bg-[#f1eee7] mb-8" role="tablist" aria-label="Sign-in method">
            {AUTH_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => { setMode(m.id); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-bold transition-all ${
                  mode === m.id
                    ? "bg-white text-teal-700 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <m.icon className="w-4 h-4" aria-hidden="true" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center animate-fade-in flex items-center justify-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" aria-busy={loading}>
            {/* Password Mode */}
            {mode === "password" && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">Username or Email</label>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your username or email"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className="input-field pr-12"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-md"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    <span className="text-sm font-medium text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">Forgot password?</button>
                </div>
              </>
            )}

            {/* OTP Mode */}
            {mode === "otp" && (
              <>
                <div>
                  <label htmlFor="otpPhone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input id="otpPhone" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} className="input-field" placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter OTP</label>
                  <div className="flex gap-2">
                    {otp.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="input-field text-center text-lg py-3 font-bold text-gray-900"
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-4">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                mode === "password" ? "Sign In Securely" : "Verify OTP"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-1 gap-3">
            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50" aria-label="Sign in with Google">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Google
            </button>
          </div>

          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/patient/register" className="text-teal-600 font-bold hover:underline no-underline">
              Create one
            </Link>
          </p>

          <p className="text-center text-sm text-gray-400 mt-3">
            <Link href="/doctor/login" className="inline-flex items-center gap-1 text-gray-400 hover:text-teal-600 no-underline transition-colors">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor? Sign in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
