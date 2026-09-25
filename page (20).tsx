export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;

  return (
    <section className="py-20 text-center">
      <h1 className="font-serif text-3xl text-olive-deep">¡Gracias por tu compra!</h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-ink/80">
        Tu pago fue confirmado
        {pedido ? (
          <>
            {" "}para el pedido <span className="font-medium">#{pedido.slice(-6)}</span>
          </>
        ) : (
          ""
        )}
        . Te avisaremos cuando tu pedido esté en camino.
      </p>
    </section>
  );
}
