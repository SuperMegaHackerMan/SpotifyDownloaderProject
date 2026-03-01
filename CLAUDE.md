# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (TypeScript errors are ignored — see next.config.mjs)
npm run lint     # Run ESLint
npm run start    # Start production server
```

There are no tests in this project.

## Environment Variables

Requires a `.env.local` file with:
```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

The Spotify app must have `http://127.0.0.1:<port>/api/auth/callback` registered as a redirect URI. The auth callback deliberately rewrites `localhost` to `127.0.0.1` to match this.

## Architecture

This is a **Next.js 16 App Router** application that lets users browse their Spotify library and download 30-second track preview clips as MP3s.

### Auth Flow
OAuth 2.0 Authorization Code flow handled entirely server-side:
1. `/api/auth/login` → redirects to Spotify with scopes
2. `/api/auth/callback` → exchanges code for tokens, stores `spotify_access_token` and `spotify_refresh_token` as `httpOnly` cookies
3. `/api/auth/logout` → clears cookies
4. `/api/spotify` automatically refreshes the access token from the refresh token when the access token is missing

### Data Flow
- All Spotify API calls go through a single server-side route: **`/api/spotify?action=<action>`** (actions: `me`, `playlists`, `playlist-tracks`, `liked`, `search`)
- Client components call this route via **SWR hooks** in `hooks/use-spotify.ts` — never the Spotify API directly
- `lib/spotify.ts` contains the raw Spotify API wrappers used only by the server route
- Downloads go through `/api/download` (POST), which proxies the Spotify preview URL server-side and returns the audio as a blob

### Component Structure
`DashboardShell` is the top-level client component that owns all shared state:
- `downloadQueue: SpotifyTrack[]` — tracks queued for download, passed down to `DownloadQueue` sidebar
- `selectedPlaylistId` — controls whether `PlaylistGrid` or `TrackList` is shown in the playlists tab

The three main content tabs (Playlists, Liked Songs, Search) all render `TrackRow` components that accept `onAddToQueue` and `queuedTrackIds` props to control queue state.

### UI
- **shadcn/ui** components in `components/ui/` (Radix UI primitives + Tailwind CSS v4)
- `components.json` configures shadcn aliases (`@/components`, `@/lib/utils`, etc.)
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) — use this for all className merging
- `next-themes` handles dark/light mode via `ThemeProvider` in `app/layout.tsx`
- Icons are from `lucide-react`

### Python API (Full-Song Downloader)
A separate FastAPI service in `python_api/` that uses yt-dlp to search YouTube and download full songs as MP3s.

**Setup:**
```bash
cd python_api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**System dependency:** `ffmpeg` must be installed and on PATH (required by yt-dlp for MP3 conversion).
- Windows: `winget install ffmpeg` or download from https://ffmpeg.org

**Endpoints:**
- `GET /health` → `{ "status": "ok" }`
- `POST /download` body: `{ "track_name": str, "artist_name": str }` → streams MP3

**Next.js integration:**
- `app/api/full-download/route.ts` proxies POST requests from the browser to the Python API
- Configured via `PYTHON_API_URL` env var (default: `http://localhost:8000`)
- Returns 503 if the Python service is unreachable
