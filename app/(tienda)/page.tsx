import Link from "next/link";
import { listarProductos } from "@/lib/productos";
import { registrarVisita } from "@/lib/visitas";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  await registrarVisita("/");

  const recientes = await listarProductos({ soloActivos: true, limite: 3 });

  return (
    <>
      <section className="grid items-center gap-16 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <h1 className="max-w-[11ch] font-serif text-4xl leading-[1.08] text-olive-deep md:text-5xl">
            Pequeños momentos, grandes descubrimientos
          </h1>
          <p className="mt-5 max-w-[38ch] text-[17px] text-olive-deep/85">
            Tutos y mantas pensados para acompañar a los niños en cada etapa
            de su crecimiento.
          </p>
          <Link
            href="/tutos"
            className="mt-8 inline-block bg-olive px-7 py-3.5 text-[15px] text-cream"
          >
            Ver productos
          </Link>
        </div>
        <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-[180px_40px_180px_40px] bg-blush md:h-[420px]">
          <span className="font-serif text-lg text-terracotta-deep/50">
            foto de producto
          </span>
          <div className="absolute bottom-7 left-7 rounded-full bg-cream px-4 py-2.5 text-sm">
            Hecho en Chile
          </div>
        </div>
      </section>

      <section className="border-t border-line py-12">
        <div className="mb-9 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-olive-deep md:text-3xl">
            Categorías
          </h2>
          <span className="text-sm text-olive">2 líneas de producto</span>
        </div>
        <div className="grid gap-7 md:grid-cols-2">
          <Link
            href="/tutos"
            className="flex h-52 flex-col justify-end rounded-3xl border border-line bg-[linear-gradient(0deg,rgba(189,122,84,0.16),rgba(189,122,84,0.16))] p-6 md:h-[300px]"
          >
            <h3 className="font-serif text-2xl text-olive-deep">Tutos</h3>
            <p className="mt-1.5 text-sm text-ink/75">Explorar la colección</p>
          </Link>
          <Link
            href="/mantas"
            className="flex h-52 flex-col justify-end rounded-3xl border border-line bg-[linear-gradient(0deg,rgba(111,108,78,0.14),rgba(111,108,78,0.14))] p-6 md:h-[300px]"
          >
            <h3 className="font-serif text-2xl text-olive-deep">Mantas</h3>
            <p className="mt-1.5 text-sm text-ink/75">Explorar la colección</p>
          </Link>
        </div>
      </section>

      {recientes.length > 0 && (
        <section className="py-12">
          <h2 className="font-serif text-2xl text-olive-deep md:text-3xl">
            Recién llegados
          </h2>
          <div className="mt-9 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
            {recientes.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                nombre={p.nombre}
                precio={p.precio}
                imagenUrl={p.imagenUrl}
                stock={p.stock}
              />
            ))}
          </div>
        </section>
      )}

      <section className="my-4 rounded-[32px] bg-olive-deep px-8 py-16 text-cream md:my-6 md:px-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <div className="font-script text-2xl text-[#e3b692]">
              nuestra historia
            </div>
            <h2 className="mt-1.5 font-serif text-3xl text-cream md:text-[34px]">
              Nosotras
            </h2>
          </div>
          <p className="max-w-[42ch] text-[16px] text-cream/90">
            Mapii nace desde nuestra propia experiencia como mamás: productos
            donde calidad, funcionalidad y diseño convivan, pensados para
            durar y acompañar a los niños en cada etapa de su crecimiento.
          </p>
        </div>
        <Link
          href="/nosotras"
          className="mt-8 inline-block border-b border-cream/60 pb-1 text-sm text-cream"
        >
          Conocer más
        </Link>
      </section>
    </>
  );
}
