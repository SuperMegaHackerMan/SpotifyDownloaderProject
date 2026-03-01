import io
import tempfile
from pathlib import Path
from urllib.parse import quote

import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

def content_disposition_with_utf8(filename: str) -> str:
    """Build a Content-Disposition header that works for any language/script.

    Uses RFC 5987 encoding:
      filename="ascii-fallback.mp3"; filename*=UTF-8''percent-encoded
    Modern browsers prefer filename* and fall back to filename.
    """
    ascii_fallback = filename.encode("ascii", errors="replace").decode()
    encoded = quote(filename, safe=" -_.()[]")
    return f'attachment; filename="{ascii_fallback}"; filename*=UTF-8\'\'{encoded}'


app = FastAPI()


class DownloadRequest(BaseModel):
    track_name: str
    artist_name: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/download")
def download(req: DownloadRequest):
    query = f"ytsearch1:{req.track_name} {req.artist_name}"

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            ydl_opts = {
                "format": "bestaudio/best",
                "outtmpl": str(Path(tmpdir) / "%(id)s.%(ext)s"),
                "ffmpeg_location": r"C:\Users\zarfa\Downloads\ffmpeg-8.0.1-essentials_build\bin",
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
                "quiet": True,
                "no_warnings": True,
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([query])

            mp3_files = list(Path(tmpdir).glob("*.mp3"))
            if not mp3_files:
                raise HTTPException(status_code=500, detail="No MP3 file produced")

            audio_bytes = mp3_files[0].read_bytes()

        safe_artist = req.artist_name.replace('"', "")
        safe_track = req.track_name.replace('"', "")
        filename = f"{safe_artist} - {safe_track}.mp3"
        headers = {"Content-Disposition": content_disposition_with_utf8(filename)}

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers=headers,
        )

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
