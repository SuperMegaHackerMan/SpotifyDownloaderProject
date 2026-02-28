import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { previewUrl, trackName, artistName } = await request.json();

    if (!previewUrl) {
      return NextResponse.json(
        { error: "No preview URL available for this track" },
        { status: 400 }
      );
    }

    const response = await fetch(previewUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch preview" },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const filename = `${artistName} - ${trackName}.mp3`
      .replace(/[^a-zA-Z0-9\s\-_.()]/g, "")
      .trim();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}
