"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { AppViewport, PageHeader, PrimaryButton, StatusBar } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useCareBridge } from "@/lib/store";
import type { Feeling, Fever, Pain, RiskStatus } from "@/lib/types";

type Result = { result: RiskStatus; nextCheckIn: string };

export default function CheckInPage() {
  const { submitCheckIn } = useCareBridge();
  const [startedAt] = useState(() => Date.now());
  const [step, setStep] = useState(1);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [wound, setWound] = useState<string[]>([]);
  const [pain, setPain] = useState<Pain>("same");
  const [fever, setFever] = useState<Fever>("not-sure");
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [photo, setPhoto] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [photoError, setPhotoError] = useState("");

  const toggleWound = (value: string) => {
    setWound((current) => {
      if (value === "normal") return current.includes("normal") ? [] : ["normal"];
      const withoutNormal = current.filter((item) => item !== "normal");
      return withoutNormal.includes(value) ? withoutNormal.filter((item) => item !== value) : [...withoutNormal, value];
    });
  };

  const uploadPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setPhotoError("Please choose a photo smaller than 1.5 MB for this local demo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setPhoto(String(reader.result)); setPhotoError(""); };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!feeling) return;
    const saved = submitCheckIn({ feeling, wound, pain, fever, medicationTaken, photoDataUrl: photo, note: note.trim() || undefined }, startedAt);
    setResult(saved as Result);
  };

  if (result) {
    const status = result.result === "red" ? "Review first" : result.result === "yellow" ? "Review soon" : "Routine";
    return (
      <AppViewport role="patient">
        <div className="screen checkin-result-screen"><StatusBar />
          <div className="checkin-result">
            <div className={`result-icon result-${result.result}`}>{result.result === "green" ? "✓" : "!"}</div>
            <h1>Check-in submitted</h1>
            <p>Your answers were saved on this device and are now visible in the nurse workflow.</p>
            <div className={`result-card result-${result.result}`}><span>Follow-up status</span><strong>{status}</strong><small>CareBridge supports review. It does not diagnose.</small></div>
            <div className="adaptive-card"><span>↻</span><div><strong>Adaptive schedule updated</strong><p>Next check-in: {formatDate(result.nextCheckIn, { weekday: "long", day: "numeric", month: "long" })}</p></div></div>
            <Link className="primary-button result-home" href="/patient">Return home</Link>
          </div>
        </div>
      </AppViewport>
    );
  }

  return (
    <AppViewport role="patient">
      <div className="screen checkin-screen">
        <StatusBar /><PageHeader title="Recovery check-in" badge={`${step} of 2`} />
        <div className="checkin-content">
          <div className="progress-track"><span style={{ width: step === 1 ? "50%" : "100%" }} /></div>
          {step === 1 ? (
            <>
              <div><h1 className="display-title">How are you feeling today?</h1><p className="body-text checkin-instruction">Choose one answer</p></div>
              <div className="feeling-options">
                {([
                  ["better", "↑", "Better", "Less pain or easier movement"],
                  ["same", "→", "Same", "No important change"],
                  ["worse", "↓", "Worse", "More pain or a new problem"],
                ] as const).map(([value, icon, label, helper]) => (
                  <button className={feeling === value ? "selected" : ""} key={value} onClick={() => setFeeling(value)}>
                    <span>{icon}</span><div><strong>{label}</strong><small>{helper}</small></div><i>{feeling === value ? "●" : "○"}</i>
                  </button>
                ))}
              </div>
              <button className={`not-sure-option ${feeling === "not-sure" ? "selected" : ""}`} onClick={() => setFeeling("not-sure")}>I’m not sure</button>
              <div className="checkin-button-wrap"><PrimaryButton disabled={!feeling} onClick={() => setStep(2)}>Continue&nbsp; →</PrimaryButton></div>
            </>
          ) : (
            <>
              <div><h1 className="display-title">Tell us what changed</h1><p className="body-text checkin-instruction">Select the answers that fit today.</p></div>
              <section className="question-block"><h2>How is your wound?</h2><div className="wound-grid">{[["redness","Redness"],["swelling","Swelling"],["discharge","Discharge"],["normal","Looks normal"]].map(([value,label]) => <button className={wound.includes(value) ? "selected" : ""} key={value} onClick={() => toggleWound(value)}><span>{wound.includes(value) ? "✓" : "○"}</span>{label}</button>)}</div></section>
              <section className="answer-row"><label>Pain today</label><select value={pain} onChange={(event) => setPain(event.target.value as Pain)}><option value="better">Better</option><option value="same">Same</option><option value="worse">Worse</option></select></section>
              <section className="answer-row"><label>Fever</label><select value={fever} onChange={(event) => setFever(event.target.value as Fever)}><option value="no">No</option><option value="not-sure">Not sure</option><option value="yes">Yes</option></select></section>
              <section className="answer-row"><label>Medication taken?</label><button className={medicationTaken ? "yes" : "no"} onClick={() => setMedicationTaken((value) => !value)}>{medicationTaken ? "Yes ✓" : "No"}</button></section>
              <label className={`photo-upload ${photo ? "has-photo" : ""}`}><input accept="image/*" type="file" onChange={uploadPhoto} />{photo ? <img src={photo} alt="Wound upload preview" /> : <span>＋</span>}<div><strong>{photo ? "Wound photo added" : "Add wound photo"}</strong><small>{photo ? "Tap to replace" : "Optional"}</small></div><em>{photo ? "✓ Added" : "Camera"}</em></label>
              {photoError && <p className="field-error">{photoError}</p>}
              <details className="optional-note"><summary>Add a short note (optional)</summary><textarea className="text-area" maxLength={120} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Example: Pain started last night" /></details>
              <div className="checkin-submit-row"><button className="secondary-button" onClick={() => setStep(1)}>Back</button><PrimaryButton onClick={submit}>Submit check-in</PrimaryButton></div>
            </>
          )}
        </div>
      </div>
    </AppViewport>
  );
}
