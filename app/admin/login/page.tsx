import { contarAdminUsuarios } from "@/lib/admin-usuarios";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const totalUsuarios = await contarAdminUsuarios();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <LoginForm esConfiguracionInicial={totalUsuarios === 0} />
    </div>
  );
}
