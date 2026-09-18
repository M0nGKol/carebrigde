import type { CheckInDraft, RiskStatus } from "./types";

export function evaluateCheckIn(draft: CheckInDraft): {
  result: RiskStatus;
  reasons: string[];
  nextCheckInDays: number;
} {
  const reasons: string[] = [];
  if (draft.feeling === "worse") reasons.push("Overall recovery feels worse");
  if (draft.pain === "worse") reasons.push("Pain getting worse");
  if (draft.fever === "yes") reasons.push("Fever reported");
  if (draft.fever === "not-sure") reasons.push("Fever is uncertain");
  if (draft.wound.includes("redness")) reasons.push("Increasing redness");
  if (draft.wound.includes("swelling")) reasons.push("Wound swelling");
  if (draft.wound.includes("discharge")) reasons.push("Unusual discharge");
  if (!draft.medicationTaken) reasons.push("Medication dose missed");

  const severeWound = draft.wound.some((item) => ["redness", "swelling", "discharge"].includes(item));
  if (draft.fever === "yes" || (draft.feeling === "worse" && (severeWound || draft.pain === "worse"))) {
    return { result: "red", reasons, nextCheckInDays: 1 };
  }
  if (
    draft.feeling === "same" ||
    draft.feeling === "not-sure" ||
    draft.pain === "same" ||
    draft.fever === "not-sure" ||
    !draft.medicationTaken
  ) {
    return { result: "yellow", reasons: reasons.length ? reasons : ["Review responses soon"], nextCheckInDays: 3 };
  }
  return { result: "green", reasons: ["Recovering as expected"], nextCheckInDays: 7 };
}

export function addDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
