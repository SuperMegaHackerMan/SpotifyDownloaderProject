"use client";

import { useEffect, useState } from "react";
import { Music, Download, ListMusic, Search, Shield, Zap, Headphones, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* Subtle radial glow behind hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(29,185,84,0.07)_0%,transparent_70%)]" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 pb-16 pt-24 text-center sm:pt-32">
        {/* Floating icon */}
        <div
          className={`animate-float relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-[0_0_40px_rgba(29,185,84,0.25)] transition-all duration-700 sm:h-24 sm:w-24 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Music className="h-10 w-10 text-primary-foreground sm:h-12 sm:w-12" />
          {/* Ring pulse */}
          <span className="animate-ping-slow absolute inset-0 rounded-2xl bg-primary/20" />
        </div>

        {/* Headline */}
        <div
          className={`flex flex-col gap-4 transition-all duration-700 delay-100 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Spotify Preview{" "}
            <span className="text-primary/50">Grabber</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg md:max-w-xl">
            Connect your Spotify account, browse your playlists and liked songs,
            search any track, and download <strong>30-second preview clips</strong> as
            MP3 files — right in your browser.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 delay-200 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="group gap-2 px-8 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <a href="/api/auth/login">
              <SpotifyIcon />
              Connect with Spotify
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            Free · Read-only access · No data stored
          </p>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-border px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="How it works"
            subtitle="Three steps to your preview clips"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <span className="text-4xl font-black text-primary/15 select-none">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold text-card-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {/* Connector arrow (hidden on last) */}
                {i < STEPS.length - 1 && (
                  <ChevronRight className="absolute -right-3.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 rounded-full border border-border bg-background p-1 text-muted-foreground sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About the system ─────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="What is this?"
            subtitle="A lightweight tool built on top of the Spotify Web API"
          />
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">The purpose</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Spotify offers 30-second preview clips for nearly every track through
                its public API. This tool surfaces those previews in a clean,
                queue-based interface so you can batch-download the clips you care
                about without writing a single line of code.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">How it connects</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                It uses Spotify's OAuth 2.0 Authorization Code flow — the same
                standard used by every major Spotify integration. After you
                authorise, tokens are stored in secure, server-side HTTP-only
                cookies and never exposed to the browser directly.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">What it reads</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The app requests only the minimum scopes needed:{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                  user-read-private
                </code>
                ,{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                  playlist-read-private
                </code>
                , and{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                  user-library-read
                </code>
                . It never writes, modifies, or deletes anything in your account.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">The download pipeline</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Downloads are proxied server-side — your browser requests the
                server, the server fetches the preview audio from Spotify, and
                returns it as a named{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                  .mp3
                </code>{" "}
                file. Spotify's CDN URL is never exposed to the client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────── */}
      <section className="border-t border-border px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="Everything you need"
            subtitle="Built around your Spotify library"
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-10 text-center">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
          Downloads are 30-second preview clips provided by the Spotify API.
          Full track downloads are not supported due to licensing restrictions.
          This tool is for personal, non-commercial use only.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/50">
          Not affiliated with or endorsed by Spotify AB.
        </p>
      </footer>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
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

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Connect",
    description:
      "Sign in with your Spotify account. We only request read permissions — nothing in your account is ever changed.",
  },
  {
    number: "02",
    title: "Browse or Search",
    description:
      "Navigate your playlists and liked songs, or search Spotify's full catalog to find any track.",
  },
  {
    number: "03",
    title: "Queue & Download",
    description:
      "Add tracks to your download queue and grab all their 30-second preview MP3s in one go.",
  },
];

const FEATURES = [
  {
    icon: <ListMusic className="h-5 w-5" />,
    title: "Your Library",
    description: "All your playlists and liked songs in one scrollable view.",
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Track Search",
    description: "Live search across Spotify's entire catalog with instant results.",
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Batch Download",
    description: "Queue multiple tracks and download them all with one click.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Read-Only",
    description: "Minimum scopes only. Your playlists and library are never touched.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant Delivery",
    description: "Preview clips are proxied and returned as named MP3 files in seconds.",
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: "30-Second Previews",
    description: "Every track Spotify exposes a preview for is available to download.",
  },
];
