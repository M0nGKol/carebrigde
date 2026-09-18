"use client";

import { AppViewport, LoadingView, PageHeader, PatientNav, StatusBar } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useCareBridge } from "@/lib/store";

export default function RecoveryPlanPage() {
  const { activePatient, hydrated } = useCareBridge();
  if (!hydrated) return <AppViewport role="patient"><LoadingView /></AppViewport>;
  const schedule = [3, 7, 14, 30];
  return (
    <AppViewport role="patient">
      <div className="screen">
        <StatusBar /><PageHeader title="Recovery plan" />
        <div className="screen-content plan-content">
          <div className="plan-hero"><span>✚</span><div><h2>{activePatient.surgery}</h2><p>Day {activePatient.recoveryDay} of recovery</p></div></div>
          <section className="plan-section"><h2>Check-in schedule</h2><div className="schedule-row">{schedule.map((day) => <span className={day <= activePatient.recoveryDay ? "done" : ""} key={day}>Day {day}</span>)}</div><p>Next check-in: {formatDate(activePatient.nextCheckIn, { weekday: "short", day: "numeric", month: "short" })}</p></section>
          <section className="plan-section"><h2>Medication</h2><div className="plan-line"><span>◫</span><div><strong>{activePatient.medication.split(" · ")[0]}</strong><p>{activePatient.medication.split(" · ")[1] ?? "Follow discharge instructions"}</p></div></div></section>
          <section className="plan-section"><h2>Wound care</h2><ul><li>Keep the wound clean and dry.</li><li>Wash hands before changing a dressing.</li><li>Report redness, swelling, or discharge.</li></ul></section>
          <section className="plan-section warning-section"><h2>Warning signs</h2><p>Fever, increasing pain, spreading redness, or unusual discharge.</p></section>
          <section className="plan-section"><h2>Follow-up appointment</h2><p>{formatDate(activePatient.followUpDate, { weekday: "long", day: "numeric", month: "long" })} · 10:30</p></section>
        </div>
        <PatientNav />
      </div>
    </AppViewport>
  );
}
