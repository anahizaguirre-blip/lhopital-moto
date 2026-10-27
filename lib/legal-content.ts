/**
 * Contenido estático de las páginas legales (/legal/[slug]).
 *
 * Fuente única: "Legales lhopital.mx 2026 completo.pdf" (versión del
 * 26 de octubre de 2026). Si cambia el texto, cambia también
 * VERSION_TERMINOS para que el checkout guarde la versión aceptada.
 *
 * `texto` soporta **negritas** y [enlaces](/ruta) inline.
 */

/** Versión vigente de los legales; se guarda en cada orden como prueba de consentimiento. */
export const VERSION_TERMINOS = '2026-10-26';

const ACTUALIZACION = '26 de octubre de 2026';
const CONTACTO = 'contacto@lhopital.mx · +52 (55) 9462 1951';
const DOMICILIO =
  'Andador 5, 5C-31, Col. Alianza Popular Revolucionaria, Alcaldía Coyoacán, C.P. 04800, Ciudad de México';

import { LEGAL_RUTAS } from '@/lib/legal-rutas';

export { LEGAL_RUTAS };

export type LegalBloque =
  | { tipo: 'h2'; texto: string }
  | { tipo: 'h3'; texto: string }
  | { tipo: 'p'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'lista_num'; items: string[] }
  | { tipo: 'tabla'; encabezados: [string, string]; filas: [string, string][] };

export interface LegalDocumento {
  slug: string;
  titulo: string;
  ultimaActualizacion: string;
  cuerpo: LegalBloque[];
}

