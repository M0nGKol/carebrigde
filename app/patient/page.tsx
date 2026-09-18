"use client";

import Link from "next/link";
import { AppViewport, Brand, LoadingView, PatientNav, StatusBar } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useCareBridge } from "@/lib/store";

export default function PatientHomePage() {
  const { activePatient, hydrated, state, setLanguage } = useCareBridge();
  if (!hydrated) return <AppViewport role="patient"><LoadingView /></AppViewport>;
  const hasCheckInToday = state.checkIns.some((item) => item.patientId === activePatient.id && new Date(item.submittedAt).toDateString() === new Date().toDateString());
  return (
    <AppViewport role="patient">
      <div className="screen patient-home">
        <StatusBar />
        <header className="patient-header">
          <Brand />
          <button className="language-button" onClick={() => setLanguage(state.language === "en" ? "km" : "en")}>{state.language === "en" ? "ខ្មែរ" : "EN"}</button>
        </header>
        <section className="greeting">
          <h1>Good morning, {activePatient.name}</h1>
          <p>Day {activePatient.recoveryDay} after {activePatient.surgery.toLowerCase()}</p>
        </section>
        <div className="patient-home-content">
          <div className={`checkin-due ${hasCheckInToday ? "checkin-complete" : ""}`}>
            <span>{hasCheckInToday ? "CHECK-IN COMPLETE" : "CHECK-IN DUE"}</span>
            <h2>{hasCheckInToday ? "Thank you for checking in" : "How are you feeling?"}</h2>
            <p>{hasCheckInToday ? `Next check-in ${formatDate(activePatient.nextCheckIn)}` : "1 minute  •  4 simple questions"}</p>
            <Link href="/patient/check-in">{hasCheckInToday ? "Update answers  →" : "Start check-in  →"}</Link>
          </div>
          <div className="today-grid">
            <div className="today-card"><span>⌁</span><small>Medication</small><strong>Taken today ✓</strong></div>
            <div className="today-card"><span>▣</span><small>Follow-up</small><strong>{formatDate(activePatient.followUpDate)} · 10:30</strong></div>
          </div>
          <Link className="help-row" href="/patient/help"><span>?</span><strong>Need help with recovery?</strong><em>Tell us →</em></Link>
        </div>
        <PatientNav />
      </div>
    </AppViewport>
  );
}
