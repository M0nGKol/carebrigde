/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addDays, evaluateCheckIn } from "./rules";
import { initialState } from "./seed";
import type { CareBridgeState, CheckInDraft, FollowUpStage, HelpRequest, Patient } from "./types";

const STORAGE_KEY = "carebridge-mvp-v1";

type StoreValue = {
  state: CareBridgeState;
  hydrated: boolean;
  activePatient: Patient;
  submitCheckIn: (draft: CheckInDraft, startedAt?: number) => { result: string; nextCheckIn: string };
  createHelpRequest: (category: string, note?: string) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  assignTracing: (id: string, nurse: string) => void;
  setFollowUpStage: (id: string, stage: FollowUpStage, note?: string) => void;
  sendSurgeonDecision: (id: string, decision: "urgent-visit" | "continue-monitoring", note: string) => void;
  setLanguage: (language: "en" | "km") => void;
  resetDemo: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const freshSeed = () => JSON.parse(JSON.stringify(initialState)) as CareBridgeState;

export function CareBridgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CareBridgeState>(() => freshSeed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved) as CareBridgeState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setState((current) => ({
      ...current,
      patients: current.patients.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient)),
    }));
  };

  const submitCheckIn = (draft: CheckInDraft, startedAt = Date.now()) => {
    const assessment = evaluateCheckIn(draft);
    const submittedAt = new Date();
    const nextCheckIn = addDays(submittedAt, assessment.nextCheckInDays);
    const responseMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    setState((current) => {
      const patientId = current.activePatientId;
      return {
        ...current,
        checkIns: [
          {
            id: crypto.randomUUID(),
            patientId,
            submittedAt: submittedAt.toISOString(),
            ...draft,
            result: assessment.result,
            reasons: assessment.reasons,
            responseMinutes,
          },
          ...current.checkIns,
        ],
        patients: current.patients.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                status: assessment.result,
                reasons: assessment.reasons,
                nextCheckIn,
                lastResponseAt: submittedAt.toISOString(),
                responseMinutes,
                followUpStage: "pending",
                escalated: assessment.result === "red" ? patient.escalated : false,
              }
            : patient,
        ),
      };
    });
    return { result: assessment.result, nextCheckIn };
  };

  const createHelpRequest = (category: string, note?: string) => {
    setState((current) => {
      const request: HelpRequest = {
        id: crypto.randomUUID(),
        patientId: current.activePatientId,
        category,
        note,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      return { ...current, helpRequests: [request, ...current.helpRequests] };
    });
  };

  const assignTracing = (id: string, nurse: string) => updatePatient(id, { assignedTo: nurse });

  const setFollowUpStage = (id: string, stage: FollowUpStage, note?: string) => {
    const updates: Partial<Patient> = { followUpStage: stage, nurseNote: note };
    if (stage === "resolved") {
      updates.status = "green";
      updates.reasons = ["Follow-up resolved"];
    }
    updatePatient(id, updates);
  };

  const sendSurgeonDecision = (id: string, decision: "urgent-visit" | "continue-monitoring", note: string) => {
    updatePatient(id, {
      surgeonDecision: decision,
      surgeonNote: note,
      escalated: false,
      followUpStage: decision === "urgent-visit" ? "visit-arranged" : "contacted",
    });
  };

  const activePatient = state.patients.find((patient) => patient.id === state.activePatientId) ?? state.patients[0];
  const value: StoreValue = {
    state,
    hydrated,
    activePatient,
    submitCheckIn,
    createHelpRequest,
    updatePatient,
    assignTracing,
    setFollowUpStage,
    sendSurgeonDecision,
    setLanguage: (language) => setState((current) => ({ ...current, language })),
    resetDemo: () => setState(freshSeed()),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useCareBridge() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useCareBridge must be used inside CareBridgeProvider");
  return context;
}
