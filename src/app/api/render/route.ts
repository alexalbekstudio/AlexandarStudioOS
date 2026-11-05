import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const inputProps = await req.json();

    // Privremeni ulazni fajl za render
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempJson = path.join(tempDir, `render_input_${Date.now()}.json`);
    await fs.promises.writeFile(tempJson, JSON.stringify(inputProps, null, 2), "utf-8");

    const scriptPath = path.join(process.cwd(), "render-script.mjs");
    const cmd = `node "${scriptPath}" "${tempJson}"`;

    const { stdout, stderr } = await execPromise(cmd, { maxBuffer: 1024 * 1024 * 50 });

    // Brisanje privremenog fajla
    if (fs.existsSync(tempJson)) {
      fs.unlinkSync(tempJson);
    }

    // Izvlačenje JSON rezultata iz stdout-a
    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    const result = JSON.parse(lastLine);

    if (result.success) {
      return NextResponse.json({
        success: true,
        videoUrl: result.videoUrl,
      });
    }

    throw new Error(stderr || "Renderovanje nije vratilo videoUrl.");
  } catch (error: any) {
    console.error("Render API Greška:", error);
    return NextResponse.json(
      { error: "Greška pri renderovanju videa.", details: error.message },
      { status: 500 }
    );
  }
}