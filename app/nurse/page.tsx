"use client";

import Link from "next/link";
import { AppViewport, LoadingView, NurseNav, StatusBadge, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";
import type { RiskStatus } from "@/lib/types";

export default function NurseDashboardPage() {
  const { state, hydrated } = useCareBridge();
  if (!hydrated) return <AppViewport role="nurse"><LoadingView /></AppViewport>;
  const count = (status: RiskStatus) => state.patients.filter((patient) => patient.status === status).length;
  const queue = state.patients.filter((patient) => patient.status === "red" || patient.status === "yellow").sort((a, b) => (a.status === "red" ? -1 : 1) - (b.status === "red" ? -1 : 1));
  const newHelp = state.helpRequests.filter((item) => item.status === "new").length;
  return (
    <AppViewport role="nurse">
      <div className="screen nurse-dashboard">
        <StatusBar />
        <header className="nurse-header"><div><h1>Good morning, Nurse Sokha</h1><p>{state.patients.length} patients in recovery</p></div><span>NS</span></header>
        <div className="nurse-content">
          <section><div className="section-heading"><h2>Needs attention today</h2>{newHelp > 0 && <Link href="/nurse/patients">{newHelp} help request{newHelp > 1 ? "s" : ""}</Link>}</div>
            <div className="status-counts">
              {[{status:"red",icon:"!",label:"First"},{status:"yellow",icon:"●",label:"Soon"},{status:"no-response",icon:"…",label:"No reply"},{status:"green",icon:"✓",label:"Routine"}].map((item) => <Link href={item.status === "no-response" ? "/nurse/no-response" : "/nurse/patients"} className={`count-${item.status}`} key={item.status}><span>{item.icon}</span><strong>{count(item.status as RiskStatus)}</strong><small>{item.label}</small></Link>)}
            </div>
          </section>
          <section className="priority-section"><h2>Review first</h2><div className="priority-list">
            {queue.length ? queue.slice(0, 4).map((patient) => <Link className="patient-queue-card" href={`/nurse/patients/${patient.id}`} key={patient.id}><span className={`priority-bar priority-${patient.status}`} /><div><div><strong>{patient.name}</strong><small>Day {patient.recoveryDay}</small></div><p>{patient.reasons.join(" • ")}</p></div><b>›</b></Link>) : <div className="queue-empty">No patients currently need priority review.</div>}
          </div></section>
          <Link className="no-response-row" href="/nurse/no-response"><span>◷</span><strong>{count("no-response")} patients did not reply</strong><em>View</em></Link>
        </div>
        <NurseNav />
      </div>
    </AppViewport>
  );
}
