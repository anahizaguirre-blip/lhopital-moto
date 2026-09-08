-- ============================================================================
-- CONTENIDO — artículos de marca en /guias/[slug]
-- ============================================================================
-- Corre este script UNA VEZ en el SQL Editor de Supabase (Dashboard → SQL
-- Editor). No hay CLI/migraciones locales en este proyecto — el esquema se
-- gestiona directo en Supabase, igual que el resto de las tablas del catálogo.
-- ============================================================================

-- ── Tabla ───────────────────────────────────────────────────────────────────

do $$ begin
  create type contenido_marca as enum ('hedon', 'moto_ii', 'tees');
exception
  when duplicate_object then null;
end $$;

create table if not exists contenido (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  marca contenido_marca not null,
  tipo text not null,
  titulo text not null,
  cuerpo jsonb not null default '[]'::jsonb,
  sku_relacionado text[],
  imagen_portada text,
  fecha_publicacion date,
  donde_se_muestra text,
  visible_publico boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: lectura pública, sin policy de escritura pública (el service_role de
-- los scripts de sync la ignora por diseño; el resto del sitio solo lee).
alter table contenido enable row level security;

drop policy if exists "contenido_select_publico" on contenido;
create policy "contenido_select_publico"
  on contenido for select
  using (true);

-- ── Registros iniciales ─────────────────────────────────────────────────────

insert into contenido (
  slug, marca, tipo, titulo, cuerpo, sku_relacionado,
  imagen_portada, fecha_publicacion, donde_se_muestra, visible_publico
) values (
  'montajes-moto-ii',
  'moto_ii',
  'guia',
  'Los 8 montajes de Moto II: encuentra el que va con tu moto',
  $jsonb$[{"tipo":"texto","contenido":{"texto":"Los accesorios de Moto II te dan libertad total: montas tu navegador dónde y cómo quieras, para que se ajuste a tu forma de manejar — no al revés.\n\nExisten ocho soportes distintos, pensados para prácticamente cualquier motocicleta o scooter. Aquí te contamos cuál es cuál."}},{"tipo":"sku_card","contenido":{"sku":null,"numero":"01","titulo":"Soporte Universal","texto":"Es el montaje que viene incluido con tu Moto II. Se ajusta a cualquier motocicleta con correas elásticas resistentes — sin instalación, sin herramientas.","imagen_public_id":"motoii-soporte-universal-uso","precio_label":"Incluido"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_BAR","numero":"02","titulo":"Bar Clamp","texto":"Para motos con espacio en el manillar, el Bar Clamp anodizado es el montaje más vendido de la línea. Incluye espaciadores de 22.2, 25.4, 28.6 y 31.8 mm, listos para ajustarse a la mayoría de los manillares estándar.\n\nLa abrazadera con bisagra y el diseño de una sola pieza hacen que instalarlo tome minutos. El perno queda oculto bajo el inserto: limpio, delgado, sin partes a la vista.\n\nMuchas motos Triumph tienen espacio de sobra en el manillar — si la tuya es una, este es tu montaje.","imagen_public_id":"chr-mnt-bar-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_BALL","numero":"03","titulo":"Ram Ball","texto":"Con bola de 1 pulgada, este montaje es compatible con los sistemas RAM más usados del mercado. Si ya tienes un soporte RAM instalado en tu moto, este es el complemento directo — sin cambiar nada más.","imagen_public_id":"chr-mnt-ball-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_MIRRORXBAR","numero":"04","titulo":"Mirror and Crossbar","texto":"Pensado para motos y scooters con espejos retrovisores clásicos, este montaje anodizado se ajusta a retrovisores o barras transversales de 10, 12, 14 y 16 mm.\n\nLa cabeza gira por completo, así que encuentras el ángulo exacto según tu posición de manejo. Los soportes de goma protegen el retrovisor mientras el montaje queda firme. Ideal para Vespas.","imagen_public_id":"chr-mnt-mirrorxbar-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_FORK","numero":"05","titulo":"Fork Stem Mount","texto":"Hecho para motos con manillares tipo clip-on. La base encaja en el orificio central del vástago de la horquilla: puedes montar tu Moto II al ras del manillar o usar las piezas modulares incluidas para ajustar ángulo y posición.\n\nIncluye un espaciador chico (12 a 18.5 mm) y uno grande (18.5 a 25.4 mm), para un ajuste exacto. Es la opción natural para motos como la Thruxton RS de Triumph o motos de pista.","imagen_public_id":"chr-mnt-fork-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_AMPS","numero":"06","titulo":"4-hole AMPS","texto":"Compatible con las placas de montaje AMPS estándar, o como base para armar tu propia solución personalizada. Se asegura con almohadilla adhesiva 3M VHB o con tornillos sobre una superficie plana — un tablero, por ejemplo.\n\nSu base amplia con cavidad de inserción integrada lo hace ideal para motos de aventura con soporte AMPS ya instalado. No incluye tornillos para la base AMPS.","imagen_public_id":"chr-mnt-amps-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_MOD","numero":"07","titulo":"Modular Mount Extender Kit","texto":"Un kit completamente ajustable, con extensión removible, que le suma altura y flexibilidad a tu montaje. Combínalo con soportes para cámaras de acción y arma tu propia configuración.\n\nCon el 4-hole AMPS, puedes construir algo muy cercano al Sticky Pad Mount del Moto original.","imagen_public_id":"chr-mnt-mod-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_PWR","numero":"08","titulo":"12V Powered Mount Insert","texto":"Convierte cualquier soporte compatible en un punto de carga para tu Moto II mientras ruedas.\n\nTu Moto II llega con cargador USB-C, pero ese puerto no está pensado para usarse en movimiento — hacerlo puede dañarlo, y eso queda fuera de garantía (revisa tu instructivo antes de usarlo). El Powered Mount Insert resuelve esto: conexión SAE y dos metros de cable con terminales directo a la batería. Instalación simple, carga constante.","imagen_public_id":"chr-mnt-pwr-uso"}},{"tipo":"texto","contenido":{"titulo":"¿Qué otros accesorios existen para tu Beeline Moto II?","texto":"Dos piezas más que completan tu Moto II — no son montajes, pero viven en la misma familia."}},{"tipo":"sku_card","contenido":{"sku":"CHR_CSE_3.0","numero":"09","titulo":"Carry Case","texto":"Un estuche rígido con cierre, interior suave y acolchado, con espacio para el navegador y su cable USB-C. El mosquetón lo lleva contigo: en el cinturón, la mochila o donde prefieras.","imagen_public_id":"chr-cse-uso"}},{"tipo":"sku_card","contenido":{"sku":"CHR_MNT3.0_M2_M1ADAPTER","numero":"10","titulo":"Adaptador Moto II a Moto I","texto":"Si ya tenías el Beeline Moto original con su montaje instalado y estás por cambiar al Moto II, no necesitas comprar un montaje nuevo. El adaptador M2 a M1 conecta tu Moto II a los montajes del original — mismo soporte, nuevo navegador.","imagen_public_id":"chr-mnt-m2-m1adapter-uso"}},{"tipo":"texto","contenido":{"texto":"Lhopital es distribuidor máster de toda la línea Beeline en México. Encuentras el navegador satelital y todos sus accesorios en nuestra tienda en línea, en las boutiques autorizadas y en los eventos donde nos presentamos.\n\nSíguenos en redes para enterarte primero de lo nuevo. Nos vemos en el camino."}}]$jsonb$::jsonb,
  ARRAY['CHR_MNT3.0_BAR', 'CHR_MNT3.0_BALL', 'CHR_MNT3.0_MIRRORXBAR', 'CHR_MNT3.0_FORK', 'CHR_MNT3.0_AMPS', 'CHR_MNT3.0_MOD', 'CHR_MNT3.0_PWR', 'CHR_CSE_3.0', 'CHR_MNT3.0_M2_M1ADAPTER']::text[],
  'chr-mnt-bar-uso',
  '2026-09-08',
  'Selector dinámico en ficha MOTO II',
  true
)
on conflict (slug) do update set
  marca = excluded.marca,
  tipo = excluded.tipo,
  titulo = excluded.titulo,
  cuerpo = excluded.cuerpo,
  sku_relacionado = excluded.sku_relacionado,
  imagen_portada = excluded.imagen_portada,
  fecha_publicacion = excluded.fecha_publicacion,
  donde_se_muestra = excluded.donde_se_muestra,
  visible_publico = excluded.visible_publico,
  updated_at = now();

insert into contenido (
  slug, marca, tipo, titulo, cuerpo, sku_relacionado,
  imagen_portada, fecha_publicacion, donde_se_muestra, visible_publico
) values (
  'moto-ii-vs-celular',
  'moto_ii',
  'comparativa',
  'Moto II vs. celular: la ruta no necesita más pantallas',
  $jsonb$[{"tipo":"texto","contenido":{"texto":"Rodar en México tiene su propio idioma: calles que cambian de nombre sin avisar, carreteras sin una barra de señal, un clima que nunca se pone de acuerdo consigo mismo. Ahí es exactamente donde un celular empieza a fallar — y donde un navegador satelital como Moto II demuestra por qué existe.\n\nMoto II no hace de todo. Hace una cosa: llevarte por la ruta, sin pedirte nada a cambio. Aquí están los 9 momentos donde el celular se queda corto y Moto II resuelve."}},{"tipo":"texto","contenido":{"titulo":"1. Las vibraciones del camino","texto":"El motor de la moto vibra fuerte, y un celular montado en el manillar lo resiente. Necesitas un case específico, un soporte adecuado y, casi siempre, un amortiguador para proteger la estabilización de la cámara. Cambias de celular, cambias de case. Es un gasto que se repite cada vez.\n\nMoto II no tiene ese problema. Resiste las vibraciones del manillar y se conecta por bluetooth 4.0 con cualquier celular. Si cambias de moto, se instala como si viniera de fábrica — solo necesitas el montaje universal que incluye tu compra."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-01-vibraciones","alt":"Moto II montado en el manillar, resistiendo las vibraciones del camino"}},{"tipo":"texto","contenido":{"titulo":"2. Cuando la señal desaparece","texto":"Toda compañía telefónica tiene huecos de cobertura, sobre todo en carretera. Si te quedas sin señal justo en una desviación — o es tu primera vez en esa ruta — puedes perder la salida. Cuando la señal regresa, la aplicación te redirige y ya perdiste el tiempo.\n\nMoto II no depende de internet. Funciona por satélite, con señal en cualquier lugar y en cualquier momento. Solo necesitas planear tu ruta antes de salir de casa."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-02-senal","alt":"Moto II funcionando por señal satelital, sin depender de la cobertura del celular"}},{"tipo":"texto","contenido":{"titulo":"3. La batería que no alcanza","texto":"Un celular con carga completa dura, en el mejor de los casos, diez horas de uso. Si sube la temperatura, dura menos. Y si además tomas fotos o grabas video en el camino, la batería se va todavía más rápido.\n\nMoto II tiene hasta 14 horas de autonomía continua, con retroiluminación para rodar de noche. Y como no ocupas tu celular como navegador, le queda batería para lo que sí importa: las fotos del paisaje y las llamadas que necesites."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-03-bateria","alt":"Moto II con hasta 14 horas de autonomía continua"}},{"tipo":"texto","contenido":{"titulo":"4. El clima no negocia","texto":"El calor extremo apaga celulares expuestos directamente al sol — la batería se daña. El frío hace lo mismo: el litio necesita temperaturas cercanas a los 15°C para funcionar bien. Y una lluvia, por ligera que sea, puede ser el fin de tu celular, porque la mayoría no está diseñado para el agua.\n\nMoto II sí lo está. Su pantalla es de vidrio templado, legible bajo el sol directo y con retroiluminación LED para la noche. Resiste el agua, sin excepciones."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-04-clima","alt":"Moto II con pantalla de vidrio templado, resistente al sol, frío y agua"}},{"tipo":"texto","contenido":{"titulo":"5. Una caída inesperada","texto":"Existen dos tipos de motociclistas: los que ya se cayeron y los que se van a caer. Si llevas el celular en el manillar durante un derrape, puede caer y romperse contigo. Perder un smartphone de gama alta duele — pero el verdadero problema es quedarte sin forma de pedir ayuda o avisar que estás bien.\n\nMoto II tiene certificación IP67: resiste polvo y agua. Puede caer contigo sin romperse. Deja el celular para las llamadas."}},{"tipo":"texto","contenido":{"titulo":"6. Mapas que no se actualizan","texto":"Dependiendo de la aplicación, el mapa puede no reflejar una calle cerrada o una salida nueva.\n\nMoto II se apoya en Google Maps, que se actualiza prácticamente todos los días — y lo hace gratis, con solo mantener conectada la aplicación de Beeline Moto por bluetooth."}},{"tipo":"texto","contenido":{"titulo":"7. Cuando quieres desviarte","texto":"Explorar caminos nuevos es parte de rodar. El problema es que la mayoría de las aplicaciones no lo entienden: si te sales de la ruta marcada, insisten en devolverte al camino más rápido.\n\nMoto II tiene dos modos: ruta y brújula. El modo ruta te lleva del punto A al B de la forma más eficiente. El modo brújula te da una dirección y, si te desvías, recalcula sin insistir en regresarte a la ruta principal."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-07a-modo-ruta","alt":"Moto II en modo ruta, del punto A al punto B"}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-07b-modo-brujula","alt":"Moto II en modo brújula, recalculando sin insistir en volver a la ruta principal"}},{"tipo":"texto","contenido":{"titulo":"8. La seguridad en la ciudad","texto":"En una ciudad grande, un celular sobre el manillar durante un alto es una invitación. Es una realidad incómoda, pero real.\n\nMoto II es discreto: 49.8 mm de diámetro, 18.6 mm de profundidad. Se libera girándolo en sentido contrario a las manecillas y se guarda en su carry case para llevarlo a donde vayas."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-08-seguridad-ciudad","alt":"Moto II, discreto y compacto, guardado en su carry case"}},{"tipo":"texto","contenido":{"titulo":"9. Las distracciones del camino","texto":"Los motociclistas manejamos siempre a la defensiva — los autos no siempre nos ven. Sumar una pantalla que vibra con cada notificación no ayuda.\n\nMoto II es simple: sigue la flecha y llega. No sustituye al celular, lo complementa. La aplicación gratuita vive en tu smartphone, pero la navegación vive en el manillar, donde no compite por tu atención.\n\nUtiliza tu celular para llamadas y fotos, y déjale a Beeline Moto la ruta."}},{"tipo":"imagen","contenido":{"public_id":"motoii-vs-celular-09-distracciones","alt":"Moto II en el manillar, sin distracciones ni notificaciones"}},{"tipo":"texto","contenido":{"titulo":"¿Dónde consigo mi Moto II?","texto":"Lhopital es distribuidor autorizado de Beeline Moto en México. Encuentras el navegador satelital, sus montajes y accesorios en nuestra tienda.\n\nSi tienes dudas sobre cuál montaje va con tu moto, escríbenos por redes sociales o directo por acá. Te ayudamos a elegir antes de que salgas a rodar.\n\nNos vemos en el camino."}},{"tipo":"sku_card","contenido":{"sku":"CHR_BLD3.0_BLK","numero":"01","titulo":"Beeline Moto II Black"}},{"tipo":"sku_card","contenido":{"sku":"CHR_BLD3.0_GMG","numero":"02","titulo":"Beeline Moto II Gun Metal"}},{"tipo":"sku_card","contenido":{"sku":"CHR_BLD3.0_SVR","numero":"03","titulo":"Beeline Moto II Silver Metal"}}]$jsonb$::jsonb,
  ARRAY['CHR_BLD3.0_BLK', 'CHR_BLD3.0_GMG', 'CHR_BLD3.0_SVR']::text[],
  'motoii-vs-celular-01-vibraciones',
  '2026-09-08',
  'Tab "Por qué MOTO II"',
  true
)
on conflict (slug) do update set
  marca = excluded.marca,
  tipo = excluded.tipo,
  titulo = excluded.titulo,
  cuerpo = excluded.cuerpo,
  sku_relacionado = excluded.sku_relacionado,
  imagen_portada = excluded.imagen_portada,
  fecha_publicacion = excluded.fecha_publicacion,
  donde_se_muestra = excluded.donde_se_muestra,
  visible_publico = excluded.visible_publico,
  updated_at = now();
