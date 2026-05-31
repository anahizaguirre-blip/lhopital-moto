/**
 * ============================================================================
 * MIGRATE FROM EXCEL — Lhopital-moto
 * ============================================================================
 *
 * Toma el archivo Catalogo_Master_v4_Lhopital-moto.xlsx y lo migra a Supabase.
 *
 * USO:
 *   1. Asegúrate de haber corrido supabase-schema.sql primero (crea las tablas).
 *   2. Pon el Excel v4 en /scripts/Catalogo_Master_v4_Lhopital-moto.xlsx
 *   3. Crea archivo .env.local en la raíz del proyecto con:
 *        NEXT_PUBLIC_SUPABASE_URL=tu_url
 *        SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  (NO el anon key)
 *   4. Instala deps: npm install @supabase/supabase-js xlsx slug dotenv
 *   5. Corre: npx tsx scripts/migrate-from-excel.ts
 *
 * IMPORTANTE: usa SERVICE_ROLE_KEY (no anon) porque vamos a hacer inserts
 * masivos que requieren bypasear RLS. NUNCA expongas service_role en el browser.
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import slugify from 'slug';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno. Verifica .env.local');
  process.exit(1);
}

const EXCEL_PATH = path.join(__dirname, 'Catalogo_Master_v4_Lhopital-moto.xlsx');

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

const makeSlug = (text: string) =>
  slugify(text, { lower: true, replacement: '-' });

const logStep = (msg: string) => console.log(`\n→ ${msg}`);
const logOk = (msg: string) => console.log(`  ✓ ${msg}`);
const logErr = (msg: string, err?: any) => {
  console.error(`  ✗ ${msg}`);
  if (err) console.error(err);
};

// ============================================================================
// PASO 1 — COLECCIONES HEDON
// ============================================================================
async function migrarColecciones() {
  logStep('Migrando colecciones Hedon');

  const colecciones = [
    {
      id: 'coleccion_2026_arte_proteccion',
      nombre: 'El arte de la protección',
      año: '2026',
      modelos_aplicables: ['Hedonist', 'Epicurist 2.0', 'Heroine Racer 2.0'],
      etiqueta_visible: 'Colección 2026 · El arte de la protección',
      activa: true,
      destacada: true,
      orden_display: 1,
    },
    {
      id: 'coleccion_2026_psilo_debut',
      nombre: 'Debut Psilo Explorer',
      año: '2026',
      modelos_aplicables: ['Psilo Explorer'],
      etiqueta_visible: 'Colección debut Psilo Explorer 2026',
      activa: true,
      destacada: true,
      orden_display: 2,
    },
    {
      id: 'coleccion_lejano_oeste',
      nombre: 'Lejano Oeste',
      año: 'Histórica',
      modelos_aplicables: ['Hedonist', 'Heroine Racer 2.0'],
      etiqueta_visible: 'Colección Lejano Oeste',
      activa: true,
      destacada: false,
      orden_display: 3,
    },
    {
      id: 'clasico_permanente',
      nombre: 'Clásicos Hedon',
      año: 'Permanente',
      modelos_aplicables: ['Hedonist', 'Epicurist 2.0', 'Psilo Explorer', 'Heroine Racer 2.0'],
      etiqueta_visible: 'Clásico Hedon',
      activa: true,
      destacada: false,
      orden_display: 4,
    },
  ];

  const { error } = await supabase.from('collections').upsert(colecciones, {
    onConflict: 'id',
  });

  if (error) logErr('Error en colecciones', error);
  else logOk(`${colecciones.length} colecciones cargadas`);
}

// ============================================================================
// PASO 2 — LISTA NEGRA (productos descontinuados)
// ============================================================================
async function migrarListaNegra(wb: XLSX.WorkBook) {
  logStep('Migrando lista negra');

  const sheet = wb.Sheets['Lista negra'];
  if (!sheet) {
    logErr('No se encontró pestaña "Lista negra"');
    return;
  }

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { range: 2 }); // skip banner

  const items = rows
    .filter((r) => r['Producto descontinuado'])
    .map((r) => ({
      producto_descontinuado: r['Producto descontinuado'],
      marca: r['Producto descontinuado'].toString().startsWith('HED') || r['Producto descontinuado'].toString().startsWith('HER') || r['Producto descontinuado'].toString().includes('EPI') ? 'hedon' : 'lhopital',
      razon: r['Razón'] || 'Descontinuado',
      fecha_decision: '2026-05-28',
    }));

  const { error } = await supabase.from('discontinued').insert(items);
  if (error && !error.message.includes('duplicate')) logErr('Error en lista negra', error);
  else logOk(`${items.length} productos en lista negra`);
}

// ============================================================================
// PASO 3 — HEDON CASCOS
// ============================================================================
async function migrarHedonCascos(wb: XLSX.WorkBook) {
  logStep('Migrando Hedon Cascos');

  const sheet = wb.Sheets['Hedon Cascos'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  // Agrupar por SKU Padre (cada producto tiene N variantes de talla)
  const productosMap = new Map<string, any>();

  for (const row of rows) {
    const skuPadre = row['SKU Padre'];
    if (!productosMap.has(skuPadre)) {
      productosMap.set(skuPadre, {
        sku_padre: skuPadre,
        slug: makeSlug(`${row['Familia']} ${row['Color']}`),
        nombre: `${row['Familia']} ${row['Color']}`,
        marca: 'hedon',
        familia: row['Familia'],
        color: row['Color'],
        categoria: 'estrella',
        coleccion_id: row['Tipo Colección'],
        precio_base: parseFloat(row['Precio MXN']) || 0,
        moneda: 'MXN',
        frase_corta: row['Frase corta'] || null,
        certificacion: row['Certificación'] || 'ECE 22.06',
        imagen_principal: row['Foto Cloudinary'] || null,
        numero_fotos_esperadas: 4,
        visible_publico: true,
        destacado_home: row['Familia'] === 'Psilo Explorer',
        variantes: [],
      });
    }

    productosMap.get(skuPadre)!.variantes.push({
      sku_variante: row['SKU Variante'],
      talla: row['Talla'],
      precio: parseFloat(row['Precio MXN']) || null,
      estado: row['Estado'],
      stock_actual: parseInt(row['Stock']) || 0,
      codigo_barras: row['Código de Barras']?.toString() || null,
    });
  }

  let creados = 0;
  let variantesCreadas = 0;

  for (const [skuPadre, productoData] of productosMap) {
    const { variantes, ...productoSinVariantes } = productoData;

    // Insertar producto
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

    // Insertar variantes
    const variantesConProductId = variantes.map((v: any) => ({
      ...v,
      product_id: producto.id,
    }));

    const { error: errVar } = await supabase
      .from('product_variants')
      .upsert(variantesConProductId, { onConflict: 'sku_variante' });

    if (errVar) {
      logErr(`Error variantes ${skuPadre}`, errVar);
    } else {
      variantesCreadas += variantes.length;
    }
  }

  logOk(`${creados} productos · ${variantesCreadas} variantes Hedon cascos`);
}

// ============================================================================
// PASO 4 — HEDON ACCESORIOS
// ============================================================================
async function migrarHedonAccesorios(wb: XLSX.WorkBook) {
  logStep('Migrando Hedon Accesorios');

  const sheet = wb.Sheets['Hedon Accesorios'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  const tornilloCnc = (tipo: string) => tipo === 'Tornillo CNC';
  const visera = (tipo: string) => tipo.startsWith('Visera') || tipo === 'Visor Burbuja' || tipo === 'Visor Protector';
  const visor = (tipo: string) => tipo === 'Visor';

  let creados = 0;

  for (const row of rows) {
    const sku = row['SKU'];
    const tipo = row['Tipo'];
    const stock = parseInt(row['Stock']) || 0;
    const precio = parseFloat(row['Precio MXN']) || 0;

    // Categoría según tipo de accesorio
    const categoria = tornilloCnc(tipo) || visera(tipo) || visor(tipo)
      ? 'add_on_dual'
      : 'add_on_simple';

    const producto = {
      sku_padre: sku,
      slug: makeSlug(`${tipo} ${row['Modelo/Color']}`),
      nombre: `${tipo} ${row['Modelo/Color']}`,
      marca: 'hedon',
      familia: tipo,
      color: row['Modelo/Color'],
      categoria,
      coleccion_id: null,
      precio_base: precio,
      moneda: 'MXN',
      imagen_principal: row['Foto Cloudinary'] || null,
      numero_fotos_esperadas: 2,
      visible_publico: true,
    };

    const { data: prod, error: errP } = await supabase
      .from('products')
      .upsert(producto, { onConflict: 'sku_padre' })
      .select()
      .single();

    if (errP) {
      logErr(`Error accesorio ${sku}`, errP);
      continue;
    }

    // Variante única (los accesorios no tienen tallas)
    const variante = {
      product_id: prod.id,
      sku_variante: sku,
      talla: null,
      precio,
      estado: stock > 0 ? 'disponible' : 'bajo_pedido',
      stock_actual: stock,
    };

    await supabase.from('product_variants').upsert(variante, { onConflict: 'sku_variante' });

    // Compatibilidad
    const compatibles = row['Compatible con']?.toString().split('/').map((s: string) => s.trim()) || [];
    for (const comp of compatibles) {
      if (!comp) continue;

      const esCnc = tornilloCnc(tipo);
      const insertCompat: any = {
        product_id: prod.id,
        familia_compatible: comp,
        es_compatible: true,
      };

      // Tornillos CNC: NO compatibles con Heroine Racer V1
      if (esCnc) {
        insertCompat.notas = 'No compatible con Heroine Racer V1 original. Solo modelos 2.0.';
      }

      await supabase.from('compatibility').insert(insertCompat);
    }

    creados++;
  }

  logOk(`${creados} accesorios Hedon`);
}

// ============================================================================
// PASO 5 — MOTO II
// ============================================================================
async function migrarMotoII(wb: XLSX.WorkBook) {
  logStep('Migrando MOTO II');

  const sheet = wb.Sheets['MOTO II'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  let creados = 0;

  for (const row of rows) {
    const sku = row['SKU'];
    const categoria_excel = row['Categoría'];
    const stock = parseInt(row['Stock']) || 0;
    const precio = parseFloat(row['Precio MXN']) || 0;

    // Categoría comercial
    let categoria: string;
    if (categoria_excel === 'Dispositivo') {
      categoria = 'estrella';
    } else if (sku === 'CHR_MNT3.0_M2_M1ADAPTER') {
      categoria = 'rescate_transicion';
    } else {
      categoria = 'add_on_simple';
    }

    const producto = {
      sku_padre: sku,
      slug: makeSlug(row['Modelo']),
      nombre: row['Modelo'],
      marca: 'moto_ii',
      familia: categoria_excel === 'Dispositivo' ? 'Moto II' : 'Accesorios Moto II',
      color: row['Color'] !== '-' ? row['Color'] : null,
      categoria,
      precio_base: precio,
      moneda: 'MXN',
      imagen_principal: row['Foto Cloudinary'] || null,
      certificacion: categoria_excel === 'Dispositivo' ? 'IP67' : null,
      numero_fotos_esperadas: categoria_excel === 'Dispositivo' ? 9 : 4,
      visible_publico: true,
      destacado_home: categoria_excel === 'Dispositivo',
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

    const variante = {
      product_id: prod.id,
      sku_variante: sku,
      talla: null,
      precio,
      estado: row['Estado'],
      stock_actual: stock,
      codigo_barras: row['Código de Barras']?.toString() || null,
    };

    await supabase.from('product_variants').upsert(variante, { onConflict: 'sku_variante' });

    creados++;
  }

  logOk(`${creados} productos MOTO II`);
}

// ============================================================================
// PASO 6 — TEES
// ============================================================================
async function migrarTees(wb: XLSX.WorkBook) {
  logStep('Migrando Tees');

  const sheet = wb.Sheets['Tees'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  const productosMap = new Map<string, any>();

  for (const row of rows) {
    const skuPadre = row['SKU Padre'];
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
        material: row['Material'],
        imagen_principal: row['Foto Cloudinary'] || null,
        numero_fotos_esperadas: 3,
        visible_publico: true,
        variantes: [],
      });
    }

    productosMap.get(skuPadre)!.variantes.push({
      sku_variante: row['SKU Variante'],
      talla: row['Talla'],
      precio: parseFloat(row['Precio MXN']) || 850,
      estado: row['Estado'],
      stock_actual: parseInt(row['Stock']) || 0,
    });
  }

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

    const variantesConId = variantes.map((v: any) => ({
      ...v,
      product_id: prod.id,
    }));

    const { error: errV } = await supabase
      .from('product_variants')
      .upsert(variantesConId, { onConflict: 'sku_variante' });

    if (!errV) variantesCreadas += variantes.length;
  }

  logOk(`${creados} diseños Tees · ${variantesCreadas} variantes`);
}

// ============================================================================
// PASO 7 — CONTENIDO RELACIONADO
// ============================================================================
async function migrarContenido(wb: XLSX.WorkBook) {
  logStep('Migrando contenido relacionado');

  const sheet = wb.Sheets['Contenido relacionado'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  const items = rows.map((r) => ({
    familia_o_producto: r['Familia/Producto'],
    tipo: r['Tipo de contenido'],
    titulo: r['Título'],
    url: r['URL'],
    donde_se_muestra: r['Dónde se muestra'],
  }));

  const { error } = await supabase.from('content_links').insert(items);
  if (error) logErr('Error en contenido', error);
  else logOk(`${items.length} contenidos relacionados`);
}

// ============================================================================
// PASO 8 — VENTAS CRUZADAS
// ============================================================================
async function migrarVentasCruzadas(wb: XLSX.WorkBook) {
  logStep('Migrando ventas cruzadas');

  const sheet = wb.Sheets['Ventas cruzadas'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  // Mapeo SKU → product_id
  const { data: productos } = await supabase.from('products').select('id, sku_padre');
  const skuToId = new Map(productos?.map((p) => [p.sku_padre, p.id]) || []);

  const items = rows
    .map((r) => {
      const productId = skuToId.get(r['Producto principal (SKU padre)']);
      const suggestedId = skuToId.get(r['Producto sugerido (SKU padre)']);

      if (!productId || !suggestedId) return null;

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

  const { error } = await supabase.from('cross_sells').insert(items);
  if (error) logErr('Error en cross-sells', error);
  else logOk(`${items.length} ventas cruzadas`);
}

// ============================================================================
// PASO 9 — INVENTARIO INICIAL (movimientos)
// ============================================================================
async function registrarInventarioInicial() {
  logStep('Registrando movimientos de inventario inicial');

  const { data: variantes } = await supabase
    .from('product_variants')
    .select('id, sku_variante, stock_actual')
    .gt('stock_actual', 0);

  if (!variantes || variantes.length === 0) {
    logOk('Sin stock inicial que registrar');
    return;
  }

  const movimientos = variantes.map((v) => ({
    variant_id: v.id,
    tipo: 'baja_inventario_inicial',
    cantidad: v.stock_actual,
    stock_anterior: 0,
    stock_nuevo: v.stock_actual,
    notas: 'Carga inicial desde Catálogo Master v4',
  }));

  const { error } = await supabase.from('stock_movements').insert(movimientos);
  if (error) logErr('Error en movimientos', error);
  else logOk(`${movimientos.length} movimientos de inventario inicial`);
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  MIGRACIÓN EXCEL v4 → SUPABASE                             ║');
  console.log('║  Lhopital-moto                                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  console.log(`\nArchivo: ${EXCEL_PATH}`);
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`Pestañas encontradas: ${wb.SheetNames.join(', ')}`);

  try {
    await migrarColecciones();
    await migrarListaNegra(wb);
    await migrarHedonCascos(wb);
    await migrarHedonAccesorios(wb);
    await migrarMotoII(wb);
    await migrarTees(wb);
    await migrarContenido(wb);
    await migrarVentasCruzadas(wb);
    await registrarInventarioInicial();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✓ MIGRACIÓN COMPLETA                                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Resumen
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: varCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });

    console.log(`Total productos en BD: ${prodCount}`);
    console.log(`Total variantes en BD: ${varCount}`);
    console.log('\nPróximos pasos:');
    console.log('  1. Revisa Supabase Dashboard → Table Editor');
    console.log('  2. Corre useful-queries.sql para vistas y reportes');
    console.log('  3. Conecta Cloudinary cuando tengas las fotos subidas\n');
  } catch (err) {
    console.error('\n❌ Error fatal en migración:', err);
    process.exit(1);
  }
}

main();
