"use client";

import Link from "next/link";
import { AppViewport, Brand, StatusBar } from "@/components/ui";
import { useCareBridge } from "@/lib/store";

const roles = [
  { href: "/patient", icon: "♡", title: "Patient", text: "Complete a 1-minute recovery check-in" },
  { href: "/nurse", icon: "✚", title: "Nurse", text: "Review priority patients and take action" },
  { href: "/surgeon", icon: "✓", title: "Surgeon", text: "Review only escalated cases" },
];

export default function DemoPage() {
  const { resetDemo } = useCareBridge();
  return (
    <AppViewport>
      <div className="screen judge-screen">
        <StatusBar />
        <div className="judge-content">
          <Brand />
          <div className="care-loop-card">
            <div className="care-loop-graphic"><span>●</span><b>⌄</b><span>●</span></div>
            <div><h2>One clear care loop</h2><p><b>1</b> Check in</p><p><b>2</b> Nurse reviews</p><p><b>3</b> Care team acts</p></div>
          </div>
          <h1 className="display-title">Test the CareBridge MVP</h1>
          <p className="body-text centered">Choose a role, or start the recommended judge demo.</p>
          <h2 className="section-title">Choose a journey</h2>
          <div className="role-list">
            {roles.map((role) => (
              <Link className="role-card" href={role.href} key={role.href}>
                <span className="role-icon">{role.icon}</span>
                <span className="role-copy"><strong>{role.title}</strong><small>{role.text}</small></span>
                <span className="chevron">›</span>
              </Link>
            ))}
          </div>
          <Link className="primary-button judge-button" href="/nurse">Start judge demo</Link>
          <button className="reset-button" onClick={resetDemo}>Reset local demo data</button>
          <p className="caption">Data is stored only in this browser</p>
        </div>
      </div>
    </AppViewport>
  );
}
