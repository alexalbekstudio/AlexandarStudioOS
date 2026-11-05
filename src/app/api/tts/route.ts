import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, voice, provider = "edge" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Tekst za naraciju je obavezan." }, { status: 400 });
    }

    const publicAudioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(publicAudioDir)) {
      fs.mkdirSync(publicAudioDir, { recursive: true });
    }

    const fileName = `speech_${Date.now()}.mp3`;
    const outputPath = path.join(publicAudioDir, fileName);

    // 1. ELEVENLABS
    if (provider === "elevenlabs") {
      const apiKey =
        (body.apiKey && body.apiKey.trim()) ||
        process.env.ELEVENLABS_API_KEY ||
        "sk_6a98760c3762a4ed49c96a33a2ac644a0f0e1adca65031bf";

      // Dozvoljeni premade glasovi za besplatan tier (podrazumevano Adam)
      const validVoiceId = voice && voice.length > 10 ? voice : "pNInz6obpgDQGcFmaJgB";

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${validVoiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const detailedMsg =
          errorData?.detail?.message ||
          errorData?.message ||
          `HTTP ${res.status}: ${res.statusText}`;
        console.error("ElevenLabs Error:", detailedMsg);
        return NextResponse.json({ error: `ElevenLabs: ${detailedMsg}` }, { status: 500 });
      }

      const audioBuffer = Buffer.from(await res.arrayBuffer());
      await fs.promises.writeFile(outputPath, new Uint8Array(audioBuffer));

      return NextResponse.json({
        success: true,
        audioUrl: `/audio/${fileName}`,
        fileName,
      });
    }

    // 2. GOOGLE (gTTS)
    if (provider === "google") {
      const gLang = voice && voice.startsWith("en") ? "en" : "sr";
      const cleanText = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
      const pyCode = `from gtts import gTTS; tts = gTTS(text=\\"${cleanText}\\", lang='${gLang}'); tts.save(r'${outputPath}')`;

      await execPromise(`py -3.12 -c "${pyCode}"`);

      return NextResponse.json({
        success: true,
        audioUrl: `/audio/${fileName}`,
        fileName,
      });
    }

    // 3. MICROSOFT EDGE-TTS (sa edge_tts_helper za trenutne reči bez Whisper-a)
    const edgeVoice = voice || "sr-RS-SophieNeural";
    const helperPath = path.join(process.cwd(), "edge_tts_helper.py");
    const safeText = text.replace(/"/g, '\\"').replace(/\n/g, " ");

    const { stdout } = await execPromise(
      `py -3.12 "${helperPath}" "${safeText}" "${edgeVoice}" "${outputPath}"`,
      { maxBuffer: 1024 * 1024 * 10 }
    );

    const parsed = JSON.parse(stdout.trim());
    return NextResponse.json({
      success: true,
      audioUrl: `/audio/${fileName}`,
      words: parsed.words || [],
      fileName,
    });
  } catch (err: any) {
    console.error("TTS greška:", err);
    return NextResponse.json({ error: err.message || "Generisanje glasa nije uspelo." }, { status: 500 });
  }
}