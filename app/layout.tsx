import type { Metadata, Viewport } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ShelterSync — Coordinate donations that matter",
  description:
    "ShelterSync connects donors with regional shelters to track donations, manage inventory, and coordinate meals so urgent needs are met efficiently.",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:px-6 md:pb-12 md:pt-24">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
