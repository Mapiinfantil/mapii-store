import { listarProductos } from "@/lib/productos";
import { registrarVisita } from "@/lib/visitas";
import { ProductCard } from "@/components/ProductCard";

export default async function MantasPage() {
  await registrarVisita("/mantas");

  const productos = await listarProductos({ soloActivos: true, categoria: "MANTAS" });

  return (
    <section className="py-12">
      <h1 className="font-serif text-3xl text-olive-deep md:text-4xl">Mantas</h1>
      {productos.length === 0 ? (
        <p className="mt-6 text-olive-deep/70">
          Todavía no hay productos publicados en esta categoría.
        </p>
      ) : (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              nombre={p.nombre}
              precio={p.precio}
              imagenUrl={p.imagenUrl}
              stock={p.stock}
            />
          ))}
        </div>
      )}
    </section>
  );
}
