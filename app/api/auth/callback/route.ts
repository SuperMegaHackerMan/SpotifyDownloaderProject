import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotify";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname === "localhost" ? "127.0.0.1" : url.hostname;
  const redirectUri = `${url.protocol}//${hostname}${url.port ? `:${url.port}` : ""}/api/auth/callback`;

  console.log("TESTINGTESTINGTESTINGTESTING", url.hostname);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=auth_failed", url.origin));
  }

  try {
    const redirectUri = `${url.origin}/api/auth/callback`;
    const tokenData = await getAccessToken(code, redirectUri);

    const cookieStore = await cookies();

    cookieStore.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
      path: "/",
    });

    cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.redirect(new URL("/dashboard", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/?error=token_failed", url.origin));
  }
}
