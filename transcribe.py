import sys
import os
import io
import json
import warnings
import imageio_ffmpeg

# Forsiramo UTF-8 za standardni izlaz na Windows konzoli
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Postavljanje FFmpeg-a u PATH
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
ffmpeg_dir = os.path.dirname(ffmpeg_exe)
os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

standard_ffmpeg = os.path.join(ffmpeg_dir, "ffmpeg.exe")
if not os.path.exists(standard_ffmpeg):
    import shutil
    shutil.copyfile(ffmpeg_exe, standard_ffmpeg)

warnings.filterwarnings("ignore")
import whisper

def transcribe_with_timestamps(audio_path: str, lang: str = "sr", model_size: str = "base"):
    model = whisper.load_model(model_size)
    result = result = model.transcribe(
        audio_path,
        language="sr",
        initial_prompt="Ovo je transkripcija na čistom srpskom jeziku sa svim slovima č, ć, ž, š, đ.",
        word_timestamps=True,
        fp16=False
    )
    
    words_data = []
    full_text = []

    for segment in result.get("segments", []):
        full_text.append(segment.get("text", "").strip())
        for w in segment.get("words", []):
            words_data.append({
                "word": w.get("word", "").strip(),
                "start": round(w.get("start", 0), 2),
                "end": round(w.get("end", 0), 2),
                "probability": round(w.get("probability", 1.0), 2)
            })

    output = {
        "text": " ".join(full_text),
        "language": lang,
        "words": words_data
    }
    
    print(json.dumps(output, ensure_ascii=False))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Putanja do audio fajla nije prosleđena."}))
        sys.exit(1)
        
    putanja = sys.argv[1]
    jezik = sys.argv[2] if len(sys.argv) > 2 else "sr"
    transcribe_with_timestamps(putanja, lang=jezik)