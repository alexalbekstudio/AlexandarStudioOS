import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

// Pomoćna funkcija koja pretvara relativni /images/, /audio/ ili lokalni video fajl u data-uri (base64)
// kako Chrome tokom renderovanja nikada ne bi zavisio od porta 3000/3001
function resolveLocalAsset(assetUrl) {
  if (!assetUrl) return null;

  // Ako je pun eksterni URL
  if (assetUrl.startsWith("http://") || assetUrl.startsWith("https://")) {
    // Sprečavamo slučajno gađanje internog porta 3001
    return assetUrl.replace(":3001/", ":3000/");
  }

  // Ako je relativna putanja koja počinje sa /
  if (assetUrl.startsWith("/")) {
    const localDiskPath = path.join(process.cwd(), "public", assetUrl.slice(1));
    if (fs.existsSync(localDiskPath)) {
      const ext = path.extname(localDiskPath).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
      };
      const mime = mimeTypes[ext] || "application/octet-stream";
      const base64Data = fs.readFileSync(localDiskPath).toString("base64");
      return `data:${mime};base64,${base64Data}`;
    }
  }

  return assetUrl;
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath || !fs.existsSync(jsonPath)) {
    console.error("Nema ulaznog JSON fajla.");
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const originalInputProps = JSON.parse(raw);

  // Usklađivanje svih lokalnih resursa (uključujući novog avatara i pozadinski video)
  const inputProps = {
    ...originalInputProps,
    imageSrc: resolveLocalAsset(originalInputProps.imageSrc),
    videoSrc: resolveLocalAsset(originalInputProps.videoSrc),
    avatarVideoSrc: resolveLocalAsset(originalInputProps.avatarVideoSrc),
    audioSrc: resolveLocalAsset(originalInputProps.audioSrc),
    bgmSrc: resolveLocalAsset(originalInputProps.bgmSrc),
  };

  const { words = [] } = inputProps;
  const fps = 30;
  const lastWordEnd = words.length > 0 ? words[words.length - 1].end : 3;
  const durationInSeconds = Math.max(lastWordEnd + 1.2, 3);
  const durationInFrames = Math.max(Math.round(durationInSeconds * fps), 30);

  const rendersDir = path.join(process.cwd(), "public", "renders");
  if (!fs.existsSync(rendersDir)) {
    fs.mkdirSync(rendersDir, { recursive: true });
  }

  const outputFileName = `render_${Date.now()}.mp4`;
  const outputLocation = path.join(rendersDir, outputFileName);

  console.log("Pravim Remotion bundle...");
  const entryPoint = path.join(process.cwd(), "src", "remotion", "index.ts");
  const bundleLocation = await bundle({ entryPoint });

  console.log("Biram kompoziciju...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "AlexandarStudioVideo",
    inputProps,
  });

  console.log(`Renderujem video (${durationInFrames} frejmova)...`);
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
    logLevel: "error",
  });

  console.log(JSON.stringify({ success: true, videoUrl: `/renders/${outputFileName}` }));
}

main().catch((err) => {
  console.error("Greška tokom rendera:", err);
  process.exit(1);
});