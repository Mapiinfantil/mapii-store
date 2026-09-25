import { NextRequest, NextResponse } from "next/server";
import { crearSesionAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { clave } = await req.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "El servidor no tiene configurada ADMIN_PASSWORD." },
      { status: 500 }
    );
  }

  if (clave !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Clave incorrecta." }, { status: 401 });
  }

  await crearSesionAdmin();
  return NextResponse.json({ ok: true });
}
