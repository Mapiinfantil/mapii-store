"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/components/CartProvider";
import { formatearPrecio } from "@/lib/formato";

export default function CheckoutPage() {
  const { items, totalPesos, vaciarCarrito } = useCarrito();
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <section className="py-16">
        <h1 className="font-serif text-3xl text-olive-deep">
          No hay nada que pagar
        </h1>
        <p className="mt-3 text-ink/75">Tu carrito está vacío.</p>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.email || !form.direccion) {
      setError("Completa nombre, email y dirección.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente: form, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos procesar el pedido.");
        setEnviando(false);
        return;
      }

      if (data.urlPago) {
        vaciarCarrito();
        window.location.href = data.urlPago;
      } else {
        vaciarCarrito();
        router.push(`/checkout/pendiente?pedido=${data.pedidoId}`);
      }
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <section className="grid gap-14 py-12 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-serif text-3xl text-olive-deep">Tus datos</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-olive-deep">Nombre completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            />
          </div>
          <div>
            <label className="text-sm text-olive-deep">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            />
          </div>
          <div>
            <label className="text-sm text-olive-deep">Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            />
          </div>
          <div>
            <label className="text-sm text-olive-deep">Dirección de envío</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            />
          </div>

          {error && <p className="text-sm text-terracotta-deep">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 bg-olive px-7 py-3.5 text-[15px] text-cream disabled:opacity-60"
          >
            {enviando ? "Procesando..." : "Continuar al pago"}
          </button>
        </form>
      </div>

      <div className="h-fit rounded-2xl bg-blush p-6">
        <h2 className="font-serif text-xl text-olive-deep">Resumen</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productoId} className="flex justify-between text-sm">
              <span>
                {item.nombre} × {item.cantidad}
              </span>
              <span>{formatearPrecio(item.precio * item.cantidad)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-terracotta/20 pt-4 text-[17px] text-olive-deep">
          <span>Total</span>
          <span>{formatearPrecio(totalPesos)}</span>
        </div>
      </div>
    </section>
  );
}
