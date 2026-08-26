/**
 * SYNC CATÁLOGO — Lhopital-moto
 * ============================================================================
 * Sincroniza Catalogo_Master_Lhopital-moto.xlsx (raíz del proyecto) → Supabase.
 *
 * Reemplaza a migrate-from-excel.ts (v4, obsoleto): ese script apuntaba a un
 * archivo viejo en /scripts, usaba nombres de pestaña que ya no existen, y
 * solo insertaba filas (nunca reflejaba lo que se borraba en el Excel).
 *
 * Qué hace esta versión que la anterior no hacía:
 *   - Lee el archivo actual desde la raíz del proyecto.
 *   - Alta/baja real: un producto o variante que desaparece del Excel se
 *     marca visible_publico = false (no se borra, solo se oculta).
 *   - Ventas cruzadas y contenido relacionado se sincronizan por completo
 *     (se borra y se vuelve a insertar lo del Excel), así lo que quitas del
 *     Excel también desaparece del sitio.
 *   - Escribe en `hedon_cross_sell`, la tabla que realmente lee la ficha de
 *     producto Hedon (antes se escribía en `cross_sells`, que la ficha nunca
 *     consulta para Hedon).
 *   - Agrupa accesorios Hedon con acabados de tornillo (Visor Burbuja/
 *     Protector) como variantes de un mismo producto, igual que lo espera
 *     ProductDetailAccesorio.tsx.
 *
 * USO:
 *   npm run sync-catalogo
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import slugify from 'slug';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno. Verifica .env.local');
  process.exit(1);
}

const EXCEL_PATH = path.join(__dirname, '..', 'Catalogo_Master_Lhopital-moto.xlsx');

if (!fs.existsSync(EXCEL_PATH)) {
  console.error(`❌ No se encuentra el archivo: ${EXCEL_PATH}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================================
// HELPERS
// ============================================================================

const makeSlug = (text: string) => slugify(text, { lower: true, replacement: '-' });
const logStep = (msg: string) => console.log(`\n→ ${msg}`);
const logOk = (msg: string) => console.log(`  ✓ ${msg}`);
const logErr = (msg: string, err?: any) => {
  console.error(`  ✗ ${msg}`);
  if (err) console.error(err);
};
const clean = (v: any): any => (v === undefined || v === null || v === '' || v === 'N/A' ? null : v);

// El Excel a veces trae variantes de texto ("descontinuada", "futuro") que no
// existen en el enum estado_producto de Postgres. Se normalizan aquí en vez
// de dejar que la corrida entera falle por una fila.
const ESTADO_MAP: Record<string, string> = {
  disponible: 'disponible',
  bajo_pedido: 'bajo_pedido',
  en_camino: 'en_camino',
  agotado: 'agotado',
  descontinuado: 'descontinuado',
  descontinuada: 'descontinuado',
  futuro: 'en_camino',
};
function normalizarEstado(raw: any): string {
  const v = (raw ?? '').toString().trim().toLowerCase();
  const mapeado = ESTADO_MAP[v];
  if (!mapeado) {
    console.warn(`    ⚠ Estado desconocido "${raw}" — se usará "agotado". Corrige la columna Estado en el Excel.`);
    return 'agotado';
  }
  return mapeado;
}

const MESES_ES: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12',
};
// Convierte "28 mayo 2026" -> "2026-05-28" (formato que espera la columna date).
function parsearFechaEspanol(raw: any): string | null {
  if (!raw) return null;
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  const s = raw.toString().trim().toLowerCase();
  const m = s.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})$/i);
  if (!m) {
    console.warn(`    ⚠ No se pudo interpretar la fecha "${raw}" — se guardará sin fecha.`);
    return null;
  }
  const [, dia, mesNombre, anio] = m;
  const mes = MESES_ES[mesNombre];
  if (!mes) return null;
  return `${anio}-${mes}-${dia.padStart(2, '0')}`;
}

// Todos los SKU reales del catálogo llevan al menos una mayúscula/dígito
// (p.ej. "HED-POL-ECE"). Placeholders como "futuro" o "pendiente" se rechazan
// para no crear productos fantasma con SKU inválido.
function esSkuValido(sku: any): boolean {
  const s = (sku ?? '').toString().trim();
  return s.length > 0 && /[A-Z0-9]/.test(s);
}

interface SyncResult {
  skusPadre: Set<string>;
  variantesPorPadre: Map<string, Set<string>>;
}

// ============================================================================
// LÉEME — confirma qué versión del catálogo se está sincronizando
// ============================================================================
function mostrarLeeme(wb: XLSX.WorkBook) {
  const sheet = wb.Sheets['LÉEME'];
  if (!sheet) return;
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const titulo = rows[0]?.[0];
  const nota = rows[1]?.[0];
  console.log(`Catálogo: ${titulo || '(sin título)'}`);
  if (nota) console.log(`Nota:     ${nota}`);
}

// ============================================================================
// COLECCIONES
// ============================================================================
async function syncColecciones(wb: XLSX.WorkBook) {
  logStep('Sincronizando colecciones');
  const sheet = wb.Sheets['Colecciones'];
  if (!sheet) return logErr('No se encontró pestaña "Colecciones"');

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const colecciones = rows
    .filter((r) => r['ID Colección'])
    .map((r, i) => ({
      id: r['ID Colección'],
      nombre: r['Nombre'],
      año: clean(r['Año']),
      modelos_aplicables: (r['Modelos aplicables'] || '')
        .toString()
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
      etiqueta_visible: r['Etiqueta visible'],
      activa: r['Activa'] === 'Sí',
      destacada: r['Destacada'] === 'Sí',
      orden_display: i + 1,
    }));

  const { error } = await supabase.from('collections').upsert(colecciones, { onConflict: 'id' });
  if (error) logErr('Error en colecciones', error);
  else logOk(`${colecciones.length} colecciones`);
}

// ============================================================================
// HEDON CASCOS
// ============================================================================
async function syncHedonCascos(wb: XLSX.WorkBook): Promise<SyncResult> {
  logStep('Sincronizando Hedon Cascos');
  const sheet = wb.Sheets['Hedon Cascos'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const productosMap = new Map<string, any>();

  for (const row of rows) {
    const skuPadre = row['SKU Padre'];
    if (!skuPadre) continue;

    if (!productosMap.has(skuPadre)) {
      productosMap.set(skuPadre, {
        sku_padre: skuPadre,
        slug: makeSlug(`${row['Familia']} ${row['Color']}`),
        nombre: `${row['Familia']} ${row['Color']}`,
        marca: 'hedon',
        familia: row['Familia'],
        color: row['Color'],
        categoria: 'estrella',
        coleccion_id: clean(row['Tipo Colección']),
        precio_base: parseFloat(row['Precio MXN']) || 0,
        moneda: 'MXN',
        frase_corta: clean(row['Frase corta']),
        certificacion: clean(row['Certificación']) || 'ECE 22.06',
        imagen_principal: clean(row['Foto Cloudinary']),
        foto_interior: clean(row['Foto Interior Cloudinary']),
        numero_fotos_esperadas: 4,
        visible_publico: true,
        destacado_home: row['Familia'] === 'Psilo Explorer',
        variantes: [] as any[],
      });
    }

    productosMap.get(skuPadre)!.variantes.push({
      sku_variante: row['SKU Variante'],
      talla: clean(row['Talla']),
      precio: parseFloat(row['Precio MXN']) || null,
      estado: normalizarEstado(row['Estado']),
      stock_actual: parseInt(row['Stock']) || 0,
      codigo_barras: clean(row['Código de Barras'])?.toString() ?? null,
      visible_publico: true,
    });
  }

  const skusPadre = new Set(productosMap.keys());
  const variantesPorPadre = new Map<string, Set<string>>();

  let creados = 0;
  let variantesCreadas = 0;

  for (const [skuPadre, productoData] of productosMap) {
    const { variantes, ...productoSinVariantes } = productoData;

    const { data: producto, error: errProd } = await supabase
      .from('products')
      .upsert(productoSinVariantes, { onConflict: 'sku_padre' })
      .select()
      .single();

    if (errProd) {
      logErr(`Error producto ${skuPadre}`, errProd);
      continue;
    }
    creados++;
    variantesPorPadre.set(producto.id, new Set(variantes.map((v: any) => v.sku_variante)));

    const variantesConProductId = variantes.map((v: any) => ({ ...v, product_id: producto.id }));
    const { error: errVar } = await supabase
      .from('product_variants')
      .upsert(variantesConProductId, { onConflict: 'sku_variante' });

    if (errVar) logErr(`Error variantes ${skuPadre}`, errVar);
    else variantesCreadas += variantes.length;
  }

  logOk(`${creados} productos · ${variantesCreadas} variantes Hedon cascos`);
  return { skusPadre, variantesPorPadre };
}

// ============================================================================
// HEDON ACCESORIOS
// ============================================================================
const TORNILLO_CNC = (tipo: string) => tipo === 'Tornillo CNC';
const VISERA = (tipo: string) => tipo.startsWith('Visera') || tipo === 'Visor Burbuja' || tipo === 'Visor Protector';
const VISOR = (tipo: string) => tipo === 'Visor';
// Familias donde el frontend (ProductDetailAccesorio.tsx) espera un selector
// de acabado de tornillo con Copper = imagen_principal y Steel/Gunmetal/Brass
// en ese orden dentro de `imagenes`.
const FAMILIAS_CON_ACABADO = ['Visor Burbuja', 'Visor Protector'];

async function syncHedonAccesorios(wb: XLSX.WorkBook): Promise<SyncResult> {
  logStep('Sincronizando Hedon Accesorios');
  const sheet = wb.Sheets['Hedon Accesorios'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const productosMap = new Map<string, any>();

  for (const row of rows) {
    const skuPadre = row['SKU'];
    if (!esSkuValido(skuPadre)) {
      console.warn(`    ⚠ Fila sin SKU real ("${skuPadre}") — ${row['Tipo']} ${row['Modelo/Color']}. Se omite hasta que le asignes un SKU en el Excel.`);
      continue;
    }
    const tipo = row['Tipo'];

    if (!productosMap.has(skuPadre)) {
      const categoria = TORNILLO_CNC(tipo) || VISERA(tipo) || VISOR(tipo) ? 'add_on_dual' : 'add_on_simple';
      productosMap.set(skuPadre, {
        sku_padre: skuPadre,
        slug: makeSlug(`${tipo} ${row['Modelo/Color']}`),
        nombre: `${tipo} ${row['Modelo/Color']}`,
        marca: 'hedon',
        familia: tipo,
        color: row['Modelo/Color'],
        categoria,
        coleccion_id: null,
        precio_base: parseFloat(row['Precio MXN']) || 0,
        moneda: 'MXN',
        numero_fotos_esperadas: 2,
        visible_publico: true,
        compatibleCon: (row['Compatible con']?.toString().split('/').map((s: string) => s.trim()).filter(Boolean)) || [],
        variantes: [] as any[],
      });
    }

    productosMap.get(skuPadre)!.variantes.push({
      sku_variante: row['SKU Variante'] || skuPadre,
      talla: null,
      acabado_tornillo: clean(row['acabado_tornillo']),
      precio: parseFloat(row['Precio MXN']) || 0,
      estado: normalizarEstado(row['Estado']),
      stock_actual: parseInt(row['Stock']) || 0,
      visible_publico: true,
      _foto: clean(row['Foto Cloudinary']),
    });
  }

  const skusPadre = new Set(productosMap.keys());
  const variantesPorPadre = new Map<string, Set<string>>();

  let creados = 0;
  let variantesCreadas = 0;

  for (const [skuPadre, productoData] of productosMap) {
    const { variantes, compatibleCon, ...productoBase } = productoData;

    // Resolver imagen_principal / imagenes según convención de acabados
    let imagen_principal: string | null = variantes[0]?._foto ?? null;
    let imagenes: string[] = [];
    if (FAMILIAS_CON_ACABADO.includes(productoBase.familia) && variantes.some((v: any) => v.acabado_tornillo)) {
      const porAcabado = new Map(variantes.map((v: any) => [v.acabado_tornillo, v._foto]));
      imagen_principal = porAcabado.get('Copper') ?? imagen_principal;
      imagenes = ['Steel', 'Gunmetal', 'Brass']
        .map((a) => porAcabado.get(a) ?? null)
        .filter(Boolean) as string[];
    }

    const producto = { ...productoBase, imagen_principal, imagenes };

    const { data: prod, error: errP } = await supabase
      .from('products')
      .upsert(producto, { onConflict: 'sku_padre' })
      .select()
      .single();

    if (errP) {
      logErr(`Error accesorio ${skuPadre}`, errP);
      continue;
    }
    creados++;
    variantesPorPadre.set(prod.id, new Set(variantes.map((v: any) => v.sku_variante)));

    const variantesConId = variantes.map(({ _foto, ...v }: any) => ({ ...v, product_id: prod.id }));
    const { error: errVar } = await supabase
      .from('product_variants')
      .upsert(variantesConId, { onConflict: 'sku_variante' });

    if (errVar) logErr(`Error variantes ${skuPadre}`, errVar);
    else variantesCreadas += variantes.length;

    // Compatibilidad — se reemplaza por completo en cada corrida
    await supabase.from('compatibility').delete().eq('product_id', prod.id);
    if (compatibleCon.length > 0) {
      const esCnc = TORNILLO_CNC(productoBase.familia);
      const inserts = compatibleCon.map((comp: string) => ({
        product_id: prod.id,
        familia_compatible: comp,
        es_compatible: true,
        notas: esCnc ? 'No compatible con Heroine Racer V1 original. Solo modelos 2.0.' : null,
      }));
      await supabase.from('compatibility').insert(inserts);
    }
  }

  logOk(`${creados} accesorios Hedon · ${variantesCreadas} variantes`);
  return { skusPadre, variantesPorPadre };
}

// ============================================================================
// MOTO II
// ============================================================================
async function syncMotoII(wb: XLSX.WorkBook): Promise<SyncResult> {
  logStep('Sincronizando MOTO II');
  const sheet = wb.Sheets['MOTO II'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const skusPadre = new Set<string>();
  const variantesPorPadre = new Map<string, Set<string>>();

  let creados = 0;

  for (const row of rows) {
    const sku = row['SKU'];
    if (!sku) continue;
    const categoriaExcel = row['Categoría'];
    const stock = parseInt(row['Stock']) || 0;
    const precio = parseFloat(row['Precio MXN']) || 0;

    let categoria: string;
    if (categoriaExcel === 'Dispositivo') categoria = 'estrella';
    else if (sku === 'CHR_MNT3.0_M2_M1ADAPTER') categoria = 'rescate_transicion';
    else categoria = 'add_on_simple';

    const producto = {
      sku_padre: sku,
      slug: makeSlug(row['Modelo']),
      nombre: row['Modelo'],
      marca: 'moto_ii',
      familia: categoriaExcel === 'Dispositivo' ? 'Moto II' : 'Accesorios Moto II',
      color: row['Color'] !== '-' ? clean(row['Color']) : null,
      categoria,
      precio_base: precio,
      moneda: 'MXN',
      imagen_principal: clean(row['Foto Cloudinary']),
      certificacion: categoriaExcel === 'Dispositivo' ? 'IP67' : null,
      numero_fotos_esperadas: categoriaExcel === 'Dispositivo' ? 9 : 4,
      visible_publico: true,
      destacado_home: categoriaExcel === 'Dispositivo',
    };

    const { data: prod, error: errP } = await supabase
      .from('products')
      .upsert(producto, { onConflict: 'sku_padre' })
      .select()
      .single();

    if (errP) {
      logErr(`Error MOTO II ${sku}`, errP);
      continue;
    }
    creados++;
    skusPadre.add(sku);
    variantesPorPadre.set(prod.id, new Set([sku]));

    const variante = {
      product_id: prod.id,
      sku_variante: sku,
      talla: null,
      precio,
      estado: normalizarEstado(row['Estado']),
      stock_actual: stock,
      codigo_barras: clean(row['Código de Barras'])?.toString() ?? null,
      visible_publico: true,
    };

    await supabase.from('product_variants').upsert(variante, { onConflict: 'sku_variante' });
  }

  logOk(`${creados} productos MOTO II`);
  return { skusPadre, variantesPorPadre };
}

// ============================================================================
// TEES
// ============================================================================
async function syncTees(wb: XLSX.WorkBook): Promise<SyncResult> {
  logStep('Sincronizando Tees');
  const sheet = wb.Sheets['Tees'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const productosMap = new Map<string, any>();

  for (const row of rows) {
    const skuPadre = row['SKU Padre'];
    if (!skuPadre) continue;

    if (!productosMap.has(skuPadre)) {
      productosMap.set(skuPadre, {
        sku_padre: skuPadre,
        slug: makeSlug(row['Diseño']),
        nombre: row['Diseño'],
        marca: 'tees',
        familia: 'Lhopital Tees',
        color: row['Color'],
        categoria: 'estrella',
        precio_base: parseFloat(row['Precio MXN']) || 850,
        moneda: 'MXN',
        material: clean(row['Material']),
        imagen_principal: clean(row['Foto Cloudinary']),
        numero_fotos_esperadas: 3,
        visible_publico: true,
        variantes: [] as any[],
      });
    }

    productosMap.get(skuPadre)!.variantes.push({
      sku_variante: row['SKU Variante'],
      talla: clean(row['Talla']),
      precio: parseFloat(row['Precio MXN']) || 850,
      estado: normalizarEstado(row['Estado']),
      stock_actual: parseInt(row['Stock']) || 0,
      visible_publico: true,
    });
  }

  const skusPadre = new Set(productosMap.keys());
  const variantesPorPadre = new Map<string, Set<string>>();

  let creados = 0;
  let variantesCreadas = 0;

  for (const [skuPadre, prodData] of productosMap) {
    const { variantes, ...productoSinVariantes } = prodData;

    const { data: prod, error: errP } = await supabase
      .from('products')
      .upsert(productoSinVariantes, { onConflict: 'sku_padre' })
      .select()
      .single();

    if (errP) {
      logErr(`Error tee ${skuPadre}`, errP);
      continue;
    }
    creados++;
    variantesPorPadre.set(prod.id, new Set(variantes.map((v: any) => v.sku_variante)));

    const variantesConId = variantes.map((v: any) => ({ ...v, product_id: prod.id }));
    const { error: errV } = await supabase
      .from('product_variants')
      .upsert(variantesConId, { onConflict: 'sku_variante' });

    if (!errV) variantesCreadas += variantes.length;
  }

  logOk(`${creados} diseños Tees · ${variantesCreadas} variantes`);
  return { skusPadre, variantesPorPadre };
}

// ============================================================================
// ALTA/BAJA — oculta productos y variantes que ya no están en el Excel
// ============================================================================
async function aplicarBajasProductos(marca: string, skusActivos: Set<string>): Promise<number> {
  const { data: existentes, error } = await supabase
    .from('products')
    .select('id, sku_padre, nombre, visible_publico')
    .eq('marca', marca);

  if (error) {
    logErr(`Error leyendo productos de marca ${marca}`, error);
    return 0;
  }

  const aDesactivar = (existentes || []).filter((p) => !skusActivos.has(p.sku_padre) && p.visible_publico);
  if (aDesactivar.length === 0) return 0;

  const { error: errUpdate } = await supabase
    .from('products')
    .update({ visible_publico: false })
    .in('id', aDesactivar.map((p) => p.id));

  if (errUpdate) {
    logErr(`Error dando de baja productos de marca ${marca}`, errUpdate);
    return 0;
  }

  aDesactivar.forEach((p) => console.log(`    ⤷ BAJA: ${p.sku_padre} — ${p.nombre} (ya no está en el Excel)`));
  return aDesactivar.length;
}

async function aplicarBajasVariantes(variantesPorPadre: Map<string, Set<string>>): Promise<number> {
  let total = 0;
  for (const [productId, skusActivos] of variantesPorPadre) {
    const { data: existentes, error } = await supabase
      .from('product_variants')
      .select('id, sku_variante, visible_publico')
      .eq('product_id', productId);

    if (error) {
      logErr(`Error leyendo variantes de producto ${productId}`, error);
      continue;
    }

    const aDesactivar = (existentes || []).filter((v) => !skusActivos.has(v.sku_variante) && v.visible_publico);
    if (aDesactivar.length === 0) continue;

    const { error: errUpdate } = await supabase
      .from('product_variants')
      .update({ visible_publico: false })
      .in('id', aDesactivar.map((v) => v.id));

    if (!errUpdate) total += aDesactivar.length;
  }
  return total;
}

// ============================================================================
// LISTA NEGRA — registro histórico (no controla visibilidad, ver aplicarBajas*)
// ============================================================================
async function syncListaNegra(wb: XLSX.WorkBook) {
  logStep('Sincronizando lista negra (registro histórico)');
  const sheet = wb.Sheets['Lista negra'];
  if (!sheet) return logErr('No se encontró pestaña "Lista negra"');

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const items = rows
    .filter((r) => r['Producto descontinuado'] && r['Fecha decisión'])
    .map((r) => {
      const nombre = r['Producto descontinuado'].toString();
      const marca = nombre.startsWith('HED') || nombre.startsWith('HER') || nombre.includes('EPI') ? 'hedon' : 'lhopital';
      return {
        producto_descontinuado: nombre,
        marca,
        razon: r['Razón'] || 'Descontinuado',
        fecha_decision: parsearFechaEspanol(r['Fecha decisión']),
      };
    });

  await supabase.from('discontinued').delete().not('producto_descontinuado', 'is', null);
  if (items.length === 0) return logOk('0 productos en lista negra');

  const { error } = await supabase.from('discontinued').insert(items);
  if (error) logErr('Error en lista negra', error);
  else logOk(`${items.length} productos en lista negra`);
}

// ============================================================================
// CONTENIDO RELACIONADO
// ============================================================================
async function syncContenido(wb: XLSX.WorkBook) {
  logStep('Sincronizando contenido relacionado');
  const sheet = wb.Sheets['Contenido relacionado'];
  if (!sheet) return logErr('No se encontró pestaña "Contenido relacionado"');

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const items = rows
    .filter((r) => r['Familia/Producto'])
    .map((r, i) => ({
      familia_o_producto: r['Familia/Producto'],
      tipo: r['Tipo de contenido'],
      titulo: r['Título'],
      url: r['URL'],
      donde_se_muestra: r['Dónde se muestra'],
      orden: i + 1,
      activo: true,
    }));

  await supabase.from('content_links').delete().not('familia_o_producto', 'is', null);
  if (items.length === 0) return logOk('0 contenidos relacionados');

  const { error } = await supabase.from('content_links').insert(items);
  if (error) logErr('Error en contenido', error);
  else logOk(`${items.length} contenidos relacionados`);
}

// ============================================================================
// VENTAS CRUZADAS MOTO II
// ============================================================================
async function syncVentasCruzadas(wb: XLSX.WorkBook) {
  logStep('Sincronizando ventas cruzadas (Moto II)');
  const sheet = wb.Sheets['Ventas cruzadas Moto II'];
  if (!sheet) return logErr('No se encontró pestaña "Ventas cruzadas Moto II"');

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const { data: productos } = await supabase.from('products').select('id, sku_padre');
  const skuToId = new Map((productos || []).map((p) => [p.sku_padre, p.id]));

  const items = rows
    .map((r) => {
      const productId = skuToId.get(r['Producto principal (SKU padre)']);
      const suggestedId = skuToId.get(r['Producto sugerido (SKU padre)']);

      if (!productId || !suggestedId) {
        logErr(`SKU no encontrado en ventas cruzadas: ${r['Producto principal (SKU padre)']} → ${r['Producto sugerido (SKU padre)']}`);
        return null;
      }

      return {
        product_id: productId,
        suggested_product_id: suggestedId,
        tipo: r['Tipo'],
        mensaje: r['Mensaje sugerido'],
        prioridad: parseInt(r['Prioridad']) || 1,
        activo: true,
      };
    })
    .filter((x) => x !== null);

  await supabase.from('cross_sells').delete().not('product_id', 'is', null);
  if (items.length === 0) return logOk('0 ventas cruzadas Moto II');

  const { error } = await supabase.from('cross_sells').insert(items);
  if (error) logErr('Error en ventas cruzadas', error);
  else logOk(`${items.length} ventas cruzadas Moto II`);
}

// ============================================================================
// HEDON CROSS-SELL — tabla que realmente lee la ficha de producto
// ============================================================================
async function syncHedonCrossSell(wb: XLSX.WorkBook) {
  logStep('Sincronizando Hedon Cross-Sell');
  const sheet = wb.Sheets['Hedon Cross-Sell'];
  if (!sheet) return logErr('No se encontró pestaña "Hedon Cross-Sell"');

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const items = rows
    .filter((r) => r['SKU Casco'] && r['SKU Accesorio'])
    .map((r) => ({
      sku_casco: r['SKU Casco'],
      sku_accesorio: r['SKU Accesorio'],
      mensaje: clean(r['Mensaje editorial']),
      tiene_foto: !!r['Tiene foto'],
      fotos: r['Fotos Cloudinary (public_ids, separados por coma)']
        ? r['Fotos Cloudinary (public_ids, separados por coma)']
            .toString()
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : null,
      orden: parseInt(r['Orden']) || 1,
    }));

  await supabase.from('hedon_cross_sell').delete().not('sku_casco', 'is', null);
  if (items.length === 0) return logOk('0 cross-sells Hedon');

  const { error } = await supabase.from('hedon_cross_sell').insert(items);
  if (error) logErr('Error en Hedon Cross-Sell', error);
  else logOk(`${items.length} cross-sells Hedon`);
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  SYNC CATÁLOGO → SUPABASE                                   ║');
  console.log('║  Lhopital-moto                                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`Archivo:  ${EXCEL_PATH}`);
  console.log(`Supabase: ${SUPABASE_URL}`);

  const wb = XLSX.readFile(EXCEL_PATH);
  mostrarLeeme(wb);
  console.log(`\nPestañas encontradas: ${wb.SheetNames.join(', ')}`);

  try {
    await syncColecciones(wb);

    const hedonCascos = await syncHedonCascos(wb);
    const hedonAcc = await syncHedonAccesorios(wb);
    const motoII = await syncMotoII(wb);
    const tees = await syncTees(wb);

    logStep('Aplicando alta/baja de productos');
    const hedonSkus = new Set([...hedonCascos.skusPadre, ...hedonAcc.skusPadre]);
    const bajasHedon = await aplicarBajasProductos('hedon', hedonSkus);
    const bajasMotoII = await aplicarBajasProductos('moto_ii', motoII.skusPadre);
    const bajasTees = await aplicarBajasProductos('tees', tees.skusPadre);
    const totalBajasProductos = bajasHedon + bajasMotoII + bajasTees;
    if (totalBajasProductos === 0) logOk('Sin productos nuevos por dar de baja');
    else logOk(`${totalBajasProductos} productos dados de baja (ocultados del sitio)`);

    const variantesPorPadre = new Map([
      ...hedonCascos.variantesPorPadre,
      ...hedonAcc.variantesPorPadre,
      ...motoII.variantesPorPadre,
      ...tees.variantesPorPadre,
    ]);
    const bajasVariantes = await aplicarBajasVariantes(variantesPorPadre);
    logOk(`${bajasVariantes} variantes (tallas/acabados) dadas de baja`);

    await syncListaNegra(wb);
    await syncContenido(wb);
    await syncVentasCruzadas(wb);
    await syncHedonCrossSell(wb);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✓ SINCRONIZACIÓN COMPLETA                                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('visible_publico', true);
    const { count: varCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });
    const { count: crossCount } = await supabase.from('hedon_cross_sell').select('*', { count: 'exact', head: true });

    console.log(`Productos visibles en el sitio: ${prodCount}`);
    console.log(`Variantes en BD:                ${varCount}`);
    console.log(`Cross-sells Hedon activos:       ${crossCount}`);
    console.log('\nLos cambios se reflejan en el sitio en un máximo de 60 segundos (revalidate).\n');
  } catch (err) {
    console.error('\n❌ Error fatal en sincronización:', err);
    process.exit(1);
  }
}

main();
