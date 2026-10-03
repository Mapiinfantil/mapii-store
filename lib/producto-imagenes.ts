import { randomUUID } from "node:crypto";
import { db, baseDeDatosLista } from "@/lib/db";

export type ImagenProducto = {
  id: string;
  url: string;
  orden: number;
};

export async function listarImagenesProducto(
  productoId: string
): Promise<ImagenProducto[]> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT id, url, orden FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC",
    args: [productoId],
  });
  return res.rows.map((f) => ({
    id: String(f.id),
    url: String(f.url),
    orden: Number(f.orden),
  }));
}

// Reemplaza todas las imágenes de un producto por la lista nueva, en el
// orden en que vienen en el arreglo. Más simple y confiable que ir
// agregando/quitando de a una desde el formulario.
export async function reemplazarImagenesProducto(
  productoId: string,
  urls: string[]
): Promise<void> {
  await baseDeDatosLista();
  await db.execute({
    sql: "DELETE FROM producto_imagenes WHERE producto_id = ?",
    args: [productoId],
  });

  const ahora = new Date().toISOString();
  for (let i = 0; i < urls.length; i++) {
    await db.execute({
      sql: `INSERT INTO producto_imagenes (id, producto_id, url, orden, creado_en)
        VALUES (?, ?, ?, ?, ?)`,
      args: [randomUUID(), productoId, urls[i], i, ahora],
    });
  }
}
