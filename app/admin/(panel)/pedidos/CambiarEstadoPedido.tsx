"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

export function CambiarEstadoPedido({
  pedidoId,
  estadoActual,
}: {
  pedidoId: string;
  estadoActual: string;
}) {
  const [estado, setEstado] = useState(estadoActual);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  async function handleChange(nuevoEstado: string) {
    setEstado(nuevoEstado);
    setGuardando(true);
    await fetch(`/api/pedidos/${pedidoId}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    setGuardando(false);
    router.refresh();
  }

  return (
    <select
      value={estado}
      disabled={guardando}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm"
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}
