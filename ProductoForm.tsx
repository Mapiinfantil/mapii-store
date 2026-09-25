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
  imagenUrl: string;
  activo: boolean;
};

const VACIO: ProductoFormValues = {
  nombre: "",
  slug: "",
  descripcion: "",
  categoria: "TUTOS",
  precio: 0,
  stock: 0,
  imagenUrl: "",
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
  const router = useRouter();

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
        <label className="text-sm text-olive-deep">URL de la foto</label>
        <input
          type="text"
          value={form.imagenUrl}
          onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
        />
      </div>

      {error && <p className="text-sm text-terracotta-deep">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={guardando}
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
