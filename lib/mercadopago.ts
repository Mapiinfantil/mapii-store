import type { Pedido } from "@/lib/tipos";

// Crea una preferencia de pago en Mercado Pago (Checkout Pro) y devuelve la
// URL a la que hay que redirigir al comprador. Documentación:
// https://www.mercadopago.cl/developers/es/docs/checkout-pro/landing
export async function crearPreferenciaMercadoPago(
  pedido: Pedido
): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const preferencia = {
    items: pedido.items.map((item) => ({
      title: item.producto.nombre,
      quantity: item.cantidad,
      unit_price: item.precioUnitario,
      currency_id: "CLP",
    })),
    external_reference: pedido.id,
    back_urls: {
      success: `${siteUrl}/checkout/exito?pedido=${pedido.id}`,
      pending: `${siteUrl}/checkout/pendiente?pedido=${pedido.id}`,
      failure: `${siteUrl}/checkout?error=pago`,
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/mercadopago/webhook`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferencia),
  });

  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`Mercado Pago rechazó la preferencia: ${detalle}`);
  }

  const data = await res.json();
  return data.init_point as string;
}
