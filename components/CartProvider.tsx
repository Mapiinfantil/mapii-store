"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ItemCarrito = {
  productoId: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  slug: string;
  cantidad: number;
  stockDisponible: number;
};

type CarritoContextType = {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitarItem: (productoId: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPesos: number;
};

const CarritoContext = createContext<CarritoContextType | null>(null);

const STORAGE_KEY = "mapii_carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // localStorage no disponible o dato corrupto: seguimos con carrito vacío.
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, cargado]);

  function agregarItem(item: Omit<ItemCarrito, "cantidad">, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.productoId === item.productoId);
      if (existente) {
        const nuevaCantidad = Math.min(
          existente.cantidad + cantidad,
          item.stockDisponible
        );
        return prev.map((i) =>
          i.productoId === item.productoId ? { ...i, cantidad: nuevaCantidad } : i
        );
      }
      return [...prev, { ...item, cantidad: Math.min(cantidad, item.stockDisponible) }];
    });
  }

  function quitarItem(productoId: string) {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  }

  function cambiarCantidad(productoId: string, cantidad: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productoId === productoId
            ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stockDisponible)) }
            : i
        )
        .filter((i) => i.cantidad > 0)
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  );
  const totalPesos = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad * i.precio, 0),
    [items]
  );

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        quitarItem,
        cambiarCantidad,
        vaciarCarrito,
        totalItems,
        totalPesos,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CartProvider>");
  return ctx;
}
