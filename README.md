# Mapii Infantil — tienda online

Next.js + Tailwind. Base de datos SQLite (local) / Turso (producción) con
`@libsql/client` — sin motor externo que descargar, funciona en cualquier
lado.

## Estructura

```
app/(tienda)/     páginas públicas: inicio, tutos, mantas, producto, nosotras, carrito, checkout
app/admin/login/  login del panel (fuera del área protegida)
app/admin/(panel)/ panel protegido: resumen, productos, pedidos, clientes
app/api/          endpoints: checkout, admin, webhook de Mercado Pago
components/       Nav, Footer, tarjeta de producto, carrito (contexto)
lib/              acceso a datos (productos, clientes, pedidos, visitas), auth, Mercado Pago
scripts/seed.ts   carga productos de ejemplo
```

## Primeros pasos (en tu computador)

1. Instala Node.js 20 o superior.
2. Descomprime este zip y entra a la carpeta.
3. `npm install`
4. Copia `.env.example` a `.env` y cambia `ADMIN_PASSWORD` y `SESSION_SECRET`
   por claves propias (cualquier texto largo).
5. `npm run seed` — carga 6 productos de ejemplo (3 tutos, 3 mantas) para
   que puedas ver la tienda funcionando. Bórralos desde `/admin/productos`
   cuando tengan los productos reales.
6. `npm run dev` y abre `http://localhost:3000`.
7. Panel de administración: `http://localhost:3000/admin/login`, con la
   clave que pusiste en `ADMIN_PASSWORD`.

## Desplegar en producción (Vercel + dominio mapii.cl)

**1. Subir el código a GitHub**
Crea un repositorio (puede ser privado) y sube esta carpeta.

**2. Base de datos: Turso**
SQLite normal no sirve en Vercel porque el disco se reinicia en cada
despliegue. Turso es SQLite alojado en la nube, gratis para este tamaño de
tienda, y usa el mismo código sin cambios:
- Crea una cuenta en https://turso.tech
- Crea una base de datos nueva
- Copia la "Database URL" (empieza con `libsql://...`) y crea un "Auth
  Token"

**3. Crear el proyecto en Vercel**
- Conecta el repositorio de GitHub en https://vercel.com
- En "Environment Variables" agrega:
  - `TURSO_DATABASE_URL` → la URL de Turso
  - `TURSO_AUTH_TOKEN` → el token de Turso
  - `ADMIN_PASSWORD` → la clave del panel (una nueva, para producción)
  - `SESSION_SECRET` → otro texto largo y único
  - `NEXT_PUBLIC_SITE_URL` → `https://mapii.cl` (o el dominio que uses)
  - `MERCADOPAGO_ACCESS_TOKEN` → lo agregan cuando tu prima tenga la cuenta
    (ver abajo). Mientras no esté, el checkout deja los pedidos registrados
    para coordinar el pago manualmente.
- Deploy.
- Corre el seed contra la base de producción una sola vez (opcional, o
  cargan los productos reales directo desde `/admin/productos`):
  `TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run seed`

**4. Conectar el dominio mapii.cl (registrado en NIC Chile)**
- En Vercel: Project → Settings → Domains → agrega `mapii.cl`
- Vercel te muestra un registro DNS (tipo A o CNAME) para configurar
- Entra a NIC Chile → tu dominio → configuración DNS → agrega ese registro
- Puede tardar unas horas en propagarse

## Conectar Mercado Pago (cuando la cuenta esté lista)

1. Tu prima entra a https://www.mercadopago.cl/developers/panel con su
   cuenta de vendedora.
2. Crea una aplicación → copia el **Access Token de producción**.
3. Lo agregas como variable de entorno `MERCADOPAGO_ACCESS_TOKEN` en
   Vercel y vuelves a desplegar.
4. Desde ese momento, el checkout genera automáticamente el link de pago
   real de Mercado Pago.

Webpay (Transbank) queda pendiente hasta que la afiliación de comercio se
apruebe — cuando la tengan, se agrega como una segunda opción de pago en
el checkout.

## Administración del día a día

- `/admin/productos`: crear, editar, ocultar productos y ver stock.
- `/admin/pedidos`: ver pedidos, datos de envío, y cambiar el estado
  (pendiente / pagado / enviado / entregado / cancelado). Cancelar repone
  el stock automáticamente.
- `/admin/clientes`: listado de clientes con cuánto ha comprado cada uno.
- `/admin` (resumen): visitas de los últimos 7 y 30 días, ventas pagadas,
  pedidos pendientes y productos con stock bajo (3 unidades o menos).
