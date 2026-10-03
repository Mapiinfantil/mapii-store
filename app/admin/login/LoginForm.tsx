"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ esConfiguracionInicial }: { esConfiguracionInicial: boolean }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [claveMaestra, setClaveMaestra] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const body = esConfiguracionInicial
      ? { nombre, email, clave, claveMaestra }
      : { email, clave };

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-line bg-white p-8"
    >
      <h1 className="font-serif text-2xl text-olive-deep">Mapii Infantil</h1>
      <p className="mt-1 text-sm text-olive">
        {esConfiguracionInicial
          ? "Crea la primera cuenta de administrador"
          : "Panel de administración"}
      </p>

      {esConfiguracionInicial && (
        <>
          <label className="mt-6 block text-sm text-olive-deep">Tu nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            required
          />
        </>
      )}

      <label className={`${esConfiguracionInicial ? "mt-4" : "mt-6"} block text-sm text-olive-deep`}>
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
        autoFocus={!esConfiguracionInicial}
        required
      />

      <label className="mt-4 block text-sm text-olive-deep">
        {esConfiguracionInicial ? "Elige una clave" : "Clave"}
      </label>
      <input
        type="password"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
        required
      />

      {esConfiguracionInicial && (
        <>
          <label className="mt-4 block text-sm text-olive-deep">Clave maestra</label>
          <input
            type="password"
            value={claveMaestra}
            onChange={(e) => setClaveMaestra(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-[15px]"
            required
          />
          <p className="mt-1.5 text-xs text-olive-deep/60">
            La clave ADMIN_PASSWORD configurada en el hosting. Solo se pide esta
            primera vez.
          </p>
        </>
      )}

      {error && <p className="mt-3 text-sm text-terracotta-deep">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 w-full bg-olive py-3 text-[15px] text-cream disabled:opacity-60"
      >
        {enviando ? "Entrando..." : esConfiguracionInicial ? "Crear cuenta y entrar" : "Entrar"}
      </button>
    </form>
  );
}
