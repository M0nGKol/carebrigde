"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppViewport, EmptyState, LoadingView, PageHeader, PrimaryButton, StatusBadge, StatusBar } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { useCareBridge } from "@/lib/store";
import type { FollowUpStage } from "@/lib/types";

export default function PatientReviewPage() {
  const params = useParams<{ id: string }>();
  const { state, hydrated, setFollowUpStage, updatePatient } = useCareBridge();
  const [note, setNote] = useState("");
  const patient = state.patients.find((item) => item.id === params.id);
  if (!hydrated) return <AppViewport role="nurse"><LoadingView /></AppViewport>;
  if (!patient) return <AppViewport role="nurse"><EmptyState icon="?" title="Patient not found" text="Return to the patient list and choose another record." /></AppViewport>;
  const checkIns = state.checkIns.filter((item) => item.patientId === patient.id);
  const latest = checkIns[0];
  const photo = latest?.photoDataUrl;
  const saveStage = (stage: FollowUpStage) => { setFollowUpStage(patient.id, stage, note || patient.nurseNote); setNote(""); };
  return (
    <AppViewport role="nurse"><div className="screen"><StatusBar /><PageHeader title="Patient review" badge="NURSE" />
      <div className="screen-content compact review-content">
        <div className="review-patient card"><span className="patient-avatar large">{patient.name.split(" ").map((part) => part[0]).join("")}</span><div><h2>{patient.name}</h2><p>Day {patient.recoveryDay} · {patient.surgery}</p></div><StatusBadge status={patient.status} /></div>
        <div className="alert-reasons"><h2>Reason for alert</h2>{patient.reasons.map((reason) => <p key={reason}>⚠ {reason}</p>)}</div>
        {photo && <div className="evidence-card card"><img src={photo} alt="Patient wound upload" /><div><h2>Wound photo</h2><p>{latest ? formatDateTime(latest.submittedAt) : "Latest check-in"}</p><small>Patient-provided image for clinical review</small></div></div>}
        <div className="timeline-card card"><h2>Follow-up progress</h2><div className="stage-row">{(["contacted","visit-arranged","resolved"] as FollowUpStage[]).map((stage) => <span className={patient.followUpStage === stage || patient.followUpStage === "resolved" ? "done" : ""} key={stage}>{stage === "contacted" ? "Contacted" : stage === "visit-arranged" ? "Visit arranged" : "Resolved"}</span>)}</div></div>
        <div><label className="form-label" htmlFor="nurse-note">Nurse note</label><textarea id="nurse-note" className="text-area" value={note} onChange={(event) => setNote(event.target.value)} placeholder={patient.nurseNote ?? "Add a brief follow-up note"} /></div>
        <div className="action-grid"><button onClick={() => saveStage("contacted")}>☎ Contacted</button><button onClick={() => saveStage("visit-arranged")}>▣ Arrange visit</button><button onClick={() => saveStage("resolved")}>✓ Resolve</button><button className="escalate" onClick={() => updatePatient(patient.id, { escalated: true })}>↑ Escalate</button></div>
        {patient.escalated && <Link className="primary-button surgeon-link" href="/surgeon">Open surgeon review →</Link>}
      </div>
    </div></AppViewport>
  );
}
