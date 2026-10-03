"use client";

import { useRouter } from "next/navigation";

export function CerrarSesionBoton() {
  const router = useRouter();

  async function handleClick() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="text-sm text-terracotta-deep hover:underline"
    >
      Cerrar sesión
    </button>
  );
}
