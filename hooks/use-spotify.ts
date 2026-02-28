import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export function useSpotifyUser() {
  return useSWR("/api/spotify?action=me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}

export function useSpotifyPlaylists() {
  return useSWR("/api/spotify?action=playlists&limit=50", fetcher, {
    revalidateOnFocus: false,
  });
}

export function usePlaylistTracks(playlistId: string | null) {
  return useSWR(
    playlistId
      ? `/api/spotify?action=playlist-tracks&playlistId=${playlistId}&limit=50`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );
}


export function useSpotifySearch(query: string) {
  return useSWR(
    query.length >= 2
      ? `/api/spotify?action=search&q=${encodeURIComponent(query)}`
      : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 500 },
  );
}
