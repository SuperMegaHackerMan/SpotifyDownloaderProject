"use client";

import { Music, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SpotifyUser } from "@/lib/types";

interface DashboardHeaderProps {
  user: SpotifyUser;
  queueCount: number;
}

export function DashboardHeader({ user, queueCount }: DashboardHeaderProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Music className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">Spotify Music Grabber</h1>
          <p className="text-xs text-muted-foreground">
            {queueCount} track{queueCount !== 1 ? "s" : ""} in queue
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={user.images?.[0]?.url}
              alt={user.display_name}
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              {user.display_name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-foreground">{user.display_name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}
