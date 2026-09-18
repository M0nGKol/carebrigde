"use client";

import { AppViewport, EmptyState, LoadingView, PageHeader, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";

export default function NoResponsePage() {
  const { state, hydrated, assignTracing } = useCareBridge();
  const patients = state.patients.filter((patient) => patient.status === "no-response");
  if (!hydrated) return <AppViewport role="nurse"><LoadingView /></AppViewport>;
  return (
    <AppViewport role="nurse"><div className="screen"><StatusBar /><PageHeader title="No-response tracing" badge={`${patients.length}`} />
      <div className="screen-content tracing-content"><div className="tracing-summary"><span>◷</span><div><h2>Follow up missed check-ins</h2><p>Assign a call only where a response is missing.</p></div></div>
        {patients.length ? <div className="tracing-list">{patients.map((patient) => <div className="tracing-card card" key={patient.id}><div className="patient-avatar">{patient.name[0]}</div><div><h3>{patient.name}</h3><p>{patient.reasons[0]}</p><small>{patient.phone}</small></div>{patient.assignedTo ? <span className="assigned">Assigned to {patient.assignedTo}</span> : <button onClick={() => assignTracing(patient.id, "Nurse Sokha")}>Assign follow-up</button>}</div>)}</div> : <EmptyState icon="✓" title="Everyone replied" text="There are no missed check-ins to trace." />}
      </div></div></AppViewport>
  );
}
