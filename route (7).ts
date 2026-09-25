import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { crearProducto } from "@/lib/productos";
import { haySesionAdminActiva } from "@/lib/auth";

const productoSchema = z.object({
  nombre: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "El slug solo puede tener minúsculas, números y guiones."),
  descripcion: z.string().default(""),
  categoria: z.enum(["TUTOS", "MANTAS"]),
  precio: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  imagenUrl: z.string().default(""),
  activo: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const parsed = productoSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  try {
    const producto = await crearProducto(parsed.data);
    return NextResponse.json({ producto });
  } catch {
    return NextResponse.json(
      { error: "Ya existe un producto con ese slug." },
      { status: 400 }
    );
  }
}
