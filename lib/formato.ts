export function formatearPrecio(pesos: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(pesos);
}

export const ETIQUETA_CATEGORIA: Record<string, string> = {
  TUTOS: "Tutos",
  MANTAS: "Mantas",
};
