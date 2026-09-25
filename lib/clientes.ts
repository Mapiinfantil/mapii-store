import { randomUUID } from "node:crypto";
import { db, baseDeDatosLista } from "@/lib/db";
import type { Cliente } from "@/lib/tipos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapearCliente(fila: any): Cliente {
  return {
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    telefono: fila.telefono,
    direccion: fila.direccion,
    creadoEn: fila.creado_en,
  };
}

export async function upsertCliente(datos: {
  nombre: string;
  email: string;
  telefono?: string;
  direccion: string;
}): Promise<Cliente> {
  await baseDeDatosLista();
  const existente = await db.execute({
    sql: "SELECT * FROM clientes WHERE email = ?",
    args: [datos.email],
  });

  if (existente.rows[0]) {
    await db.execute({
      sql: "UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE email = ?",
      args: [datos.nombre, datos.telefono ?? "", datos.direccion, datos.email],
    });
    return mapearCliente({ ...existente.rows[0], nombre: datos.nombre });
  }

  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO clientes (id, nombre, email, telefono, direccion, creado_en)
      VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      datos.nombre,
      datos.email,
      datos.telefono ?? "",
      datos.direccion,
      new Date().toISOString(),
    ],
  });
  return {
    id,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono ?? "",
    direccion: datos.direccion,
    creadoEn: new Date().toISOString(),
  };
}

export async function listarClientesConPedidos(): Promise<
  (Cliente & { pedidos: { total: number; estado: string }[] })[]
> {
  await baseDeDatosLista();
  const clientes = await db.execute("SELECT * FROM clientes ORDER BY creado_en DESC");
  const pedidos = await db.execute("SELECT cliente_id, total, estado FROM pedidos");

  return clientes.rows.map((c) => ({
    ...mapearCliente(c),
    pedidos: pedidos.rows
      .filter((p) => p.cliente_id === c.id)
      .map((p) => ({ total: Number(p.total), estado: String(p.estado) })),
  }));
}
