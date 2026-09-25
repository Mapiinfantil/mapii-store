export default async function PedidoPendientePage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;

  return (
    <section className="py-20 text-center">
      <h1 className="font-serif text-3xl text-olive-deep">
        ¡Recibimos tu pedido!
      </h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-ink/80">
        Tu pedido {pedido ? <span className="font-medium">#{pedido.slice(-6)}</span> : ""}{" "}
        quedó registrado. El pago en línea todavía no está activo, así que te
        contactaremos para coordinar cómo pagar.
      </p>
    </section>
  );
}
