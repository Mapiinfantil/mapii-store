# Mapii Infantil — tienda online

Next.js + Tailwind. Base de datos SQLite con `@libsql/client` (sin motor
externo que instalar). Alojado en Railway.

## Estructura

```
app/(tienda)/       páginas públicas: inicio, tutos, mantas, producto, nosotras, carrito, checkout
app/admin/login/    login del panel (fuera del área protegida)
app/admin/(panel)/  panel protegido: resumen, productos, pedidos, clientes, usuarios
app/api/            endpoints: checkout, admin, subida de fotos, webhook de Mercado Pago
components/         Nav, Footer, tarjeta de producto, carrito (contexto)
lib/                acceso a datos (productos, clientes, pedidos, visitas, usuarios admin), auth, Mercado Pago
scripts/seed.ts     carga productos de ejemplo
```

## Primeros pasos (en tu computador)

1. Instala Node.js 20 o superior.
2. Descomprime este zip y entra a la carpeta.
3. `npm install`
4. Copia `.env.example` a `.env` y cambia `ADMIN_PASSWORD` y `SESSION_SECRET`
   por claves propias (cualquier texto largo).
5. `npm run seed` — carga 6 productos de ejemplo (3 tutos, 3 mantas).
6. `npm run dev` y abre `http://localhost:3000`.
7. Panel de administración: `http://localhost:3000/admin/login` — la primera
   vez pide crear la cuenta usando `ADMIN_PASSWORD` como clave maestra.

## Desplegar en producción (Railway)

**1. Subir el código a GitHub** (repo `Mapiinfantil/mapii-store`).

**2. Crear el proyecto en Railway**
- railway.app → New Project → Deploy from GitHub repo → `mapii-store`.

**3. Agregar un disco persistente**
- Clic derecho en el servicio → "Attach volume" → mount path `/data`.
  Ahí viven la base de datos y las fotos subidas, así no se pierden en
  cada actualización.

**4. Variables de entorno** (pestaña Variables del servicio):
  - `ADMIN_PASSWORD` → clave maestra para crear la primera cuenta de admin
  - `SESSION_SECRET` → cualquier texto largo y único
  - `DATABASE_URL` → `file:/data/mapii.db`
  - `UPLOADS_DIR` → `/data/uploads`
  - `NEXT_PUBLIC_SITE_URL` → `https://mapii.cl`
  - `MERCADOPAGO_ACCESS_TOKEN` → se agrega cuando tu prima tenga la cuenta
    (mientras no esté, el checkout deja los pedidos registrados para
    coordinar el pago manualmente)

**5. Deploy.** Railway construye y despliega solo con cada push a GitHub.

**6. Dominio propio**: Settings → Networking → Custom Domain, agrega
mapii.cl y www.mapii.cl. Railway da un registro CNAME para cada uno —
se agregan en el DNS del dominio (Cloudflare, en este caso).

## Notas técnicas (por si algo falla)

- El proyecto usa el modo `output: "standalone"` de Next.js (obligatorio
  en Railway) — el `package.json` copia `public/` y `.next/static` al
  build standalone automáticamente (`postbuild`). Si algún archivo de
  `public/` da 404 en producción, es señal de que ese paso no corrió.
- Las tipografías se cargan con un `<link>` normal en `app/layout.tsx`
  (no con `next/font/google`), porque el entorno de build de Railway no
  siempre tiene salida a internet — con `next/font` el build fallaba.

## Administración del día a día

- `/admin/productos`: crear, editar, ocultar productos, subir fotos
  (o pegar una URL) y ver stock y unidades vendidas.
- `/admin/pedidos`: ver pedidos, datos de envío, y cambiar el estado
  (pendiente / pagado / enviado / entregado / cancelado). Cancelar repone
  el stock automáticamente.
- `/admin/clientes`: listado de clientes con cuánto ha comprado cada uno.
- `/admin/usuarios`: quiénes pueden entrar al panel. La primera cuenta se
  crea con la clave maestra (`ADMIN_PASSWORD`); las demás se agregan desde
  ahí mismo, cada una con su propio email y clave.
- `/admin` (resumen): visitas de los últimos 7 y 30 días, ventas pagadas,
  pedidos pendientes y productos con stock bajo (3 unidades o menos).

## Vista previa al compartir el link

Al mandar el link de la tienda por WhatsApp u otras redes, se muestra el
logo de Mapii Infantil como imagen de portada (`app/opengraph-image.jpg` /
`app/twitter-image.jpg`). Para cambiarla, reemplaza esos dos archivos por
una imagen nueva con el mismo nombre.
