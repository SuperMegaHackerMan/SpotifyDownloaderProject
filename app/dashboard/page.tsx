"use client";

import { useSpotifyUser } from "@/hooks/use-spotify";
import { DashboardShell } from "@/components/dashboard-shell";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: user, error, isLoading } = useSpotifyUser();
  const router = useRouter();

  useEffect(() => {
    if (error?.message === "UNAUTHORIZED") {
      router.push("/");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Failed to load. Please{" "}
          <a href="/" className="text-primary underline">
            sign in again
          </a>
          .
        </p>
      </div>
    );
  }

  return <DashboardShell user={user} />;
}
