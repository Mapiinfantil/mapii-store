import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { haySesionAdminActiva } from "@/lib/auth";

const EXTENSIONES_PERMITIDAS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5MB

// En Railway, configurar UPLOADS_DIR=/data/uploads (mismo disco persistente
// que ya usa la base de datos). Sin esa variable, guarda en public/uploads
// para que funcione igual en desarrollo local.
function carpetaUploads() {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function POST(req: NextRequest) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await req.formData();
  const archivo = formData.get("file");

  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }

  const extension = EXTENSIONES_PERMITIDAS[archivo.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WEBP o GIF." },
      { status: 400 }
    );
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json(
      { error: "La imagen no puede pesar más de 5MB." },
      { status: 400 }
    );
  }

  const nombreArchivo = `${randomUUID()}.${extension}`;
  const carpeta = carpetaUploads();
  await mkdir(carpeta, { recursive: true });
  const bytes = Buffer.from(await archivo.arrayBuffer());
  await writeFile(path.join(/* turbopackIgnore: true */ carpeta, nombreArchivo), bytes);

  return NextResponse.json({ url: `/api/uploads/${nombreArchivo}` });
}
