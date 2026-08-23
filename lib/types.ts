/**
 * Tipos TypeScript para las entidades de Supabase.
 * Mantiene el código con auto-completado y type-safety.
 */

export type Marca = 'hedon' | 'moto_ii' | 'tees' | 'lhopital';

export type EstadoProducto =
  | 'disponible'
  | 'bajo_pedido'
  | 'en_camino'
  | 'agotado'
  | 'descontinuado';

export type TipoColeccion =
  | 'coleccion_2026_arte_proteccion'
  | 'coleccion_2026_psilo_debut'
  | 'coleccion_lejano_oeste'
  | 'clasico_permanente'
  | 'sin_coleccion';

export type CategoriaProducto =
  | 'estrella'
  | 'add_on_dual'
  | 'add_on_simple'
  | 'rescate_transicion'
  | 'informativo';

export interface Collection {
  id: string;
  nombre: string;
  año: string | null;
  modelos_aplicables: string[];
  etiqueta_visible: string;
  descripcion_storytelling: string | null;
  activa: boolean;
  destacada: boolean;
  orden_display: number;
}

export interface Product {
  id: string;
  sku_padre: string;
  slug: string;
  nombre: string;
  marca: Marca;
  familia: string | null;
  color: string | null;
  categoria: CategoriaProducto;
  coleccion_id: string | null;
  precio_base: number;
  moneda: string;
  frase_corta: string | null;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  storytelling: string | null;
  certificacion: string | null;
  material: string | null;
  peso_g: number | null;
  garantia_meses: number;
  imagen_principal: string | null;
  imagenes: string[];
  foto_interior: string | null; 
  visible_publico: boolean;
  destacado_home: boolean;
  fecha_lanzamiento: string | null;
  created_at: string;
  updated_at: string;
  // Relaciones (cuando se hacen joins)
  collection?: Collection;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku_variante: string;
  talla: string | null;
  color_variante: string | null;
  acabado_tornillo: string | null;
  precio: number | null;
  precio_promocional: number | null;
  estado: EstadoProducto;
  visible_publico: boolean;
  stock_actual: number;
  stock_minimo_alerta: number;
  stock_reservado: number;
  codigo_barras: string | null;
}

export interface CrossSell {
  id: string;
  product_id: string;
  suggested_product_id: string;
  tipo: string;
  mensaje: string;
  prioridad: number;
  activo: boolean;
  // Cuando se hace join con products
  suggested_product?: Product;
}
export interface HedonCrossSellAccesorio {
  id: string;
  sku_padre: string;
  nombre: string;
  slug: string;
  precio_base: number;
  familia: string | null;
}

export interface HedonCrossSell {
  id: number;
  sku_casco: string;
  sku_accesorio: string;
  mensaje: string | null;
  tiene_foto: boolean;
  fotos: string[] | null;
  orden: number;
  accesorio?: HedonCrossSellAccesorio;
}