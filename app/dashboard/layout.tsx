import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Spotify Preview Grabber",
  description: "Browse your Spotify library and download preview clips",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
