export type Categoria = "TUTOS" | "MANTAS";
export type EstadoPedido =
  | "PENDIENTE"
  | "PAGADO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";
export type MedioPago = "MERCADO_PAGO" | "WEBPAY";

export type AdminUsuario = {
  id: string;
  nombre: string;
  email: string;
  creadoEn: string;
};

export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
};

export type ItemPedido = {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  producto: Producto;
};

export type Pedido = {
  id: string;
  clienteId: string;
  total: number;
  estado: EstadoPedido;
  medioPago: MedioPago | null;
  referenciaPago: string;
  creadoEn: string;
  actualizadoEn: string;
  cliente: Cliente;
  items: ItemPedido[];
};
