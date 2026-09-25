import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { haySesionAdminActiva } from "@/lib/auth";
import { crearAdminUsuario, obtenerAdminUsuarioParaLogin } from "@/lib/admin-usuarios";

const bodySchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  clave: z.string().min(6, "La clave debe tener al menos 6 caracteres."),
});

export async function POST(req: NextRequest) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  const existente = await obtenerAdminUsuarioParaLogin(parsed.data.email);
  if (existente) {
    return NextResponse.json(
      { error: "Ya existe un usuario con ese email." },
      { status: 400 }
    );
  }

  const usuario = await crearAdminUsuario({
    nombre: parsed.data.nombre,
    email: parsed.data.email,
    password: parsed.data.clave,
  });
  return NextResponse.json({ usuario });
}
