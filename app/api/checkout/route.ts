import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { obtenerProductosPorIds, ajustarStock } from "@/lib/productos";
import { upsertCliente } from "@/lib/clientes";
import { crearPedido, registrarPagoPedido } from "@/lib/pedidos";
import { crearPreferenciaMercadoPago } from "@/lib/mercadopago";

const itemSchema = z.object({
  productoId: z.string(),
  cantidad: z.number().int().positive(),
});

const bodySchema = z.object({
  cliente: z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().optional().default(""),
    direccion: z.string().min(1),
  }),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const { cliente, items } = parsed.data;

  // Trae los productos reales desde la base para calcular el total con el
  // precio y stock verdaderos (nunca confiar en lo que manda el navegador).
  const productos = await obtenerProductosPorIds(items.map((i) => i.productoId));

  for (const item of items) {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto || !producto.activo) {
      return NextResponse.json(
        { error: "Uno de los productos ya no está disponible." },
        { status: 400 }
      );
    }
    if (producto.stock < item.cantidad) {
      return NextResponse.json(
        { error: `No hay stock suficiente de "${producto.nombre}".` },
        { status: 400 }
      );
    }
  }

  const clienteDb = await upsertCliente(cliente);

  const pedido = await crearPedido({
    clienteId: clienteDb.id,
    items: items.map((item) => {
      const producto = productos.find((p) => p.id === item.productoId)!;
      return {
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      };
    }),
  });

  // Descuenta stock al momento de crear el pedido para no vender de más.
  // Si el pago falla, este pedido queda como PENDIENTE y se puede cancelar
  // manualmente desde el admin, lo que repone el stock.
  await Promise.all(
    pedido.items.map((item) => ajustarStock(item.productoId, -item.cantidad))
  );

  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    const urlPago = await crearPreferenciaMercadoPago(pedido);
    await registrarPagoPedido(pedido.id, "MERCADO_PAGO", "");
    return NextResponse.json({ pedidoId: pedido.id, urlPago });
  }

  // Todavía no hay credenciales de Mercado Pago: el pedido queda registrado
  // y se avisa al comprador que se coordinará el pago manualmente.
  return NextResponse.json({ pedidoId: pedido.id, urlPago: null });
}
