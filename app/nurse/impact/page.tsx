"use client";

import { AppViewport, LoadingView, NurseNav, PageHeader, StatusBar } from "@/components/ui";
import { average } from "@/lib/format";
import { useCareBridge } from "@/lib/store";

export default function ImpactPage() {
  const { state, hydrated } = useCareBridge();
  if (!hydrated) return <AppViewport role="nurse"><LoadingView /></AppViewport>;
  const responded = state.patients.filter((patient) => Boolean(patient.lastResponseAt)).length;
  const completion = state.patients.length ? Math.round((responded / state.patients.length) * 100) : 0;
  const responseTime = average(state.checkIns.map((item) => item.responseMinutes));
  const callsAvoided = state.patients.filter((patient) => patient.status === "green").length;
  const unresolved = state.patients.filter((patient) => patient.followUpStage !== "resolved" && patient.status !== "green").length;
  const metrics = [{label:"Completion rate",value:`${completion}%`,help:`${responded} of ${state.patients.length} patients responded`,icon:"✓"},{label:"Average response",value:`${responseTime} min`,help:"From scheduled check-in to submission",icon:"◷"},{label:"Routine calls avoided",value:String(callsAvoided),help:"Patients safely monitored without a call",icon:"☎"},{label:"Open nurse workload",value:String(unresolved),help:"Cases still requiring action",icon:"▤"}];
  return (
    <AppViewport role="nurse"><div className="screen"><StatusBar /><PageHeader title="Impact snapshot" badge="LIVE" />
      <div className="screen-content impact-content"><div className="impact-intro"><h1>Small team, clearer focus</h1><p>Metrics update from actions stored in this browser.</p></div><div className="impact-grid">{metrics.map((metric) => <div className="impact-card card" key={metric.label}><span>{metric.icon}</span><small>{metric.label}</small><strong>{metric.value}</strong><p>{metric.help}</p></div>)}</div>
        <div className="workload-card card"><h2>Workload distribution</h2><div className="bar-line"><span>Review first</span><i><b style={{width:`${Math.max(8, state.patients.filter(p=>p.status==="red").length/state.patients.length*100)}%`}} /></i></div><div className="bar-line"><span>Review soon</span><i><b className="yellow" style={{width:`${Math.max(8, state.patients.filter(p=>p.status==="yellow").length/state.patients.length*100)}%`}} /></i></div><div className="bar-line"><span>Routine</span><i><b className="green" style={{width:`${Math.max(8, state.patients.filter(p=>p.status==="green").length/state.patients.length*100)}%`}} /></i></div></div>
      </div><NurseNav /></div></AppViewport>
  );
}
