import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { crearSesionAdmin } from "@/lib/auth";
import {
  contarAdminUsuarios,
  crearAdminUsuario,
  obtenerAdminUsuarioParaLogin,
} from "@/lib/admin-usuarios";

const loginSchema = z.object({
  email: z.string().email(),
  clave: z.string().min(1),
});

const setupSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  clave: z.string().min(6, "La clave debe tener al menos 6 caracteres."),
  claveMaestra: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const totalUsuarios = await contarAdminUsuarios();

  // Todavía no existe ningún usuario: se crea el primero usando la clave
  // maestra (ADMIN_PASSWORD) como llave de una sola vez.
  if (totalUsuarios === 0) {
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
        { status: 400 }
      );
    }
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "El servidor no tiene configurada ADMIN_PASSWORD." },
        { status: 500 }
      );
    }
    if (parsed.data.claveMaestra !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Clave maestra incorrecta." }, { status: 401 });
    }

    const usuario = await crearAdminUsuario({
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      password: parsed.data.clave,
    });
    await crearSesionAdmin(usuario);
    return NextResponse.json({ ok: true, primerUsuario: true });
  }

  // Ya existen usuarios: login normal por email + clave.
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const usuario = await obtenerAdminUsuarioParaLogin(parsed.data.email);
  if (!usuario) {
    return NextResponse.json({ error: "Email o clave incorrectos." }, { status: 401 });
  }

  const claveValida = await bcrypt.compare(parsed.data.clave, usuario.passwordHash);
  if (!claveValida) {
    return NextResponse.json({ error: "Email o clave incorrectos." }, { status: 401 });
  }

  await crearSesionAdmin(usuario);
  return NextResponse.json({ ok: true });
}
