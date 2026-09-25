import { crearProducto, obtenerProductoPorSlug } from "@/lib/productos";

const productos = [
  {
    nombre: "Tuto de algodón orgánico",
    slug: "tuto-algodon-organico",
    descripcion: "Tuto suave de algodón 100% orgánico, ideal para las primeras semanas.",
    categoria: "TUTOS" as const,
    precio: 12990,
    stock: 14,
    imagenUrl: "",
    activo: true,
  },
  {
    nombre: "Tuto estampado animalitos",
    slug: "tuto-estampado-animalitos",
    descripcion: "Tuto liviano con estampado de animalitos, perfecto para el día a día.",
    categoria: "TUTOS" as const,
    precio: 10990,
    stock: 20,
    imagenUrl: "",
    activo: true,
  },
  {
    nombre: "Set de 2 tutos lisos",
    slug: "set-2-tutos-lisos",
    descripcion: "Dos tutos en tonos neutros, combinables entre sí.",
    categoria: "TUTOS" as const,
    precio: 18990,
    stock: 8,
    imagenUrl: "",
    activo: true,
  },
  {
    nombre: "Manta de algodón orgánico",
    slug: "manta-algodon-organico",
    descripcion: "Manta suave y transpirable, ideal para el coche o la cuna.",
    categoria: "MANTAS" as const,
    precio: 18990,
    stock: 10,
    imagenUrl: "",
    activo: true,
  },
  {
    nombre: "Manta muselina doble capa",
    slug: "manta-muselina-doble-capa",
    descripcion: "Muselina de doble capa, liviana y de secado rápido.",
    categoria: "MANTAS" as const,
    precio: 15990,
    stock: 16,
    imagenUrl: "",
    activo: true,
  },
  {
    nombre: "Manta térmica de invierno",
    slug: "manta-termica-invierno",
    descripcion: "Manta más abrigada para los meses fríos, borde reforzado.",
    categoria: "MANTAS" as const,
    precio: 21990,
    stock: 2,
    imagenUrl: "",
    activo: true,
  },
];

async function main() {
  let creados = 0;
  for (const producto of productos) {
    const existente = await obtenerProductoPorSlug(producto.slug);
    if (existente) continue;
    await crearProducto(producto);
    creados++;
  }
  console.log(`Cargados ${creados} productos de ejemplo (${productos.length - creados} ya existían).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
