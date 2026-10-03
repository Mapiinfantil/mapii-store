"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProductoFormValues = {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: "TUTOS" | "MANTAS";
  precio: number;
  stock: number;
  imagenes: string[]; // en el orden en que se deben mostrar
  activo: boolean;
};

const VACIO: ProductoFormValues = {
  nombre: "",
  slug: "",
  descripcion: "",
  categoria: "TUTOS",
  precio: 0,
  stock: 0,
  imagenes: [],
  activo: true,
};

function slugificar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductoForm({
  productoId,
  valoresIniciales,
}: {
  productoId?: string;
  valoresIniciales?: ProductoFormValues;
}) {
  const [form, setForm] = useState<ProductoFormValues>(
    valoresIniciales ?? VACIO
  );
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(
    Boolean(valoresIniciales)
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const router = useRouter();

  async function handleArchivoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendoImagen(true);
    setError("");

    const formData = new FormData();
    formData.append("file", archivo);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo subir la imagen.");
      setSubiendoImagen(false);
      return;
    }

    setForm((f) => ({ ...f, imagenes: [...f.imagenes, data.url] }));
    setSubiendoImagen(false);
    e.target.value = "";
  }

  function moverImagen(indice: number, direccion: -1 | 1) {
    setForm((f) => {
      const destino = indice + direccion;
      if (destino < 0 || destino >= f.imagenes.length) return f;
      const imagenes = [...f.imagenes];
      [imagenes[indice], imagenes[destino]] = [imagenes[destino], imagenes[indice]];
      return { ...f, imagenes };
    });
  }

  function quitarImagen(indice: number) {
    setForm((f) => ({
      ...f,
      imagenes: f.imagenes.filter((_, i) => i !== indice),
    }));
  }

  function handleNombreChange(nombre: string) {
    setForm((f) => ({
      ...f,
      nombre,
      slug: slugEditadoManualmente ? f.slug : slugificar(nombre),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const url = productoId
      ? `/api/admin/productos/${productoId}`
      : "/api/admin/productos";
    const method = productoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar.");
      setGuardando(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  async function handleEliminar() {
    if (!productoId) return;
    if (!confirm(`¿Eliminar "${form.nombre}"?`)) return;

    const res = await fetch(`/api/admin/productos/${productoId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="text-sm text-olive-deep">Nombre</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => handleNombreChange(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          required
        />
      </div>

      <div>
        <label className="text-sm text-olive-deep">
          Slug (parte de la URL)
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugEditadoManualmente(true);
            setForm({ ...form, slug: e.target.value });
          }}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          required
        />
      </div>

      <div>
        <label className="text-sm text-olive-deep">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          rows={3}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-olive-deep">Categoría</label>
          <select
            value={form.categoria}
            onChange={(e) =>
              setForm({
                ...form,
                categoria: e.target.value as "TUTOS" | "MANTAS",
              })
            }
            className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          >
            <option value="TUTOS">Tutos</option>
            <option value="MANTAS">Mantas</option>
          </select>
        </div>
        <div className="flex items-end gap-2 pb-2.5">
          <input
            id="activo"
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          <label htmlFor="activo" className="text-sm text-olive-deep">
            Publicado en la tienda
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-olive-deep">Precio (CLP)</label>
          <input
            type="number"
            min={0}
            value={form.precio}
            onChange={(e) =>
              setForm({ ...form, precio: Number(e.target.value) })
            }
            className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
            required
          />
        </div>
        <div>
          <label className="text-sm text-olive-deep">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-olive-deep">Fotos</label>
        <p className="mt-1 text-xs text-olive-deep/60">
          La primera es la que se ve en el catálogo. Usa las flechas para
          cambiar el orden.
        </p>

        {form.imagenes.length > 0 && (
          <div className="mt-3 space-y-2">
            {form.imagenes.map((url, i) => (
              <div
                key={url + i}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-2"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-blush">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="flex-1 text-sm text-ink/70">
                  {i === 0 ? "Portada" : `Foto ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moverImagen(i, -1)}
                    disabled={i === 0}
                    className="rounded px-2 py-1 text-sm text-olive-deep hover:bg-blush disabled:opacity-30"
                    aria-label="Mover antes"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moverImagen(i, 1)}
                    disabled={i === form.imagenes.length - 1}
                    className="rounded px-2 py-1 text-sm text-olive-deep hover:bg-blush disabled:opacity-30"
                    aria-label="Mover después"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarImagen(i)}
                    className="rounded px-2 py-1 text-sm text-terracotta-deep hover:bg-blush"
                    aria-label="Quitar"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleArchivoChange}
            disabled={subiendoImagen}
            className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-olive file:px-4 file:py-2 file:text-sm file:text-cream"
          />
          {subiendoImagen && (
            <p className="mt-1.5 text-sm text-olive-deep/70">Subiendo...</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-terracotta-deep">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={guardando || subiendoImagen}
          className="bg-olive px-6 py-2.5 text-sm text-cream disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        {productoId && (
          <button
            type="button"
            onClick={handleEliminar}
            className="text-sm text-terracotta-deep hover:underline"
          >
            Eliminar producto
          </button>
        )}
      </div>
    </form>
  );
}
