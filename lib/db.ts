import { createClient, type Client } from "@libsql/client";

const globalForDb = globalThis as unknown as { dbClient?: Client; dbListo?: Promise<void> };

function crearCliente(): Client {
  if (process.env.TURSO_DATABASE_URL) {
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return createClient({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
}

function obtenerCliente(): Client {
  if (!globalForDb.dbClient) {
    globalForDb.dbClient = crearCliente();
  }
  return globalForDb.dbClient;
}

export const db: Client = new Proxy({} as Client, {
  get(_target, prop, receiver) {
    const cliente = obtenerCliente();
    const valor = Reflect.get(cliente, prop, receiver);
    return typeof valor === "function" ? valor.bind(cliente) : valor;
  },
});

const ESQUEMA = `
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL,
  precio INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT NOT NULL DEFAULT '',
  activo INTEGER NOT NULL DEFAULT 1,
  creado_en TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL DEFAULT '',
  direccion TEXT NOT NULL DEFAULT '',
  creado_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  total INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'PENDIENTE',
  medio_pago TEXT,
  referencia_pago TEXT NOT NULL DEFAULT '',
  creado_en TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items_pedido (
  id TEXT PRIMARY KEY,
  pedido_id TEXT NOT NULL REFERENCES pedidos(id),
  producto_id TEXT NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS visitas (
  id TEXT PRIMARY KEY,
  ruta TEXT NOT NULL,
  creado_en TEXT NOT NULL
);
`;

async function migrar() {
  for (const sentencia of ESQUEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await db.execute(sentencia);
  }
}

export function baseDeDatosLista(): Promise<void> {
  if (!globalForDb.dbListo) {
    globalForDb.dbListo = migrar();
  }
  return globalForDb.dbListo;
}
