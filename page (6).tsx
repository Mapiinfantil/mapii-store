import { listarClientesConPedidos } from "@/lib/clientes";
import { formatearPrecio } from "@/lib/formato";

export default async function AdminClientesPage() {
  const clientes = await listarClientesConPedidos();

  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">Clientes</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-blush text-left text-olive-deep">
            <tr>
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Teléfono</th>
              <th className="px-4 py-2.5 font-medium">Pedidos</th>
              <th className="px-4 py-2.5 font-medium">Total comprado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clientes.map((c) => {
              const totalComprado = c.pedidos
                .filter((p) => p.estado !== "CANCELADO")
                .reduce((acc, p) => acc + p.total, 0);
              return (
                <tr key={c.id}>
                  <td className="px-4 py-2.5">{c.nombre}</td>
                  <td className="px-4 py-2.5">{c.email}</td>
                  <td className="px-4 py-2.5">{c.telefono || "—"}</td>
                  <td className="px-4 py-2.5">{c.pedidos.length}</td>
                  <td className="px-4 py-2.5">
                    {formatearPrecio(totalComprado)}
                  </td>
                </tr>
              );
            })}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/60">
                  Todavía no hay clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
