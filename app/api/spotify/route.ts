import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCurrentUser,
  getUserPlaylists,
  getPlaylistTracks,
  getLikedSongs,
  searchTracks,
  refreshAccessToken,
} from "@/lib/spotify";

async function getToken() {
  const cookieStore = await cookies();
  let token = cookieStore.get("spotify_access_token")?.value;

  if (!token) {
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
    if (!refreshToken) return null;

    try {
      const tokenData = await refreshAccessToken(refreshToken);
      token = tokenData.access_token;

      cookieStore.set("spotify_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in,
        path: "/",
      });
    } catch {
      return null;
    }
  }

  return token;
}

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "me": {
        const data = await getCurrentUser(token);
        return NextResponse.json(data);
      }
      case "playlists": {
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");
        const data = await getUserPlaylists(token, limit, offset);
        return NextResponse.json(data);
      }
      case "playlist-tracks": {
        const playlistId = searchParams.get("playlistId");
        if (!playlistId) {
          return NextResponse.json({ error: "playlistId required" }, { status: 400 });
        }
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");
        const data = await getPlaylistTracks(token, playlistId, limit, offset);
        return NextResponse.json(data);
      }
      case "liked": {
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");
        const data = await getLikedSongs(token, limit, offset);
        return NextResponse.json(data);
      }
      case "search": {
        const query = searchParams.get("q");
        if (!query) {
          return NextResponse.json({ error: "query required" }, { status: 400 });
        }
        const limit = parseInt(searchParams.get("limit") || "20");
        const data = await searchTracks(token, query, limit);
        return NextResponse.json(data);
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "EXPIRED_TOKEN") {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}
