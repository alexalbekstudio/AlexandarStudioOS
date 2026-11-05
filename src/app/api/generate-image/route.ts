import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { prompt, width = 1080, height = 1920, model = "flux" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt je obavezan." }, { status: 400 });
    }

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&seed=${seed}`;

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`AI servis nije vratio sliku (Status: ${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Provera da li je zaista preuzeta slika, a ne prazan odgovor
    if (buffer.length < 1000) {
      throw new Error("Preuzeti fajl je oštećen ili prazan.");
    }

    const fileName = `img_${Date.now()}.jpg`;
    const imagesDir = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, fileName);
    await fs.promises.writeFile(filePath, new Uint8Array(buffer));

    return NextResponse.json({
      success: true,
      imageUrl: `/images/${fileName}`,
      fileName,
    });
  } catch (error: any) {
    console.error("Greška pri generisanju slike:", error);
    return NextResponse.json(
      { error: "Generisanje slike nije uspelo.", details: error.message },
      { status: 500 }
    );
  }
}