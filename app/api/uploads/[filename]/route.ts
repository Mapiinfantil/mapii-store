import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function carpetaUploads() {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Evita salir de la carpeta de uploads con rutas raras.
  if (filename.includes("/") || filename.includes("..")) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  const contentType = TIPOS[extension];
  if (!contentType) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  try {
    const bytes = await readFile(
      path.join(/* turbopackIgnore: true */ carpetaUploads(), filename)
    );
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }
}
