"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Activity, MapPin, Pill, Phone, Clock,
  ChevronRight, Shield, Menu, X, Stethoscope, HeartPulse,
} from "lucide-react";

export default function Home() {
  const [patient] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = JSON.parse(sessionStorage.getItem("medconnect_patient") || "null");
    return stored?.id ? stored : null;
  });
  const isLoggedIn = Boolean(patient);
  const patientName = patient?.firstName || "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100" role="navigation" aria-label="Landing page navigation">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="AmritCare home">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Amrit<span className="text-teal-600">Care</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/patient/dashboard" className="bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm no-underline">
                  Welcome, {patientName} →
                </Link>
              </>
            ) : (
              <>
                <Link href="/doctor/login" className="text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors no-underline">
                  Doctor Portal
                </Link>
                <Link href="/patient/login" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors no-underline">
                  Sign In
                </Link>
                <Link href="/patient/register" className="bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm no-underline">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-3 animate-slide-up">
            <a href="#features" className="block text-sm font-medium text-gray-600 py-2">Features</a>
            <a href="#services" className="block text-sm font-medium text-gray-600 py-2">Services</a>
            <a href="#how-it-works" className="block text-sm font-medium text-gray-600 py-2">How It Works</a>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {isLoggedIn ? (
                <Link href="/patient/dashboard" className="block w-full bg-teal-600 text-white text-sm font-semibold px-5 py-3 rounded-lg text-center no-underline">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/patient/register" className="block w-full bg-teal-600 text-white text-sm font-semibold px-5 py-3 rounded-lg text-center no-underline">
                    I&apos;m a Patient — Sign Up
                  </Link>
                  <Link href="/doctor/login" className="block w-full bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-3 rounded-lg text-center no-underline">
                    I&apos;m a Doctor — Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#e8f1ed] border-b border-[#d9ddd6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 space-y-6 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-[13px] font-semibold px-3.5 py-1.5 rounded-full tracking-wide">
              <HeartPulse className="w-3.5 h-3.5" />
              A clearer way to manage care
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.1] text-gray-900 tracking-tight">
              Your Health,<br/>
              <span className="text-teal-600">Simplified.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Keep symptoms, appointments, medicines, and nearby care together in one calm, secure place.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              {isLoggedIn ? (
                <Link href="/patient/dashboard" className="bg-teal-600 text-white text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-teal-700 transition-all inline-flex items-center gap-2 no-underline shadow-sm">
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link href="/patient/register" className="bg-teal-600 text-white text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-teal-700 transition-all inline-flex items-center gap-2 no-underline shadow-sm w-full sm:w-auto justify-center">
                    I&apos;m a Patient
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link href="/doctor/login" className="bg-white text-gray-700 text-sm font-semibold px-7 py-3.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all inline-flex items-center gap-2 no-underline w-full sm:w-auto justify-center">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    I&apos;m a Doctor
                  </Link>
                </>
              )}
            </div>

          </div>

          <div className="flex-1 relative w-full max-w-lg">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <Image src="/hero_doctors_1777712257459.png" alt="Team of healthcare professionals ready to assist you" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your care, in one place</h2>
          <p className="text-gray-500 max-w-md mx-auto">Simple tools for the moments that matter between visits.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: "Symptom triage", desc: "Describe how you feel and get practical guidance on what to do next, with clear safety advice.", color: "text-teal-700", bg: "bg-teal-50", link: "/patient/triage" },
            { icon: MapPin, title: "Find nearby care", desc: "Locate hospitals and clinics with directions, distance, and the details you need before you go.", color: "text-teal-700", bg: "bg-teal-50", link: "/patient/locate" },
            { icon: Pill, title: "Medicine reminders", desc: "Keep doses and refills visible so your routine is easier to follow.", color: "text-teal-700", bg: "bg-teal-50", link: "/reminders" },
            { icon: Phone, title: "Care check-ins", desc: "Schedule a phone check-in when you need support between appointments.", color: "text-teal-700", bg: "bg-teal-50", link: "/patient/dashboard" },
            { icon: Clock, title: "Health timeline", desc: "Review triage, bookings, and calls in one straightforward history.", color: "text-teal-700", bg: "bg-teal-50", link: "/patient/history" },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-5 ${feature.bg}`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 mb-4">{feature.desc}</p>
                <Link href={feature.link} className="text-sm font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 no-underline group-hover:gap-2 transition-all">
                  Try it now <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="bg-[#eeece5] py-24 border-y border-[#d9ddd6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How We Help You</h2>
            <p className="text-gray-500 max-w-md mx-auto">From AI triage to finding the nearest hospital — your complete healthcare companion.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "AI Symptom Triage", desc: "Describe how you feel and our AI analyzes your symptoms to suggest home remedies and the right specialist to consult." },
              { icon: MapPin, title: "Find Nearby Hospitals", desc: "Real-time geolocation-based search to find the nearest hospitals and clinics with ratings, hours, and one-tap directions." },
              { icon: Clock, title: "Health Timeline", desc: "Track your complete medical history — every triage session, booking, AI call, and visit — in a clean, organized timeline." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SPECIALITY BANNER ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-5 tracking-tight">
              Your Health, <br/>Our Priority.
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
              Get practical health guidance, find specialists, book appointments, and manage medicines from your phone.
            </p>
            <div className="flex flex-wrap gap-3">
              {isLoggedIn ? (
                <Link href="/patient/dashboard" className="bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all no-underline">
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/patient/register" className="bg-teal-600 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-teal-500 transition-all no-underline">
                    Get Started Free
                  </Link>
                  <Link href="/patient/login" className="border border-gray-700 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-all no-underline">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="relative w-56 h-56 md:w-72 md:h-72 shrink-0 z-10">
            <Image src="/schedule_calendar_1777712287936.png" alt="Calendar showing easy appointment scheduling" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 relative max-w-sm">
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <Image src="/service_doctor_1777712272499.png" alt="Doctor providing consultation" width={400} height={500} className="object-cover w-full h-auto" />
            </div>
          </div>
          <div className="flex-1 space-y-8 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Get Started in 3 Steps</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Create Your Account", desc: "Sign up for free in under a minute with just your basic details." },
                { step: "02", title: "Describe Your Symptoms", desc: "Chat with our AI assistant or use voice — it will triage your situation instantly." },
                { step: "03", title: "Get Personalized Care", desc: "Receive specialist recommendations, book appointments, and set medicine reminders." },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-semibold text-xs shrink-0">{s.step}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{s.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              {isLoggedIn ? (
                <Link href="/patient/dashboard" className="text-sm font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1.5 no-underline">
                  Go to Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link href="/patient/register" className="text-sm font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1.5 no-underline">
                  Get Started Now <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">Amrit<span className="text-teal-400">Care</span></span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <Link href="/patient/login" className="hover:text-white transition-colors no-underline">Patient Login</Link>
              <Link href="/doctor/login" className="hover:text-white transition-colors no-underline">Doctor Portal</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-500">© 2026 AmritCare. All rights reserved.</p>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure • Private • HIPAA Compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
