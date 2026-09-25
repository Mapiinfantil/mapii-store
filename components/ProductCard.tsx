import Link from "next/link";
import { formatearPrecio } from "@/lib/formato";

type Props = {
  slug: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  stock: number;
};

export function ProductCard({ slug, nombre, precio, imagenUrl, stock }: Props) {
  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="mb-3 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-blush">
        {imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagenUrl}
            alt={nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-terracotta-deep/60">foto</span>
        )}
      </div>
      <h4 className="text-[15px] font-medium text-ink">{nombre}</h4>
      <div className="mt-1 text-sm text-olive">{formatearPrecio(precio)}</div>
      {stock === 0 && (
        <div className="mt-1 text-xs text-terracotta-deep">Sin stock</div>
      )}
    </Link>
  );
}
