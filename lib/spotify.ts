const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export function getSpotifyAuthUrl(redirectUri: string) {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: redirectUri,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string, redirectUri: string) {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

async function spotifyFetch(endpoint: string, accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("EXPIRED_TOKEN");
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  return response.json();
}

export async function getCurrentUser(accessToken: string) {
  return spotifyFetch("/me", accessToken);
}

export async function getUserPlaylists(accessToken: string, limit = 50, offset = 0) {
  return spotifyFetch(`/me/playlists?limit=${limit}&offset=${offset}`, accessToken);
}

export async function getPlaylistTracks(accessToken: string, playlistId: string, limit = 50, offset = 0) {
  return spotifyFetch(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, accessToken);
}

export async function getLikedSongs(accessToken: string, limit = 50, offset = 0) {
  return spotifyFetch(`/me/tracks?limit=${limit}&offset=${offset}`, accessToken);
}

export async function searchTracks(accessToken: string, query: string, limit = 20) {
  return spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, accessToken);
}
