import { NextResponse } from "next/server";
import { getSpotifyAuthUrl } from "@/lib/spotify";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname === "localhost" ? "127.0.0.1" : url.hostname;
  const redirectUri = `${url.protocol}//${hostname}${url.port ? `:${url.port}` : ""}/api/auth/callback`;
  const authUrl = getSpotifyAuthUrl(redirectUri);
  return NextResponse.redirect(authUrl);
}
