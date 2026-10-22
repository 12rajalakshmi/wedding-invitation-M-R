
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manivannan & Rajalakshmi | Wedding Invitation",
  description:
    "Wedding invitation for Manivannan and Rajalakshmi on 19 and 20 November 2026 at Sowdeshwari Mahal, Ammapet, Salem.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
