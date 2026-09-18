"use client";

import { useState } from "react";
import Link from "next/link";
import { AppViewport, EmptyState, LoadingView, PageHeader, PrimaryButton, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";

export default function SurgeonPage() {
  const { state, hydrated, sendSurgeonDecision } = useCareBridge();
  const patient = state.patients.find((item) => item.escalated);
  const [decision, setDecision] = useState<"urgent-visit" | "continue-monitoring">("urgent-visit");
  const [note, setNote] = useState("Please arrange a hospital review tomorrow morning.");
  const [sent, setSent] = useState(false);
  if (!hydrated) return <AppViewport role="surgeon"><LoadingView /></AppViewport>;
  if (!patient || sent) return <AppViewport role="surgeon"><div className="screen"><StatusBar /><PageHeader title="Surgeon cases" badge="SURGEON" back={false} /><EmptyState icon="✓" title={sent ? "Decision sent" : "No new escalations"} text={sent ? "The nurse workflow has been updated on this device." : "Escalated cases will appear here for clinical review."} /><Link className="primary-button surgeon-return" href="/demo">Return to journeys</Link></div></AppViewport>;
  const latest = state.checkIns.find((item) => item.patientId === patient.id);
  const photo = latest?.photoDataUrl ?? "/assets/wound-photo.jpg";
  const submit = () => { sendSurgeonDecision(patient.id, decision, note); setSent(true); };
  return (
    <AppViewport role="surgeon"><div className="screen"><StatusBar /><PageHeader title="Clinical decision" badge="SURGEON" />
      <div className="screen-content compact surgeon-content">
        <div className="decision-patient card"><span className="patient-avatar large">{patient.name.split(" ").map((part) => part[0]).join("")}</span><div><h2>{patient.name}</h2><p>Day {patient.recoveryDay} · {patient.surgery} · Review first</p></div></div>
        <div className="clinical-evidence card"><img src={photo} alt="Patient-provided wound" /><div><h2>Clinical evidence</h2>{patient.reasons.slice(0,3).map((reason) => <p key={reason}>• {reason}</p>)}<small>{patient.nurseNote ?? "Escalated by nurse"}</small></div></div>
        <h2 className="section-title">Choose an action</h2>
        <div className="decision-options"><button className={decision === "urgent-visit" ? "selected" : ""} onClick={() => setDecision("urgent-visit")}><span>✚</span><div><strong>Urgent hospital visit</strong><small>Arrange assessment within 24 hours</small></div><i>{decision === "urgent-visit" ? "●" : "○"}</i></button><button className={decision === "continue-monitoring" ? "selected" : ""} onClick={() => setDecision("continue-monitoring")}><span>◉</span><div><strong>Continue monitoring</strong><small>Ask nurse to continue scheduled checks</small></div><i>{decision === "continue-monitoring" ? "●" : "○"}</i></button></div>
        <div className="surgeon-note"><label className="form-label" htmlFor="surgeon-note">Note for nurse</label><textarea id="surgeon-note" className="text-area" value={note} onChange={(event) => setNote(event.target.value)} /></div>
        <PrimaryButton onClick={submit}>Send decision to nurse</PrimaryButton>
        <p className="caption centered">This supports clinical review. It does not diagnose.</p>
      </div>
    </div></AppViewport>
  );
}
