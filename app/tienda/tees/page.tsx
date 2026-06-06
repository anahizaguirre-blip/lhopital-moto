import { createSupabaseServer } from '@/lib/supabase/server'
import TiendaTees from '@/app/components/tees/tienda/TiendaTees'

export const metadata = {
  title: 'Tees | Tienda Lhopital',
  description: 'Seis piezas. Todas en Negro. Hecho en Mexico.',
}

export const revalidate = 60

interface TeeVariante {
  sku_variante: string
  sku_padre: string
  diseno: string
  color: string
  talla: string
  precio_mxn: number
  stock: number
  estado: string
  foto_back: string | null
  foto_front: string | null
  foto_lifestyle: string | null
}

export interface TeeProducto {
  sku_padre: string
  diseno: string
  precio_mxn: number
  foto_back: string | null
  foto_front: string | null
  foto_lifestyle: string | null
  variantes: {
    sku_variante: string
    talla: string
    stock: number
    estado: string
  }[]
}

export default async function TiendaTeesPage() {
  const supabase = createSupabaseServer()

  const { data, error } = await supabase
    .from('tees')
    .select(
      'sku_variante, sku_padre, diseno, color, talla, precio_mxn, stock, estado, foto_back, foto_front, foto_lifestyle'
    )
    .order('sku_padre', { ascending: true })
    .order('talla', { ascending: true })

  if (error) {
    console.error('Error fetching tees:', error)
    return <div>Error cargando productos.</div>
  }

  const variantes: TeeVariante[] = data ?? []

  // Agrupar variantes por sku_padre
  const productosMap = new Map<string, TeeProducto>()

  for (const v of variantes) {
    if (!productosMap.has(v.sku_padre)) {
      productosMap.set(v.sku_padre, {
        sku_padre: v.sku_padre,
        diseno: v.diseno,
        precio_mxn: v.precio_mxn,
        foto_back: v.foto_back,
        foto_front: v.foto_front,
        foto_lifestyle: v.foto_lifestyle,
        variantes: [],
      })
    }
    productosMap.get(v.sku_padre)!.variantes.push({
      sku_variante: v.sku_variante,
      talla: v.talla,
      stock: v.stock,
      estado: v.estado,
    })
  }

  const productos = Array.from(productosMap.values())

  return <TiendaTees productos={productos} />
}
