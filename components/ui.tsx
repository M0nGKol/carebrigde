"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { RiskStatus } from "@/lib/types";

export function AppViewport({ children, role }: { children: ReactNode; role?: "patient" | "nurse" | "surgeon" }) {
  return (
    <main className="viewport">
      <div className="desktop-note">
        <Brand compact />
        <p>Interactive MVP · Saved in this browser</p>
        {role && <span className="role-label">{role} view</span>}
      </div>
      <section className="phone-shell">{children}</section>
    </main>
  );
}

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span>●&nbsp; Wi-Fi&nbsp; 99%</span>
    </div>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img src="/assets/carebridge-logo.png" alt="CareBridge" />
    </div>
  );
}

export function PageHeader({ title, badge, back = true }: { title: string; badge?: string; back?: boolean }) {
  const router = useRouter();
  return (
    <header className="page-header">
      {back ? (
        <button className="icon-button" onClick={() => router.back()} aria-label="Go back">
          ‹
        </button>
      ) : (
        <span className="header-spacer" />
      )}
      <h1>{title}</h1>
      {badge ? <span className="header-badge">{badge}</span> : <span className="header-spacer" />}
    </header>
  );
}

export function PrimaryButton({ children, onClick, disabled, type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" }) {
  return (
    <button className="primary-button" onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatusBadge({ status }: { status: RiskStatus }) {
  const labels: Record<RiskStatus, string> = {
    red: "Review first",
    yellow: "Review soon",
    green: "Routine",
    "no-response": "No reply",
  };
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}

export function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

type NavItem = { href: string; label: string; icon: string };

function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/patient" && item.href !== "/nurse" && pathname.startsWith(item.href));
        return (
          <Link className={active ? "active" : ""} href={item.href} key={item.href}>
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PatientNav() {
  return <BottomNav items={[{ href: "/patient", label: "Home", icon: "⌂" }, { href: "/patient/plan", label: "Plan", icon: "▤" }, { href: "/patient/help", label: "Help", icon: "?" }]} />;
}

export function NurseNav() {
  return <BottomNav items={[{ href: "/nurse", label: "Today", icon: "⌂" }, { href: "/nurse/patients", label: "Patients", icon: "♙" }, { href: "/nurse/impact", label: "Impact", icon: "↗" }]} />;
}

export function LoadingView() {
  return <div className="loading-view"><div className="spinner" /><p>Loading CareBridge…</p></div>;
}
