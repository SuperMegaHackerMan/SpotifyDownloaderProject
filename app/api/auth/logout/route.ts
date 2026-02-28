import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  cookieStore.delete("spotify_access_token");
  cookieStore.delete("spotify_refresh_token");
  return NextResponse.redirect(new URL("/", url.origin));
}
