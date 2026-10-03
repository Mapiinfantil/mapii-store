import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { db, baseDeDatosLista } from "@/lib/db";
import type { AdminUsuario } from "@/lib/tipos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapear(fila: any): AdminUsuario {
  return {
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    creadoEn: fila.creado_en,
  };
}

export async function contarAdminUsuarios(): Promise<number> {
  await baseDeDatosLista();
  const res = await db.execute("SELECT COUNT(*) as total FROM admin_usuarios");
  return Number(res.rows[0].total);
}

export async function listarAdminUsuarios(): Promise<AdminUsuario[]> {
  await baseDeDatosLista();
  const res = await db.execute(
    "SELECT * FROM admin_usuarios ORDER BY creado_en ASC"
  );
  return res.rows.map(mapear);
}

// Devuelve el usuario junto con el hash de la clave, para poder verificarla
// en el login. No usar este resultado para mostrarlo en pantalla.
export async function obtenerAdminUsuarioParaLogin(email: string): Promise<
  (AdminUsuario & { passwordHash: string }) | null
> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT * FROM admin_usuarios WHERE email = ?",
    args: [email.trim().toLowerCase()],
  });
  if (!res.rows[0]) return null;
  return { ...mapear(res.rows[0]), passwordHash: String(res.rows[0].password_hash) };
}

export async function crearAdminUsuario(datos: {
  nombre: string;
  email: string;
  password: string;
}): Promise<AdminUsuario> {
  await baseDeDatosLista();
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(datos.password, 10);
  const ahora = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO admin_usuarios (id, nombre, email, password_hash, creado_en)
      VALUES (?, ?, ?, ?, ?)`,
    args: [id, datos.nombre, datos.email.trim().toLowerCase(), passwordHash, ahora],
  });
  return { id, nombre: datos.nombre, email: datos.email.trim().toLowerCase(), creadoEn: ahora };
}
