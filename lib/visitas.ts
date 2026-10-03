import { randomUUID } from "node:crypto";
import { db, baseDeDatosLista } from "@/lib/db";

// Registro simple de visitas. Se llama desde cada página pública.
// No guarda IP ni datos personales, solo la ruta y la hora.
export async function registrarVisita(ruta: string) {
  try {
    await baseDeDatosLista();
    await db.execute({
      sql: "INSERT INTO visitas (id, ruta, creado_en) VALUES (?, ?, ?)",
      args: [randomUUID(), ruta, new Date().toISOString()],
    });
  } catch {
    // Si falla el registro de la visita no debe romper la página.
  }
}

export async function contarVisitasDesde(fecha: Date): Promise<number> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT COUNT(*) as total FROM visitas WHERE creado_en >= ?",
    args: [fecha.toISOString()],
  });
  return Number(res.rows[0].total);
}
