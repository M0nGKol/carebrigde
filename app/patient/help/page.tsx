"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppViewport, PageHeader, PatientNav, PrimaryButton, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";

const categories = [
  { value: "wound", icon: "◉", label: "Wound concern" },
  { value: "pain", icon: "↗", label: "Increasing pain" },
  { value: "fever", icon: "°", label: "Fever" },
  { value: "medication", icon: "◫", label: "Medication concern" },
];

export default function PatientHelpPage() {
  const router = useRouter();
  const { createHelpRequest } = useCareBridge();
  const [category, setCategory] = useState("wound");
  const [note, setNote] = useState("");
  const submit = () => {
    createHelpRequest(category, note.trim() || undefined);
    router.push("/patient?help=sent");
  };
  return (
    <AppViewport role="patient">
      <div className="screen">
        <StatusBar /><PageHeader title="Request help" />
        <div className="screen-content help-content">
          <div className="help-hero"><span>♡</span><div><h2>What do you need help with?</h2><p>Choose the closest answer.</p></div></div>
          <div className="help-options">
            {categories.map((item) => <button className={category === item.value ? "selected" : ""} key={item.value} onClick={() => setCategory(item.value)}><span>{item.icon}</span>{item.label}<i>{category === item.value ? "●" : "○"}</i></button>)}
          </div>
          <div><label className="form-label" htmlFor="help-note">Add a short note <span className="caption">(optional)</span></label><textarea id="help-note" className="text-area" maxLength={160} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Example: The pain started last night" /></div>
          <p className="safety-note">If this is an emergency, contact local emergency services or go to the nearest hospital.</p>
          <PrimaryButton onClick={submit}>Send request</PrimaryButton>
        </div>
        <PatientNav />
      </div>
    </AppViewport>
  );
}
