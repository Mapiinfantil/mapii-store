import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "mapii_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

export type SesionAdmin = {
  id: string;
  nombre: string;
  email: string;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta SESSION_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(secret);
}

export async function crearSesionAdmin(usuario: SesionAdmin) {
  const token = await new SignJWT({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function cerrarSesionAdmin() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function obtenerSesionAdmin(): Promise<SesionAdmin | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.id),
      nombre: String(payload.nombre),
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}

export async function haySesionAdminActiva(): Promise<boolean> {
  return (await obtenerSesionAdmin()) !== null;
}
