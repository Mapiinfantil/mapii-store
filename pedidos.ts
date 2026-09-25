import { randomUUID } from "node:crypto";
import { db, baseDeDatosLista } from "@/lib/db";
import type { Cliente, EstadoPedido, ItemPedido, MedioPago, Pedido, Producto } from "@/lib/tipos";

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

async function armarPedido(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filaPedido: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filasItems: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filasProductos: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filaCliente: any
): Promise<Pedido> {
  const items: ItemPedido[] = filasItems
    .filter((i) => i.pedido_id === filaPedido.id)
    .map((i) => ({
      id: i.id,
      pedidoId: i.pedido_id,
      productoId: i.producto_id,
      cantidad: Number(i.cantidad),
      precioUnitario: Number(i.precio_unitario),
      producto: mapearProducto(filasProductos.find((p) => p.id === i.producto_id)),
    }));

  return {
    id: filaPedido.id,
    clienteId: filaPedido.cliente_id,
    total: Number(filaPedido.total),
    estado: filaPedido.estado as EstadoPedido,
    medioPago: (filaPedido.medio_pago as MedioPago | null) ?? null,
    referenciaPago: filaPedido.referencia_pago,
    creadoEn: filaPedido.creado_en,
    actualizadoEn: filaPedido.actualizado_en,
    cliente: mapearCliente(filaCliente),
    items,
  };
}

export async function listarPedidos(): Promise<Pedido[]> {
  await baseDeDatosLista();
  const [pedidos, items, productos, clientes] = await Promise.all([
    db.execute("SELECT * FROM pedidos ORDER BY creado_en DESC"),
    db.execute("SELECT * FROM items_pedido"),
    db.execute("SELECT * FROM productos"),
    db.execute("SELECT * FROM clientes"),
  ]);

  return Promise.all(
    pedidos.rows.map((p) =>
      armarPedido(
        p,
        items.rows,
        productos.rows,
        clientes.rows.find((c) => c.id === p.cliente_id)
      )
    )
  );
}

export async function ultimosPedidos(cantidad: number): Promise<Pedido[]> {
  const todos = await listarPedidos();
  return todos.slice(0, cantidad);
}

export async function obtenerPedidoPorId(id: string): Promise<Pedido | null> {
  await baseDeDatosLista();
  const [pedido, items, productos, clientes] = await Promise.all([
    db.execute({ sql: "SELECT * FROM pedidos WHERE id = ?", args: [id] }),
    db.execute({ sql: "SELECT * FROM items_pedido WHERE pedido_id = ?", args: [id] }),
    db.execute("SELECT * FROM productos"),
    db.execute("SELECT * FROM clientes"),
  ]);
  if (!pedido.rows[0]) return null;
  return armarPedido(
    pedido.rows[0],
    items.rows,
    productos.rows,
    clientes.rows.find((c) => c.id === pedido.rows[0].cliente_id)
  );
}

export async function contarPedidosPorEstado(estado: EstadoPedido): Promise<number> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT COUNT(*) as total FROM pedidos WHERE estado = ?",
    args: [estado],
  });
  return Number(res.rows[0].total);
}

export async function sumarTotalPedidos(estado: EstadoPedido): Promise<number> {
  await baseDeDatosLista();
  const res = await db.execute({
    sql: "SELECT COALESCE(SUM(total), 0) as suma FROM pedidos WHERE estado = ?",
    args: [estado],
  });
  return Number(res.rows[0].suma);
}

export async function crearPedido(datos: {
  clienteId: string;
  items: { productoId: string; cantidad: number; precioUnitario: number }[];
}): Promise<Pedido> {
  await baseDeDatosLista();
  const id = randomUUID();
  const ahora = new Date().toISOString();
  const total = datos.items.reduce(
    (acc, i) => acc + i.cantidad * i.precioUnitario,
    0
  );

  await db.execute({
    sql: `INSERT INTO pedidos (id, cliente_id, total, estado, referencia_pago, creado_en, actualizado_en)
      VALUES (?, ?, ?, 'PENDIENTE', '', ?, ?)`,
    args: [id, datos.clienteId, total, ahora, ahora],
  });

  for (const item of datos.items) {
    await db.execute({
      sql: `INSERT INTO items_pedido (id, pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?, ?)`,
      args: [randomUUID(), id, item.productoId, item.cantidad, item.precioUnitario],
    });
  }

  return (await obtenerPedidoPorId(id))!;
}

export async function actualizarEstadoPedido(
  id: string,
  estado: EstadoPedido
): Promise<void> {
  await baseDeDatosLista();
  await db.execute({
    sql: "UPDATE pedidos SET estado = ?, actualizado_en = ? WHERE id = ?",
    args: [estado, new Date().toISOString(), id],
  });
}

export async function registrarPagoPedido(
  id: string,
  medioPago: MedioPago,
  referenciaPago: string
): Promise<void> {
  await baseDeDatosLista();
  await db.execute({
    sql: "UPDATE pedidos SET medio_pago = ?, actualizado_en = ? WHERE id = ?",
    args: [medioPago, new Date().toISOString(), id],
  });
  if (referenciaPago) {
    await db.execute({
      sql: "UPDATE pedidos SET referencia_pago = ? WHERE id = ?",
      args: [referenciaPago, id],
    });
  }
}
