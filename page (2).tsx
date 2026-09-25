import { ProductoForm } from "../ProductoForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-olive-deep">Nuevo producto</h1>
      <div className="mt-6">
        <ProductoForm />
      </div>
    </div>
  );
}
