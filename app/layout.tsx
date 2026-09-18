import type { Metadata, Viewport } from "next";
import { CareBridgeProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareBridge MVP",
  description: "A local-first post-surgical recovery follow-up MVP.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f9f8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CareBridgeProvider>{children}</CareBridgeProvider>
      </body>
    </html>
  );
}