export const LEGAL_DOCUMENTOS: LegalDocumento[] = [
  // ──────────────────────────────────────────────────────────────────
  // 1. Aviso de privacidad
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'aviso-de-privacidad',
    titulo: 'Aviso de privacidad',
    ultimaActualizacion: ACTUALIZACION,
    cuerpo: [
      { tipo: 'h2', texto: 'Responsable' },
      {
        tipo: 'p',
        texto: `LHOPITAL, S.A. de C.V. (“Lhopital”), con domicilio en ${DOMICILIO}, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, publicada en el Diario Oficial de la Federación el 20 de marzo de 2025 (la “Ley”).`,
      },

      { tipo: 'h2', texto: 'Datos que recabamos' },
      {
        tipo: 'p',
        texto:
          'Recabamos únicamente los datos necesarios para atender tu compra o solicitud, cuando nos los proporcionas en www.lhopital.mx, por correo, por teléfono o en nuestro showroom:',
      },
      {
        tipo: 'lista',
        items: [
          '**Identificación y contacto:** nombre completo, correo electrónico y teléfono.',
          '**Entrega:** domicilio de envío.',
          '**Facturación, solo si solicitas factura:** RFC, nombre o razón social, régimen fiscal, código postal fiscal y Constancia de Situación Fiscal.',
          '**Compra:** productos adquiridos, número de pedido e historial de compras.',
          '**Citas en showroom:** marca o modelo de tu interés y fecha de la cita.',
        ],
      },
      { tipo: 'p', texto: 'No recabamos datos personales sensibles.' },
      {
        tipo: 'p',
        texto:
          '**Datos de pago.** Los pagos con tarjeta se procesan a través de Mercado Pago. Los datos de tu tarjeta se capturan directamente en el formulario seguro de Mercado Pago; Lhopital no recibe ni almacena el número completo de tu tarjeta ni su código de seguridad.',
      },

      { tipo: 'h2', texto: 'Finalidades' },
      { tipo: 'p', texto: '**Finalidades primarias** (necesarias para la relación contigo):' },
      {
        tipo: 'lista_num',
        items: [
          'Procesar, cobrar y entregar tu pedido, por envío o recolección en showroom.',
          'Emitir tu factura cuando la solicites.',
          'Atender dudas, cambios, devoluciones y garantías.',
          'Agendar y confirmar citas en showroom.',
          'Cumplir obligaciones legales, fiscales y requerimientos de autoridad.',
        ],
      },
      { tipo: 'p', texto: '**Finalidades secundarias** (no son necesarias para tu compra):' },
      {
        tipo: 'lista_num',
        items: [
          'Enviarte información sobre lanzamientos, promociones y eventos.',
          'Realizar encuestas de satisfacción y estudios estadísticos internos.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'Si no deseas que usemos tus datos para las finalidades secundarias, escríbenos a contacto@lhopital.mx con el asunto “No deseo publicidad”, o usa el enlace para darte de baja que incluye cada correo promocional. Tu negativa no afecta tus compras.',
      },

      { tipo: 'h2', texto: 'Con quién compartimos tus datos' },
      {
        tipo: 'p',
        texto: 'No vendemos tus datos personales. Los compartimos solo en la medida necesaria con:',
      },
      {
        tipo: 'lista',
        items: [
          'Mercado Pago, para procesar tu pago.',
          'Empresas de paquetería, para entregar tu pedido.',
          'Proveedores tecnológicos de hospedaje web, base de datos y envío de correos, que tratan los datos por cuenta de Lhopital y pueden tener servidores fuera de México.',
          'Autoridades competentes, cuando la ley lo exija.',
        ],
      },

      { tipo: 'h2', texto: 'Derechos ARCO y revocación del consentimiento' },
      {
        tipo: 'p',
        texto:
          'Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos (derechos ARCO), revocar tu consentimiento o limitar su uso y divulgación, enviando una solicitud a contacto@lhopital.mx que incluya: tu nombre, un medio para responderte, copia de una identificación oficial (o los documentos que acrediten la representación) y la descripción clara de los datos y del derecho que quieres ejercer. Responderemos dentro de los plazos que establece la Ley. El ejercicio de estos derechos es gratuito.',
      },
      {
        tipo: 'p',
        texto:
          'Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir ante la Secretaría Anticorrupción y Buen Gobierno, autoridad competente en la materia.',
      },

      { tipo: 'h2', texto: 'Cookies y almacenamiento en tu navegador' },
      {
        tipo: 'p',
        texto:
          'Usamos cookies y almacenamiento local de tu navegador para recordar los productos de tu carrito y para el funcionamiento básico de la tienda. Puedes desactivarlos desde la configuración de tu navegador, aunque el carrito podría dejar de funcionar.',
      },
      {
        tipo: 'p',
        texto:
          'Actualmente no utilizamos herramientas de analítica ni de publicidad de terceros. Si las incorporamos, actualizaremos este aviso.',
      },

      { tipo: 'h2', texto: 'Seguridad' },
      {
        tipo: 'p',
        texto:
          'Aplicamos medidas administrativas, técnicas y físicas para proteger tus datos contra daño, pérdida, alteración o acceso no autorizado. Solo el personal que los necesita para las finalidades descritas tiene acceso a ellos.',
      },

      { tipo: 'h2', texto: 'Consentimiento' },
      {
        tipo: 'p',
        texto:
          'Al comprar, la casilla de aceptación del checkout confirma que leíste este aviso y que consientes el tratamiento de tus datos para las finalidades primarias.',
      },

      { tipo: 'h2', texto: 'Cambios a este aviso' },
      {
        tipo: 'p',
        texto:
          'Cualquier cambio se publicará en [www.lhopital.mx/aviso-de-privacidad](/aviso-de-privacidad) con su fecha de actualización.',
      },

      { tipo: 'h2', texto: 'Contacto' },
      { tipo: 'p', texto: `${CONTACTO} · de 9:00 a 18:00 horas` },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 2. Términos y condiciones
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'terminos-y-condiciones',
    titulo: 'Términos y condiciones',
    ultimaActualizacion: ACTUALIZACION,
    cuerpo: [
      {
        tipo: 'p',
        texto: `Estos términos regulan el uso del sitio www.lhopital.mx (el “Sitio”) y la compra de productos a través de él. El titular del Sitio es LHOPITAL, S.A. de C.V. (“Lhopital”), con domicilio en ${DOMICILIO}.`,
      },

      { tipo: 'h2', texto: '1. Aceptación' },
      {
        tipo: 'p',
        texto:
          'Al navegar el Sitio aceptas estos términos. Para comprar, debes aceptarlos de forma expresa marcando la casilla correspondiente antes de pagar. Si no estás de acuerdo, abstente de usar el Sitio.',
      },

      { tipo: 'h2', texto: '2. Acceso al Sitio' },
      {
        tipo: 'p',
        texto:
          'El acceso es libre y gratuito, sin necesidad de registro. El Sitio está dirigido principalmente a personas que residen en México; si lo usas desde otro país, lo haces bajo tu responsabilidad, incluido el cumplimiento de tus leyes locales. Lhopital puede modificar, suspender o actualizar el contenido, los productos y el funcionamiento del Sitio en cualquier momento, y puede administrarlo directamente o a través de terceros, sin que esto altere estos términos.',
      },

      { tipo: 'h2', texto: '3. Quién puede comprar' },
      {
        tipo: 'p',
        texto:
          'Las compras están reservadas a personas mayores de 18 años con capacidad legal para contratar. Los menores de edad pueden navegar el Sitio, pero solo pueden comprar a través de su madre, padre o tutor.',
      },

      { tipo: 'h2', texto: '4. Productos, precios y disponibilidad' },
      {
        tipo: 'lista',
        items: [
          'Los precios se expresan en pesos mexicanos e incluyen IVA. El costo de envío se muestra por separado antes de pagar.',
          'Nuestro inventario es limitado. El producto se separa del inventario únicamente cuando el pago es aprobado.',
          'Las fotografías son ilustrativas; el color puede variar ligeramente según tu pantalla.',
          'Si después de tu pago un producto no está disponible, te avisaremos y te ofreceremos el reembolso total o, si lo prefieres, un producto alternativo.',
          'Si un precio se publica con un error evidente, te avisaremos antes del envío y podrás confirmar la compra al precio correcto o cancelarla con reembolso total.',
        ],
      },

      { tipo: 'h2', texto: '5. Pago' },
      {
        tipo: 'p',
        texto:
          'Aceptamos pago con tarjeta de crédito o débito, procesado por Mercado Pago. Los datos de tu tarjeta se capturan en el formulario seguro de Mercado Pago; Lhopital no recibe ni almacena el número completo de tu tarjeta. Tu pedido se confirma cuando el pago es aprobado y te enviamos la confirmación por correo.',
      },

      { tipo: 'h2', texto: '6. Entrega' },
      {
        tipo: 'p',
        texto: `Los costos, modalidades (envío a domicilio o recolección en showroom) y tiempos de entrega se detallan en nuestras [Políticas de entrega](${LEGAL_RUTAS.entrega}).`,
      },

      { tipo: 'h2', texto: '7. Cambios, devoluciones y garantías' },
      {
        tipo: 'p',
        texto: `Se rigen por nuestra [Política de devoluciones](${LEGAL_RUTAS.devoluciones}), que incluye la póliza de garantía de cada producto.`,
      },

      { tipo: 'h2', texto: '8. Facturación' },
      {
        tipo: 'p',
        texto:
          'Puedes solicitar tu factura dentro de los 5 días naturales siguientes a la recepción de tu pedido, escribiendo a factura@lhopital.mx con tu número de pedido, tu Constancia de Situación Fiscal y el uso de CFDI.',
      },

      { tipo: 'h2', texto: '9. Datos personales' },
      {
        tipo: 'p',
        texto: `El tratamiento de tus datos se rige por nuestro [Aviso de privacidad](${LEGAL_RUTAS.privacidad}), disponible en www.lhopital.mx/aviso-de-privacidad.`,
      },

      { tipo: 'h2', texto: '10. Uso permitido' },
      { tipo: 'p', texto: 'Te comprometes a usar el Sitio de forma lícita. Está prohibido, entre otros:' },
      {
        tipo: 'lista',
        items: [
          'Usar software que automatice la interacción con el Sitio o la descarga de su contenido.',
          'Proporcionar información falsa o comprar con medios de pago que no te pertenecen.',
          'Interferir con la seguridad o el funcionamiento del Sitio, o cargar código malicioso.',
          'Recopilar datos personales de terceros sin su consentimiento.',
          'Infringir derechos de propiedad intelectual de Lhopital o de terceros.',
        ],
      },
      {
        tipo: 'p',
        texto: 'Lhopital puede restringir el acceso o cancelar pedidos de quien incumpla estas reglas.',
      },

      { tipo: 'h2', texto: '11. Propiedad intelectual' },
      {
        tipo: 'p',
        texto:
          'El diseño, código, textos, fotografías y logotipos de Lhopital son propiedad de Lhopital o se usan con autorización. Hedon, Beeline y Moto II son marcas de sus respectivos titulares; Lhopital las comercializa como distribuidor en México. Queda prohibido reproducir el contenido del Sitio con fines comerciales sin autorización por escrito. Si consideras que algún contenido infringe tus derechos, escríbenos a contacto@lhopital.mx.',
      },

      { tipo: 'h2', texto: '12. Enlaces a terceros' },
      {
        tipo: 'p',
        texto:
          'El Sitio puede incluir enlaces o contenido de terceros, como redes sociales. Lhopital no controla esos sitios ni es responsable de su contenido ni de sus políticas de privacidad.',
      },

      { tipo: 'h2', texto: '13. Responsabilidad' },
      {
        tipo: 'p',
        texto:
          'Lhopital procura que el Sitio funcione de forma continua y segura, pero no puede garantizar que esté libre de interrupciones o errores técnicos. Lhopital no será responsable por:',
      },
      {
        tipo: 'lista',
        items: [
          'Interrupciones del Sitio por mantenimiento, fallas de terceros o causas de fuerza mayor.',
          'Daños derivados del uso del Sitio contrario a estos términos.',
          'Daños derivados del uso de los productos en condiciones distintas a las indicadas por el fabricante.',
        ],
      },
      {
        tipo: 'p',
        texto: 'Nada en estos términos limita los derechos que te otorga la Ley Federal de Protección al Consumidor.',
      },

      { tipo: 'h2', texto: '14. Cambios a estos términos' },
      {
        tipo: 'p',
        texto:
          'Lhopital puede actualizar estos términos. La versión vigente es la publicada en el Sitio con su fecha de actualización; cada compra se rige por la versión vigente al momento de pagar.',
      },

      { tipo: 'h2', texto: '15. Legislación y jurisdicción' },
      {
        tipo: 'p',
        texto:
          'Estos términos se rigen por las leyes de México. Cualquier controversia se resolverá ante los tribunales de la Ciudad de México, sin perjuicio de tu derecho a acudir a la Procuraduría Federal del Consumidor (PROFECO).',
      },

      { tipo: 'h2', texto: 'Contacto' },
      { tipo: 'p', texto: CONTACTO },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 3. Políticas de entrega
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'politicas-de-entrega',
    titulo: 'Políticas de entrega',
    ultimaActualizacion: ACTUALIZACION,
    cuerpo: [
      { tipo: 'h2', texto: 'Cobertura' },
      { tipo: 'p', texto: 'Enviamos a toda la República Mexicana.' },

      { tipo: 'h2', texto: 'Modalidades y costos' },
      {
        tipo: 'tabla',
        encabezados: ['Modalidad', 'Costo'],
        filas: [
          ['Envío a domicilio, pedido que incluye al menos un casco', '$400 MXN'],
          ['Envío a domicilio, pedido sin casco (Moto II, accesorios o Tees)', '$200 MXN'],
          ['Recolección en showroom, Ciudad de México', 'Sin costo'],
        ],
      },
      {
        tipo: 'p',
        texto:
          'El costo de envío es por pedido, sin importar cuántos productos incluya, y se muestra antes de pagar.',
      },

      { tipo: 'h2', texto: 'Tiempos de entrega' },
      {
        tipo: 'lista',
        items: [
          '**Productos en stock:** hasta 30 días naturales a partir de la confirmación de tu pago. El tiempo real depende de la paquetería y de tu código postal; normalmente va de 2 a 20 días.',
          '**Productos bajo pedido:** hasta 90 días naturales a partir de la confirmación de tu pago.',
        ],
      },
      { tipo: 'p', texto: 'La página de cada producto indica si está en stock o bajo pedido.' },

      { tipo: 'h2', texto: 'Recolección en showroom' },
      {
        tipo: 'lista',
        items: [
          'Te avisaremos por correo cuando tu pedido esté listo para recoger.',
          'Puedes recogerlo en nuestro showroom: Pedro Sainz de Baranda 139, Edificio T, Locación 25, Col. Los Cipreses, Alcaldía Coyoacán, C.P. 04830, Ciudad de México, de lunes a viernes de 11:00 a 14:00 y de 16:00 a 19:00 horas, y sábados de 11:00 a 14:00 horas, [previa cita](/citas).',
          'Presenta tu número de pedido e identificación oficial. Si otra persona recoge por ti, avísanos antes por correo con su nombre; deberá presentar identificación oficial.',
          'Tienes 10 días naturales para recogerlo a partir del aviso. Pasado ese plazo, te contactaremos para coordinar la entrega o el envío, con el costo que aplique.',
        ],
      },

      { tipo: 'h2', texto: 'Seguimiento' },
      {
        tipo: 'p',
        texto:
          'Cuando tu pedido salga, te enviaremos por correo el nombre de la paquetería y el número de guía para que lo rastrees.',
      },

      { tipo: 'h2', texto: 'Dirección de entrega' },
      {
        tipo: 'p',
        texto:
          'Enviamos exclusivamente a la dirección capturada en tu pedido; revísala antes de pagar. Si la paquetería no puede entregar por una dirección incorrecta o incompleta, el costo del reenvío corre por tu cuenta.',
      },

      { tipo: 'h2', texto: 'Recepción del pedido' },
      {
        tipo: 'p',
        texto:
          'Revisa tu paquete al recibirlo. Si la caja llega visiblemente dañada o el contenido no corresponde a tu pedido, escríbenos a contacto@lhopital.mx dentro de las 48 horas siguientes, con fotografías y tu número de pedido.',
      },

      { tipo: 'h2', texto: 'Retrasos, pérdida o daño en tránsito' },
      {
        tipo: 'p',
        texto:
          'Una vez enviado, la paquetería es responsable de cumplir con la entrega. Si hay un retraso, pérdida o daño, escríbenos a contacto@lhopital.mx: daremos seguimiento con la paquetería y te mantendremos informado hasta resolverlo.',
      },

      { tipo: 'h2', texto: 'Cancelaciones' },
      {
        tipo: 'p',
        texto:
          'Puedes cancelar tu pedido sin costo mientras no haya sido enviado ni entregado en showroom, escribiendo a contacto@lhopital.mx. Te reembolsaremos el total a la misma tarjeta con la que pagaste.',
      },

      { tipo: 'h2', texto: 'Contacto' },
      { tipo: 'p', texto: CONTACTO },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 4. Política de devoluciones y garantías
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'politica-de-devoluciones',
    titulo: 'Política de devoluciones y garantías',
    ultimaActualizacion: ACTUALIZACION,
    cuerpo: [
      { tipo: 'h2', texto: 'Derecho a revocar tu compra' },
      {
        tipo: 'p',
        texto:
          'Como compraste por internet, tienes 5 días hábiles a partir de que recibes tu pedido para revocar tu compra sin responsabilidad, conforme al artículo 56 de la Ley Federal de Protección al Consumidor. El producto debe regresar en las condiciones en que lo recibiste.',
      },

      { tipo: 'h2', texto: 'Devoluciones' },
      {
        tipo: 'p',
        texto:
          'Además, puedes solicitar la devolución de cualquier producto dentro de los 14 días naturales siguientes a su recepción, indicando el motivo, siempre que:',
      },
      {
        tipo: 'lista',
        items: [
          'El producto esté nuevo y sin uso, con sus etiquetas, accesorios, manuales y empaque original, sin rayones, suciedad ni etiquetas ajenas.',
          '**Cascos:** solo se aceptan sin uso, con sus películas o plásticos de protección y etiquetas originales. Es una medida de higiene y, sobre todo, de seguridad: un casco es equipo de protección y no podemos revender uno que pudo haber sido usado o golpeado.',
          '**Tees:** sin lavar ni usar.',
        ],
      },

      { tipo: 'h3', texto: 'Cambios de talla en Tees' },
      {
        tipo: 'p',
        texto:
          'Puedes cambiar una Tee por otra talla una sola vez, solicitándolo dentro de los 3 días naturales siguientes a la recepción, con tu número de pedido y fotografías de la prenda. Sujeto a disponibilidad.',
      },

      { tipo: 'h3', texto: 'Productos en oferta' },
      {
        tipo: 'p',
        texto:
          'En productos en oferta, los cambios y devoluciones proceden únicamente en los términos del artículo 56 de la Ley Federal de Protección al Consumidor. La garantía por defecto de fabricación aplica igual que en cualquier otro producto.',
      },

      { tipo: 'h3', texto: 'Costos de envío' },
      {
        tipo: 'lista',
        items: [
          '**Devolución o cambio por decisión del cliente:** el envío de regreso corre por tu cuenta.',
          '**Producto equivocado** (no corresponde a tu pedido): Lhopital cubre el envío de regreso y el envío del producto correcto. Avísanos dentro de las 48 horas siguientes a la recepción.',
        ],
      },

      { tipo: 'h3', texto: 'Reembolsos' },
      {
        tipo: 'p',
        texto:
          'Los reembolsos se hacen a la misma tarjeta con la que pagaste; no hacemos reembolsos en efectivo. Los emitimos una vez que recibimos y revisamos el producto. El tiempo en que se refleja en tu estado de cuenta depende de tu banco.',
      },

      { tipo: 'h3', texto: 'Cómo solicitarlo' },
      {
        tipo: 'p',
        texto:
          'Escribe a contacto@lhopital.mx con tu número de pedido, el motivo y fotografías del producto. Te responderemos con las instrucciones de envío.',
      },

      { tipo: 'h2', texto: 'Póliza de garantía' },
      {
        tipo: 'p',
        texto:
          'LHOPITAL, S.A. de C.V. garantiza los productos que vende en www.lhopital.mx y a través de sus distribuidores autorizados contra defectos de fabricación, a partir de la fecha de entrega:',
      },
      {
        tipo: 'tabla',
        encabezados: ['Producto', 'Garantía'],
        filas: [
          ['Beeline Moto II', '12 meses'],
          ['Cascos Hedon', '6 meses'],
          ['Lhopital Tees', '90 días'],
        ],
      },

      { tipo: 'h3', texto: 'Qué no cubre' },
      {
        tipo: 'lista',
        items: [
          'Uso del producto en condiciones distintas a las normales o sin seguir su instructivo.',
          'Productos alterados o reparados por personas no autorizadas por Lhopital o por el fabricante.',
          'Daño físico: golpes, caídas, rayones, piezas rotas, circuitos quemados o sellos de garantía violados.',
          'Desgaste normal por uso.',
          '**Cascos que hayan sufrido un impacto o caída.** Un casco golpeado puede perder su capacidad de protección aunque no se vea dañado; recomendamos reemplazarlo.',
          '**Tees** lavadas o cuidadas sin seguir las indicaciones de su etiqueta.',
        ],
      },

      { tipo: 'h3', texto: 'Cómo hacer válida la garantía' },
      {
        tipo: 'lista_num',
        items: [
          'Escribe a contacto@lhopital.mx con tu número de pedido o comprobante de compra, una descripción de la falla y fotografías o video.',
          'Lhopital hará una revisión preliminar. Si la falla parece cubierta, te pediremos enviar el producto completo, con su caja, manuales, cables y accesorios originales.',
          'El envío del producto a revisión corre por tu cuenta. Empácalo adecuadamente: si llega dañado por un mal empaque, te lo notificaremos con fotografías y ese daño no estará cubierto.',
          'Recibir el producto para revisión física no implica que la garantía proceda; lo confirmaremos después de revisarlo.',
        ],
      },

      { tipo: 'h3', texto: 'Qué hacemos si procede' },
      {
        tipo: 'p',
        texto:
          'Lhopital reparará el producto sin costo de piezas ni mano de obra o, si no es posible, lo reemplazará por uno igual o de características similares. Si no hay disponibilidad, te reembolsaremos el precio pagado. Lhopital cubre el envío de regreso del producto reparado o reemplazado. El proceso puede tomar hasta 90 días naturales, según la disponibilidad de piezas o inventario.',
      },

      { tipo: 'h2', texto: 'Contacto' },
      { tipo: 'p', texto: CONTACTO },
    ],
  },
];

export function getLegalDocumento(slug: string): LegalDocumento | undefined {
  return LEGAL_DOCUMENTOS.find((doc) => doc.slug === slug);
}
