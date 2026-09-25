import { redirect } from "next/navigation";
import Link from "next/link";
import { obtenerSesionAdmin } from "@/lib/auth";
import { CerrarSesionBoton } from "./CerrarSesionBoton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await obtenerSesionAdmin();
  if (!sesion) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="w-60 flex-shrink-0 border-r border-line px-6 py-8">
        <div className="font-serif text-xl text-olive-deep">Mapii admin</div>
        <div className="mt-1 text-sm text-olive">{sesion.nombre}</div>
        <nav className="mt-8 flex flex-col gap-1 text-[15px] text-ink">
          <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-blush">
            Resumen
          </Link>
          <Link
            href="/admin/productos"
            className="rounded-md px-3 py-2 hover:bg-blush"
          >
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className="rounded-md px-3 py-2 hover:bg-blush"
          >
            Pedidos
          </Link>
          <Link
            href="/admin/clientes"
            className="rounded-md px-3 py-2 hover:bg-blush"
          >
            Clientes
          </Link>
          <Link
            href="/admin/usuarios"
            className="rounded-md px-3 py-2 hover:bg-blush"
          >
            Usuarios
          </Link>
        </nav>
        <div className="mt-10">
          <CerrarSesionBoton />
        </div>
      </aside>
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
