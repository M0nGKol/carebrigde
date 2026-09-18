"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppViewport, LoadingView, NurseNav, PageHeader, StatusBadge, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";
import type { RiskStatus } from "@/lib/types";

export default function PatientsPage() {
  const { state, hydrated } = useCareBridge();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RiskStatus | "all">("all");
  const patients = useMemo(() => state.patients.filter((patient) => (filter === "all" || patient.status === filter) && patient.name.toLowerCase().includes(query.toLowerCase())), [filter, query, state.patients]);
  if (!hydrated) return <AppViewport role="nurse"><LoadingView /></AppViewport>;
  return (
    <AppViewport role="nurse"><div className="screen"><StatusBar /><PageHeader title="Patients" badge={`${state.patients.length}`} />
      <div className="screen-content patient-list-content">
        <input className="text-input search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients" aria-label="Search patients" />
        <div className="filter-row">{(["all","red","yellow","no-response","green"] as const).map((value) => <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{value === "all" ? "All" : value === "red" ? "First" : value === "yellow" ? "Soon" : value === "no-response" ? "No reply" : "Routine"}</button>)}</div>
        <div className="patient-list">{patients.map((patient) => <Link href={`/nurse/patients/${patient.id}`} className="patient-list-card" key={patient.id}><span className="patient-avatar">{patient.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{patient.name}</strong><small>Day {patient.recoveryDay} · {patient.surgery}</small><p>{patient.reasons[0]}</p></div><StatusBadge status={patient.status} /></Link>)}</div>
      </div><NurseNav /></div></AppViewport>
  );
}
