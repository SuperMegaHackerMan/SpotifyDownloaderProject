import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const { trackName, artistName } = await req.json();

  let pythonRes: Response;
  try {
    pythonRes = await fetch(`${PYTHON_API_URL}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_name: trackName, artist_name: artistName }),
    });
  } catch {
    return NextResponse.json(
      { error: "Music downloader service is unavailable" },
      { status: 503 }
    );
  }

  if (!pythonRes.ok) {
    const detail = await pythonRes.text().catch(() => "Unknown error");
    return NextResponse.json({ error: detail }, { status: 500 });
  }

  const audioBuffer = await pythonRes.arrayBuffer();
  const contentDisposition =
    pythonRes.headers.get("Content-Disposition") ??
    `attachment; filename="${artistName} - ${trackName}.mp3"`;

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": contentDisposition,
    },
  });
}
