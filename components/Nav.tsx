"use client";

import Link from "next/link";
import { useCarrito } from "@/components/CartProvider";

export function Nav() {
  const { totalItems } = useCarrito();

  return (
    <nav className="flex items-center justify-between py-7">
      <Link href="/" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Mapii Infantil" className="h-10 w-auto" />
      </Link>
      <ul className="hidden gap-9 text-[15px] text-ink md:flex">
        <li>
          <Link href="/" className="border-b border-transparent pb-[2px] hover:border-terracotta">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/tutos" className="border-b border-transparent pb-[2px] hover:border-terracotta">
            Tutos
          </Link>
        </li>
        <li>
          <Link href="/mantas" className="border-b border-transparent pb-[2px] hover:border-terracotta">
            Mantas
          </Link>
        </li>
        <li>
          <Link href="/nosotras" className="border-b border-transparent pb-[2px] hover:border-terracotta">
            Nosotras
          </Link>
        </li>
      </ul>
      <Link href="/carrito" className="flex items-center gap-2 text-[15px]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[12px] text-cream">
          {totalItems}
        </span>
        Carrito
      </Link>
    </nav>
  );
}
