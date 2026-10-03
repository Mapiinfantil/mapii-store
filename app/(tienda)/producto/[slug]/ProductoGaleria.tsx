"use client";

import { useRef, useState } from "react";

export function ProductoGaleria({
  imagenes,
  nombre,
}: {
  imagenes: string[];
  nombre: string;
}) {
  const [indice, setIndice] = useState(0);
  const inicioToqueX = useRef<number | null>(null);

  if (imagenes.length === 0) {
    return (
      <div className="flex h-[380px] items-center justify-center overflow-hidden rounded-2xl bg-blush">
        <span className="text-sm text-terracotta-deep/60">foto</span>
      </div>
    );
  }

  function irA(nuevoIndice: number) {
    setIndice((nuevoIndice + imagenes.length) % imagenes.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    inicioToqueX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (inicioToqueX.current === null) return;
    const delta = e.changedTouches[0].clientX - inicioToqueX.current;
    if (Math.abs(delta) > 40) {
      irA(indice + (delta < 0 ? 1 : -1));
    }
    inicioToqueX.current = null;
  }

  return (
    <div>
      <div
        className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-2xl bg-blush"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenes[indice]}
          alt={`${nombre} — foto ${indice + 1}`}
          className="h-full w-full object-cover"
        />

        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => irA(indice - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-olive-deep shadow"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => irA(indice + 1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-olive-deep shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="mt-3 flex gap-2">
          {imagenes.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === indice ? "ring-terracotta" : "ring-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Miniatura ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
