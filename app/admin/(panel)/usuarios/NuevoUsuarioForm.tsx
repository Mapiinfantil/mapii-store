"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NuevoUsuarioForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, clave }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear el usuario.");
      setGuardando(false);
      return;
    }

    setNombre("");
    setEmail("");
    setClave("");
    setGuardando(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-olive-deep">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          required
        />
      </div>
      <div>
        <label className="text-sm text-olive-deep">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          required
        />
      </div>
      <div>
        <label className="text-sm text-olive-deep">Clave inicial</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          minLength={6}
          className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]"
          required
        />
        <p className="mt-1 text-xs text-olive-deep/60">
          Avísale esta clave por otro medio (WhatsApp, en persona). No hay
          aviso automático por email todavía.
        </p>
      </div>

      {error && <p className="text-sm text-terracotta-deep">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="bg-olive px-6 py-2.5 text-sm text-cream disabled:opacity-60"
      >
        {guardando ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
