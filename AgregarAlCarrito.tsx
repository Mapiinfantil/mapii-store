"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/components/CartProvider";

type Props = {
  productoId: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  slug: string;
  stock: number;
};

export function AgregarAlCarrito({
  productoId,
  nombre,
  precio,
  imagenUrl,
  slug,
  stock,
}: Props) {
  const { agregarItem } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const router = useRouter();

  if (stock === 0) {
    return (
      <div className="inline-block bg-line px-7 py-3.5 text-[15px] text-ink/50">
        Sin stock
      </div>
    );
  }

  function handleAgregar() {
    agregarItem({
      productoId,
      nombre,
      precio,
      imagenUrl,
      slug,
      stockDisponible: stock,
    });
    setAgregado(true);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleAgregar}
        className="bg-olive px-7 py-3.5 text-[15px] text-cream"
      >
        Agregar al carrito
      </button>
      {agregado && (
        <span className="text-sm text-olive-deep">Agregado ✓</span>
      )}
    </div>
  );
}
