import Link from "next/link";
import { AppViewport, StatusBar } from "@/components/ui";

export default function WelcomePage() {
  return (
    <AppViewport>
      <div className="screen welcome-screen">
        <StatusBar />
        <div className="welcome-content">
          <div className="welcome-halo">
            <div className="welcome-logo-card">
              <img src="/assets/carebridge-logo.png" alt="CareBridge" />
            </div>
          </div>
          <div className="welcome-copy">
            <h1><span>Care</span>Bridge</h1>
            <p className="welcome-lead">Recovery care, connected.</p>
            <p className="body-text">Simple check-ins. Faster follow-up.</p>
          </div>
          <div className="role-chips" aria-label="CareBridge users">
            <span>♡ Patient</span><span>✚ Nurse</span><span>✓ Surgeon</span>
          </div>
          <Link className="primary-button welcome-button" href="/demo">Get started&nbsp; →</Link>
          <p className="welcome-language">English&nbsp; · &nbsp;ខ្មែរ</p>
        </div>
      </div>
    </AppViewport>
  );
}
