import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);
export const maxDuration = 300;

// Pomoćna funkcija: osigurava da resurs (bilo lokalni /images/, eksterni http, ili base64)
// fizički postoji na disku pre slanja na Colab
async function ensureLocalFile(assetUrl: string, prefix: string, defaultExt: string): Promise<string> {
  const tempDir = path.join(process.cwd(), "public", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // 1. Ako je već lokalna relativna putanja (npr. /images/slika.jpg ili /audio/zvuk.mp3)
  if (assetUrl.startsWith("/") && !assetUrl.startsWith("/blob:")) {
    const directPath = path.join(process.cwd(), "public", assetUrl.slice(1));
    if (fs.existsSync(directPath)) {
      return directPath;
    }
  }

  // 2. Ako je Base64 data-uri
  if (assetUrl.startsWith("data:")) {
    const matches = assetUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], "base64");
      const filePath = path.join(tempDir, `${prefix}_${Date.now()}${defaultExt}`);
      fs.writeFileSync(filePath, new Uint8Array(buffer));
      return filePath;
    }
  }

  // 3. Ako je eksterni URL ili blob URL (fetchable u Node-u ili preuzet sa endpointa)
  try {
    const res = await fetch(assetUrl);
    if (!res.ok) {
      throw new Error(`Neuspešan download resursa: HTTP ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const filePath = path.join(tempDir, `${prefix}_${Date.now()}${defaultExt}`);
    fs.writeFileSync(filePath, new Uint8Array(buffer));
    return filePath;
  } catch (err: any) {
    // Ako je blob: URL koji Node.js fetch ne može direktno dohvatiti,
    // proveri da li fajl slučajno postoji u public/
    const cleaned = assetUrl.replace(/^blob:http:\/\/localhost:\d+\//, "");
    const fallbackPath = path.join(process.cwd(), "public", cleaned);
    if (fs.existsSync(fallbackPath)) {
      return fallbackPath;
    }
    throw new Error(`Nije moguće pročitati resurs (${prefix}): ${err.message || assetUrl}`);
  }
}

export async function POST(req: Request) {
  try {
    const { imageSrc, audioSrc, gradioUrl } = await req.json();

    const targetUrl = (gradioUrl && gradioUrl.trim().replace(/\/+$/, "")) || process.env.AVATAR_GRADIO_URL;

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Niste uneli javni Colab Gradio link." },
        { status: 400 }
      );
    }

    if (!imageSrc || !audioSrc) {
      return NextResponse.json(
        { error: "Izaberite sliku i generišite audio pre pokretanja avatara." },
        { status: 400 }
      );
    }

    console.log("[Avatar API] Pripremam lokalne fajlove za slanje...");
    const imageDiskPath = await ensureLocalFile(imageSrc, "face", ".jpg");
    const audioDiskPath = await ensureLocalFile(audioSrc, "voice", ".mp3");

    console.log(`[Avatar API] Slika spremna: ${imageDiskPath}`);
    console.log(`[Avatar API] Audio spreman: ${audioDiskPath}`);

    const helperScript = path.join(process.cwd(), "avatar_helper.py");

    console.log(`[Avatar API] Pokrećem Python Gradio klijent za: ${targetUrl}`);
    const cmd = `py -3.12 "${helperScript}" "${targetUrl}" "${imageDiskPath}" "${audioDiskPath}"`;

    const { stdout, stderr } = await execPromise(cmd, { maxBuffer: 1024 * 1024 * 30 });

    if (stderr && stderr.includes("Traceback")) {
      console.error("[Avatar API] Python greška:", stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    const parsed = JSON.parse(stdout.trim());
    if (!parsed.success || !parsed.video_path) {
      return NextResponse.json({ error: parsed.error || "Colab nije vratio video." }, { status: 500 });
    }

    const generatedVideoSource = parsed.video_path;

    // Kopiranje izgenerisanog MP4 videa u public/renders folder
    const rendersDir = path.join(process.cwd(), "public", "renders");
    if (!fs.existsSync(rendersDir)) {
      fs.mkdirSync(rendersDir, { recursive: true });
    }

    const fileName = `avatar_${Date.now()}.mp4`;
    const localVideoDest = path.join(rendersDir, fileName);

    if (fs.existsSync(generatedVideoSource)) {
      fs.copyFileSync(generatedVideoSource, localVideoDest);
    } else {
      const response = await fetch(generatedVideoSource);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(localVideoDest, new Uint8Array(buffer));
    }

    console.log(`[Avatar API] Avatar uspešno snimljen: /renders/${fileName}`);

    return NextResponse.json({
      success: true,
      videoUrl: `/renders/${fileName}`,
    });
  } catch (error: any) {
    console.error("[Avatar API] Greška:", error);
    return NextResponse.json(
      { error: error?.message || "Neuspešna obrada avatara na Colabu." },
      { status: 500 }
    );
  }
}