"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se pudo iniciar sesión.");
      setEnviando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-8"
      >
        <h1 className="font-serif text-2xl text-olive-deep">Mapii Infantil</h1>
        <p className="mt-1 text-sm text-olive">Panel de administración</p>

        <label className="mt-6 block text-sm text-olive-deep">Clave</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
          autoFocus
        />

        {error && <p className="mt-3 text-sm text-terracotta-deep">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full bg-olive py-3 text-[15px] text-cream disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
