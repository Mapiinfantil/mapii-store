import Link from "next/link";
import { listarProductos } from "@/lib/productos";
import { formatearPrecio, ETIQUETA_CATEGORIA } from "@/lib/formato";

export default async function AdminProductosPage() {
  const productos = await listarProductos();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-olive-deep">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-olive px-5 py-2.5 text-sm text-cream"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-blush text-left text-olive-deep">
            <tr>
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Categoría</th>
              <th className="px-4 py-2.5 font-medium">Precio</th>
              <th className="px-4 py-2.5 font-medium">Stock</th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2.5">{p.nombre}</td>
                <td className="px-4 py-2.5">{ETIQUETA_CATEGORIA[p.categoria]}</td>
                <td className="px-4 py-2.5">{formatearPrecio(p.precio)}</td>
                <td className="px-4 py-2.5">
                  <span className={p.stock <= 3 ? "text-terracotta-deep" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {p.activo ? "Publicado" : "Oculto"}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="text-olive-deep hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink/60">
                  Todavía no hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
