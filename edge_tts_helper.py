import sys
import asyncio
import json
import edge_tts

async def run(text: str, voice: str, audio_path: str):
    communicate = edge_tts.Communicate(text, voice)
    words = []

    with open(audio_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                # Vremena su u 100-nanosekundnim jedinicama
                start_sec = round(chunk["offset"] / 10_000_000, 2)
                duration_sec = round(chunk["duration"] / 10_000_000, 2)
                words.append({
                    "word": chunk["text"],
                    "start": start_sec,
                    "end": round(start_sec + duration_sec, 2)
                })

    print(json.dumps({"success": True, "words": words}, ensure_ascii=False))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Nedovoljno argumenata."}))
        sys.exit(1)

    txt = sys.argv[1]
    vc = sys.argv[2]
    out = sys.argv[3]
    asyncio.run(run(txt, vc, out))