import { notFound } from "next/navigation";
import { obtenerProductoPorSlug } from "@/lib/productos";
import { listarImagenesProducto } from "@/lib/producto-imagenes";
import { registrarVisita } from "@/lib/visitas";
import { formatearPrecio, ETIQUETA_CATEGORIA } from "@/lib/formato";
import { AgregarAlCarrito } from "./AgregarAlCarrito";
import { ProductoGaleria } from "./ProductoGaleria";

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto || !producto.activo) notFound();

  const imagenes = await listarImagenesProducto(producto.id);
  await registrarVisita(`/producto/${slug}`);

  return (
    <section className="grid gap-12 py-12 md:grid-cols-2">
      <ProductoGaleria
        imagenes={imagenes.map((img) => img.url)}
        nombre={producto.nombre}
      />
      <div>
        <div className="text-sm text-olive">
          {ETIQUETA_CATEGORIA[producto.categoria]}
        </div>
        <h1 className="mt-2 font-serif text-3xl text-olive-deep">
          {producto.nombre}
        </h1>
        <div className="mt-3 text-xl text-ink">
          {formatearPrecio(producto.precio)}
        </div>
        {producto.descripcion && (
          <p className="mt-5 max-w-[46ch] text-[15px] text-ink/80">
            {producto.descripcion}
          </p>
        )}
        <div className="mt-8">
          <AgregarAlCarrito
            productoId={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagenUrl={producto.imagenUrl}
            slug={producto.slug}
            stock={producto.stock}
          />
        </div>
      </div>
    </section>
  );
}
