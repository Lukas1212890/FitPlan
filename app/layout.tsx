import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitPlan — osobní trénink",
  description: "Soukromý offline tréninkový plán pro efektivní cvičení.",
  applicationName: "FitPlan",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FitPlan", statusBarStyle: "black-translucent" },
  icons: { icon: "/fitplan-icon-v2.png", apple: "/fitplan-icon-v2.png" },
};

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
