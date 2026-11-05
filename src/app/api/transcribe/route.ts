import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const lang = (formData.get("lang") as string) || "sr";

    if (!file) {
      return NextResponse.json({ error: "Audio fajl nije prosleđen." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.includes("mp3") ? "mp3" : file.type.includes("wav") ? "wav" : "webm";
    const fileName = `upload_${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "audio");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, new Uint8Array(buffer));

    const scriptPath = path.join(process.cwd(), "transcribe.py");
    // Pozivamo sa Pythonom 3.12 i prosleđujemo putanju i izabrani jezik
    const command = `py -3.12 "${scriptPath}" "${filePath}" "${lang}"`;

    const { stdout } = await execPromise(command);
    const result = JSON.parse(stdout.trim());

    return NextResponse.json({
      success: true,
      audioUrl: `/audio/${fileName}`,
      ...result,
    });
  } catch (error: any) {
    console.error("Greška pri transkripciji:", error);
    return NextResponse.json(
      { error: "Transkripcija nije uspela.", details: error.message },
      { status: 500 }
    );
  }
}