import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  actualizarProducto,
  eliminarProducto,
  ocultarProducto,
  productoTienePedidos,
} from "@/lib/productos";
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const parsed = productoSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  try {
    const producto = await actualizarProducto(id, parsed.data);
    return NextResponse.json({ producto });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar (¿el slug ya existe?)." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await haySesionAdminActiva())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  // No se borra si ya tiene pedidos asociados, para no perder el historial
  // de compras: se oculta (activo = false) en vez de eliminarlo.
  if (await productoTienePedidos(id)) {
    await ocultarProducto(id);
    return NextResponse.json({ ocultado: true });
  }

  await eliminarProducto(id);
  return NextResponse.json({ eliminado: true });
}
