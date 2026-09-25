import { randomUUID } from "node:crypto";
import { db, baseDeDatosLista } from "@/lib/db";
import type { Categoria, Producto } from "@/lib/tipos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapearProducto(fila: any): Producto {
  return {
    id: fila.id,
    nombre: fila.nombre,
    slug: fila.slug,
    descripcion: fila.descripcion,
    categoria: fila.categoria,
    precio: Number(fila.precio),
    stock: Number(fila.stock),
    imagenUrl: fila.imagen_url,
    activo: Number(fila.activo) === 1,
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

export async function listarProductos(opciones: {
  soloActivos?: boolean;
  categoria?: Categoria;
  stockMaximo?: number;
  limite?: number;
} = {}): Promise<Producto[]> {
  await baseDeDatosLista();
  const condiciones: string[] = [];
  const args: (string | number)[] = [];

  if (opciones.soloActivos) condiciones.push("activo = 1");
  if (opciones.categoria) {
    condiciones.push("categoria = ?");
    args.push(opciones.categoria);
  }
  if (opciones.stockMaximo !== undefined) {
    condiciones.push("stock <= ?");
    args.push(opciones.stockMaximo);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  const orden = opciones.stockMaximo !== undefined ? "stock ASC" : "creado_en DESC";
  const limite = opciones.limite ? `LIMIT ${opciones.limite}` : "";

  const res = await db.execute({
    sql: `SELECT * FROM productos ${where} ORDER BY ${orden} ${limite}`,
    args,
  });
  return res.rows.map(mapearProducto);
}

export async function obtenerProductoPorSlug(slug: string): Promise<Producto | null> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT * FROM productos WHERE slug = ?",
    args: [slug],
  });
  return res.rows[0] ? mapearProducto(res.rows[0]) : null;
}

export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT * FROM productos WHERE id = ?",
    args: [id],
  });
  return res.rows[0] ? mapearProducto(res.rows[0]) : null;
}

export async function obtenerProductosPorIds(ids: string[]): Promise<Producto[]> {
  if (ids.length === 0) return [];
  await baseDeDatosLista();
  const placeholders = ids.map(() => "?").join(",");
  const res = await db.execute({
    sql: `SELECT * FROM productos WHERE id IN (${placeholders})`,
    args: ids,
  });
  return res.rows.map(mapearProducto);
}

export type DatosProducto = {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
};

export async function crearProducto(datos: DatosProducto): Promise<Producto> {
  await baseDeDatosLista();
  const id = randomUUID();
  const ahora = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO productos
      (id, nombre, slug, descripcion, categoria, precio, stock, imagen_url, activo, creado_en, actualizado_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      datos.nombre,
      datos.slug,
      datos.descripcion,
      datos.categoria,
      datos.precio,
      datos.stock,
      datos.imagenUrl,
      datos.activo ? 1 : 0,
      ahora,
      ahora,
    ],
  });
  return (await obtenerProductoPorId(id))!;
}

export async function actualizarProducto(
  id: string,
  datos: DatosProducto
): Promise<Producto> {
  await baseDeDatosLista();
  await db.execute({
    sql: `UPDATE productos SET
      nombre = ?, slug = ?, descripcion = ?, categoria = ?, precio = ?,
      stock = ?, imagen_url = ?, activo = ?, actualizado_en = ?
      WHERE id = ?`,
    args: [
      datos.nombre,
      datos.slug,
      datos.descripcion,
      datos.categoria,
      datos.precio,
      datos.stock,
      datos.imagenUrl,
      datos.activo ? 1 : 0,
      new Date().toISOString(),
      id,
    ],
  });
  return (await obtenerProductoPorId(id))!;
}

export async function ocultarProducto(id: string): Promise<void> {
  await baseDeDatosLista();
  await db.execute({
    sql: "UPDATE productos SET activo = 0, actualizado_en = ? WHERE id = ?",
    args: [new Date().toISOString(), id],
  });
}

export async function eliminarProducto(id: string): Promise<void> {
  await baseDeDatosLista();
  await db.execute({ sql: "DELETE FROM productos WHERE id = ?", args: [id] });
}

export async function productoTienePedidos(id: string): Promise<boolean> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT id FROM items_pedido WHERE producto_id = ? LIMIT 1",
    args: [id],
  });
  return res.rows.length > 0;
}

export async function ajustarStock(id: string, delta: number): Promise<void> {
  await baseDeDatosLista();
  await db.execute({
    sql: "UPDATE productos SET stock = stock + ?, actualizado_en = ? WHERE id = ?",
    args: [delta, new Date().toISOString(), id],
  });
}
