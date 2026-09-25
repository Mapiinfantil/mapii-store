import Link from "next/link";
import { listarProductos } from "@/lib/productos";
import { contarPedidosPorEstado, sumarTotalPedidos, ultimosPedidos } from "@/lib/pedidos";
import { contarVisitasDesde } from "@/lib/visitas";
import { formatearPrecio } from "@/lib/formato";

export default async function AdminResumenPage() {
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  const hace30dias = new Date();
  hace30dias.setDate(hace30dias.getDate() - 30);

  const [
    visitas7d,
    visitas30d,
    ventasTotales,
    pedidosPendientes,
    productosStockBajo,
    ultimos,
  ] = await Promise.all([
    contarVisitasDesde(hace7dias),
    contarVisitasDesde(hace30dias),
    sumarTotalPedidos("PAGADO"),
    contarPedidosPorEstado("PENDIENTE"),
    listarProductos({ soloActivos: true, stockMaximo: 3 }),
    ultimosPedidos(5),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">Resumen</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metrica etiqueta="Visitas (7 días)" valor={String(visitas7d)} />
        <Metrica etiqueta="Visitas (30 días)" valor={String(visitas30d)} />
        <Metrica
          etiqueta="Ventas pagadas"
          valor={formatearPrecio(ventasTotales)}
        />
        <Metrica etiqueta="Pedidos pendientes" valor={String(pedidosPendientes)} />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-[15px] font-medium text-olive-deep">
            Stock bajo
          </h2>
          {productosStockBajo.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">
              Ningún producto con stock bajo por ahora.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
              {productosStockBajo.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between px-4 py-2.5 text-sm"
                >
                  <span>{p.nombre}</span>
                  <span className="text-terracotta-deep">
                    {p.stock} unidad{p.stock === 1 ? "" : "es"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-[15px] font-medium text-olive-deep">
            Últimos pedidos
          </h2>
          {ultimos.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">Todavía no hay pedidos.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
              {ultimos.map((p) => (
                <li key={p.id} className="px-4 py-2.5 text-sm">
                  <Link
                    href="/admin/pedidos"
                    className="flex justify-between hover:underline"
                  >
                    <span>
                      {p.cliente.nombre} · {formatearPrecio(p.total)}
                    </span>
                    <span className="text-olive">{p.estado}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Metrica({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-lg bg-blush p-4">
      <div className="text-[13px] text-olive-deep/70">{etiqueta}</div>
      <div className="mt-1 text-2xl font-medium text-olive-deep">{valor}</div>
    </div>
  );
}
