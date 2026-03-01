import urllib.parse
import unicodedata

def ascii_fallback_filename(name: str) -> str:
    # Convert to ASCII-ish safe filename for the plain filename= parameter
    normalized = unicodedata.normalize("NFKD", name)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_only = ascii_only.replace('"', "").strip()
    return ascii_only or "download.mp3"

def content_disposition_with_utf8(filename: str) -> str:
    # RFC 5987: filename* supports UTF-8
    quoted = urllib.parse.quote(filename, safe="")
    fallback = ascii_fallback_filename(filename)
    return f'attachment; filename="{fallback}"; filename*=UTF-8\'\'{quoted}'
