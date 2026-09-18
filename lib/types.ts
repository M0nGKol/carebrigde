export type RiskStatus = "red" | "yellow" | "green" | "no-response";
export type FollowUpStage = "pending" | "contacted" | "visit-arranged" | "resolved";
export type Feeling = "better" | "same" | "worse" | "not-sure";
export type Pain = "better" | "same" | "worse";
export type Fever = "no" | "not-sure" | "yes";

export type Patient = {
  id: string;
  name: string;
  phone: string;
  surgery: string;
  surgeryDate: string;
  recoveryDay: number;
  status: RiskStatus;
  reasons: string[];
  nextCheckIn: string;
  followUpDate: string;
  medication: string;
  lastResponseAt?: string;
  responseMinutes?: number;
  followUpStage: FollowUpStage;
  assignedTo?: string;
  escalated: boolean;
  nurseNote?: string;
  surgeonDecision?: "urgent-visit" | "continue-monitoring";
  surgeonNote?: string;
};

export type CheckIn = {
  id: string;
  patientId: string;
  submittedAt: string;
  feeling: Feeling;
  wound: string[];
  pain: Pain;
  fever: Fever;
  medicationTaken: boolean;
  note?: string;
  photoDataUrl?: string;
  result: RiskStatus;
  reasons: string[];
  responseMinutes: number;
};

export type HelpRequest = {
  id: string;
  patientId: string;
  category: string;
  note?: string;
  createdAt: string;
  status: "new" | "reviewed";
};

export type CareBridgeState = {
  patients: Patient[];
  checkIns: CheckIn[];
  helpRequests: HelpRequest[];
  activePatientId: string;
  language: "en" | "km";
};

export type CheckInDraft = {
  feeling: Feeling;
  wound: string[];
  pain: Pain;
  fever: Fever;
  medicationTaken: boolean;
  note?: string;
  photoDataUrl?: string;
};
