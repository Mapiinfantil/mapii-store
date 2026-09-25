import { NextResponse } from "next/server";
import { cerrarSesionAdmin } from "@/lib/auth";

export async function POST() {
  await cerrarSesionAdmin();
  return NextResponse.json({ ok: true });
}
