"use client";

import Link from "next/link";
import { useCarrito } from "@/components/CartProvider";
import { formatearPrecio } from "@/lib/formato";

export default function CarritoPage() {
  const { items, quitarItem, cambiarCantidad, totalPesos } = useCarrito();

  if (items.length === 0) {
    return (
      <section className="py-16">
        <h1 className="font-serif text-3xl text-olive-deep">Tu carrito está vacío</h1>
        <Link
          href="/tutos"
          className="mt-6 inline-block bg-olive px-7 py-3.5 text-[15px] text-cream"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h1 className="font-serif text-3xl text-olive-deep">Tu carrito</h1>

      <div className="mt-8 divide-y divide-line">
        {items.map((item) => (
          <div
            key={item.productoId}
            className="flex items-center gap-5 py-5"
          >
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blush">
              {item.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-terracotta-deep/60">foto</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-medium text-ink">{item.nombre}</div>
              <div className="mt-1 text-sm text-olive">
                {formatearPrecio(item.precio)}
              </div>
            </div>
            <input
              type="number"
              min={1}
              max={item.stockDisponible}
              value={item.cantidad}
              onChange={(e) =>
                cambiarCantidad(item.productoId, Number(e.target.value))
              }
              className="w-16 rounded-md border border-line bg-cream px-2 py-1.5 text-center text-sm"
            />
            <div className="w-24 text-right text-[15px] text-ink">
              {formatearPrecio(item.precio * item.cantidad)}
            </div>
            <button
              onClick={() => quitarItem(item.productoId)}
              className="text-sm text-terracotta-deep hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <span className="text-[17px] text-ink">Total</span>
        <span className="font-serif text-2xl text-olive-deep">
          {formatearPrecio(totalPesos)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-8 inline-block bg-olive px-7 py-3.5 text-[15px] text-cream"
      >
        Ir a pagar
      </Link>
    </section>
  );
}
