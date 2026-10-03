import { CartProvider } from "@/components/CartProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="mx-auto w-full max-w-[1100px] flex-1 px-8">
        <Nav />
        <main>{children}</main>
      </div>
      <div className="mx-auto w-full max-w-[1100px] px-8">
        <Footer />
      </div>
    </CartProvider>
  );
}
