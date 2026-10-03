import { notFound } from "next/navigation";
import { obtenerProductoPorId } from "@/lib/productos";
import { listarImagenesProducto } from "@/lib/producto-imagenes";
import { ProductoForm } from "../ProductoForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [producto, imagenes] = await Promise.all([
    obtenerProductoPorId(id),
    listarImagenesProducto(id),
  ]);
  if (!producto) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">
        Editar producto
      </h1>
      <div className="mt-6">
        <ProductoForm
          productoId={producto.id}
          valoresIniciales={{
            nombre: producto.nombre,
            slug: producto.slug,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            precio: producto.precio,
            stock: producto.stock,
            imagenes: imagenes.map((img) => img.url),
            activo: producto.activo,
          }}
        />
      </div>
    </div>
  );
}
