import { listarPedidos } from "@/lib/pedidos";
import { formatearPrecio } from "@/lib/formato";
import { CambiarEstadoPedido } from "./CambiarEstadoPedido";

export default async function AdminPedidosPage() {
  const pedidos = await listarPedidos();

  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">Pedidos</h1>

      <div className="mt-6 space-y-4">
        {pedidos.length === 0 && (
          <p className="text-ink/60">Todavía no hay pedidos.</p>
        )}
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="rounded-lg border border-line px-5 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[15px] font-medium text-ink">
                  {pedido.cliente.nombre}{" "}
                  <span className="font-normal text-ink/60">
                    · {pedido.cliente.email}
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-olive">
                  {new Date(pedido.creadoEn).toLocaleString("es-CL")}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[15px] text-ink">
                  {formatearPrecio(pedido.total)}
                </span>
                <CambiarEstadoPedido
                  pedidoId={pedido.id}
                  estadoActual={pedido.estado}
                />
              </div>
            </div>
            <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-ink/75">
              {pedido.items.map((item) => (
                <li key={item.id}>
                  {item.producto.nombre} × {item.cantidad} —{" "}
                  {formatearPrecio(item.precioUnitario * item.cantidad)}
                </li>
              ))}
            </ul>
            {pedido.cliente.direccion && (
              <div className="mt-2 text-sm text-ink/60">
                Envío a: {pedido.cliente.direccion}
                {pedido.cliente.telefono ? ` · ${pedido.cliente.telefono}` : ""}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
