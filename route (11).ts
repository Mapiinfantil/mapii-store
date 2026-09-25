import { NextRequest, NextResponse } from "next/server";
import { actualizarEstadoPedido, registrarPagoPedido } from "@/lib/pedidos";

// Mercado Pago llama esta URL cada vez que cambia el estado de un pago.
// Ver: https://www.mercadopago.cl/developers/es/docs/checkout-pro/additional-content/notifications/webhooks
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const paymentId =
    url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

  if (tipo !== "payment" || !paymentId) {
    return NextResponse.json({ recibido: true });
  }

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });
  if (!res.ok) return NextResponse.json({ recibido: true });

  const pago = await res.json();
  const pedidoId = pago.external_reference as string | undefined;
  if (!pedidoId) return NextResponse.json({ recibido: true });

  const estado =
    pago.status === "approved"
      ? "PAGADO"
      : pago.status === "rejected" || pago.status === "cancelled"
        ? "CANCELADO"
        : "PENDIENTE";

  try {
    await actualizarEstadoPedido(pedidoId, estado);
    await registrarPagoPedido(pedidoId, "MERCADO_PAGO", String(paymentId));
  } catch {
    // El pedido podría no existir si el webhook llega de otro ambiente de prueba.
  }

  return NextResponse.json({ recibido: true });
}
