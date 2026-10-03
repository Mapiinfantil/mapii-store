import { listarAdminUsuarios } from "@/lib/admin-usuarios";
import { NuevoUsuarioForm } from "./NuevoUsuarioForm";

export default async function AdminUsuariosPage() {
  const usuarios = await listarAdminUsuarios();

  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">Usuarios</h1>
      <p className="mt-1 text-sm text-olive-deep/70">
        Quienes pueden entrar al panel de administración.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-blush text-left text-olive-deep">
            <tr>
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2.5">{u.nombre}</td>
                <td className="px-4 py-2.5">{u.email}</td>
                <td className="px-4 py-2.5">
                  {new Date(u.creadoEn).toLocaleDateString("es-CL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="text-[15px] font-medium text-olive-deep">
          Agregar un usuario
        </h2>
        <div className="mt-4">
          <NuevoUsuarioForm />
        </div>
      </div>
    </div>
  );
}
