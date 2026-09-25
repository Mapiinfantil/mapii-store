import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { actualizarEstadoPedido, obtenerPedidoPorId } from "@/lib/pedidos";
import { ajustarStock } from "@/lib/productos";
import { haySesionAdminActiva } from "@/lib/auth";

const bodySchema = z.object({
  estado: z.enum(["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const pedidoActual = await obtenerPedidoPorId(id);
  if (!pedidoActual) {
    return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
  }

  // Si se cancela un pedido que no estaba cancelado, se repone el stock.
  if (parsed.data.estado === "CANCELADO" && pedidoActual.estado !== "CANCELADO") {
    await Promise.all(
      pedidoActual.items.map((item) => ajustarStock(item.productoId, item.cantidad))
    );
  }

  await actualizarEstadoPedido(id, parsed.data.estado);
  return NextResponse.json({ ok: true });
}
