"use client";

import { Music, Download, ListMusic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <Music className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Spotify Preview Grabber
        </h1>
        <p className="max-w-md text-muted-foreground leading-relaxed">
          Connect your Spotify account to browse your playlists and liked songs.
          Select tracks and download their 30-second preview clips as MP3 files.
        </p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<ListMusic className="h-5 w-5" />}
          title="Your Library"
          description="Browse all playlists and liked songs"
        />
        <FeatureCard
          icon={<Search className="h-5 w-5" />}
          title="Search"
          description="Find any track on Spotify"
        />
        <FeatureCard
          icon={<Download className="h-5 w-5" />}
          title="Download"
          description="Save preview clips as MP3"
        />
      </div>

      <Button asChild size="lg" className="gap-2 px-8 text-base font-semibold">
        <a href="/api/auth/login">
          <SpotifyIcon />
          Connect with Spotify
        </a>
      </Button>

      <p className="max-w-sm text-center text-xs text-muted-foreground">
        Downloads are 30-second preview clips provided by Spotify. Full track
        downloads are not supported due to licensing restrictions.
      </p>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-card-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
