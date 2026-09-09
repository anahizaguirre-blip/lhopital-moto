/**
 * Contenido estático de las páginas legales (/legal/[slug]).
 *
 * No usa Supabase a propósito: son documentos que casi no cambian, y no
 * hay ninguna necesidad editorial de mantenerlos en el CMS de contenido
 * de marca. `texto` soporta **negritas** inline con la misma sintaxis
 * ligera que ya usa el resto del sitio para bloques de texto.
 */

export type LegalBloque =
  | { tipo: 'h2'; texto: string }
  | { tipo: 'h3'; texto: string }
  | { tipo: 'p'; texto: string }
  | { tipo: 'lista'; items: string[] };

export interface LegalDocumento {
  slug: string;
  titulo: string;
  ultimaActualizacion: string;
  cuerpo: LegalBloque[];
}

export const LEGAL_DOCUMENTOS: LegalDocumento[] = [
  // ──────────────────────────────────────────────────────────────────
  // 1. Aviso de Privacidad
  // ──────────────────────────────────────────────────────────────────
  // Nota: el documento original termina con un párrafo de consentimiento
  // tipo checkbox ("reconozco que he leído y entiendo los alcances...")
  // pensado para un formulario de compra/registro. Se omite aquí a
  // propósito — no aplica a una página informativa pasiva — y se
  // reserva ese lenguaje para el checkout cuando exista.
  {
    slug: 'aviso-de-privacidad',
    titulo: 'Aviso de Privacidad',
    ultimaActualizacion: '07 de enero de 2025',
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'En "LHOPITAL S.A. DE C.V." la información de nuestros clientes y potenciales clientes es tratada de forma estrictamente confidencial, por lo que hacemos un esfuerzo permanente para salvaguardarla.',
      },
      {
        tipo: 'p',
        texto:
          'En cumplimiento con lo establecido por la Ley Federal de Protección de Datos Personales en Posesión de Particulares publicada en el Diario Oficial de la Federación el día 5 de julio de 2010, extiende y hace de su conocimiento para todos los fines legales a que haya lugar, el presente Aviso de Privacidad de Datos Personales.',
      },
      {
        tipo: 'p',
        texto:
          'Al ingresar y utilizar la página de internet, cuyo nombre de dominio es: www.lhopital.mx, usted declara que está aceptando los términos y las condiciones contenidos en este aviso y declara y otorga, expresamente, su aceptación y consentimiento utilizando al efecto el medio electrónico. En caso contrario deberá abstenerse de compartir cualquier tipo de información a "LHOPITAL S.A. DE C.V." por cualquier medio.',
      },
      {
        tipo: 'p',
        texto:
          'Para el caso que el titular continúe en el uso de www.lhopital.mx, sea en forma total o parcial, dicha acción se considerará como su absoluta y expresa aceptación a los términos y condiciones aquí estipuladas.',
      },
      {
        tipo: 'p',
        texto:
          'La sola utilización de la página de internet registrada implica la plena e incondicional aceptación de todas y cada una de las condiciones generales y particulares incluidas en este aviso de privacidad en la versión publicada, en el momento mismo en que el titular acceda a la página.',
      },
      { tipo: 'h2', texto: 'Datos personales y forma de recabarse' },
      {
        tipo: 'p',
        texto:
          'La recolección de Datos Personales se efectúa cumpliendo con todos los principios que marca la Ley, como son la licitud, calidad, consentimiento, información, finalidad, lealtad, proporcionalidad y responsabilidad.',
      },
      {
        tipo: 'p',
        texto:
          '"LHOPITAL S.A. DE C.V." recabará de usted los datos personales que sean necesarios para la adecuada prestación de nuestros servicios (I) directamente de usted, (II) a través de terceros que realicen compras en su nombre, siempre y cuando usted haya otorgado su consentimiento expreso para tal efecto. Dichos datos personales podrán incluir la siguiente información: nombre completo, género, edad, número de CURP, Registro Federal de Contribuyentes, IFE y/o INE, y/o documento oficial de identificación, datos de contacto, tales como dirección, teléfono particular, de oficina, celular y correo electrónico, entre otros, y que usted libremente proporcione.',
      },
      {
        tipo: 'p',
        texto:
          'Es importante que Usted tenga en cuenta que de no contar con sus Datos Personales no estaríamos en posibilidad de llevar a cabo los fines para los cuales se requieren y, en tal caso, no tendríamos ningún tipo de responsabilidad para la debida consecución de estos.',
      },
      { tipo: 'h2', texto: 'Finalidades y transferencia de los datos personales' },
      {
        tipo: 'p',
        texto:
          'Más que una política, en "LHOPITAL S.A. DE C.V." tenemos la filosofía de mantener una relación estrecha y activa con nuestros clientes. Al proporcionar sus datos personales, usted consiente su tratamiento tanto dentro, como fuera, de los Estados Unidos Mexicanos y entiende que podrán ser tratados directa o indirectamente por "LHOPITAL S.A. DE C.V." y/o sus terceros proveedores de servicios, incluyendo paqueterías y proveedores, por mencionar alguno, más no limitativamente; así como, en su caso autoridades competentes, con las siguientes finalidades (l) carta bienvenida, (ll) identificación, (lll) para proveer los servicios y productos que ha solicitado, (IV) ofrecerle productos o servicios, (V) encuestas de satisfacción, (VI) dar cumplimiento a requerimientos legales, controles administrativos, (VII) publicidad, (VIII) prospección comercial, (IX) realizar actividades de mercadeo y promoción en general relacionados con los productos de "LHOPITAL S.A. DE C.V.", (X) realizar estudios estadísticos y de mercadeo, análisis diversos, envío de productos, (XI) mantener actualizados nuestra base de datos para poder responder a sus consultas, invitarle a eventos, hacer válidas la garantía de los productos o cualquier otro programa similar de "LHOPITAL S.A. DE C.V.", hacer de su conocimiento las promociones y lanzamientos de "LHOPITAL S.A. DE C.V.", mantener comunicación en general, así como, dar seguimiento a nuestra relación comercial. "LHOPITAL S.A. DE C.V." podrá transferir sus datos personales a cualquiera de sus distintos proveedores, con la finalidad de realizar encuestas de satisfacción, estudios de mercado, administración de bases de datos de correos electrónicos, entre otros fines similares; en consecuencia, usted acepta que quedará vinculado a los términos y condiciones del aviso de privacidad de "LHOPITAL S.A. de C.V.", disponible en www.lhopital.mx, y por lo cual consiente y autoriza a nosotros a delegar las autorizaciones y compartir la información que usted provee con nuestro(s) tercero(s) Proveedor(es) de Servicios en la medida necesaria para el cumplimiento de los términos del presente aviso.',
      },
      {
        tipo: 'p',
        texto:
          'Para prevenir el acceso no autorizado a sus datos personales y con el fin de asegurar que la información sea utilizada para los fines establecidos en este Aviso de Privacidad, hemos establecido procedimientos físicos, electrónicos y administrativos, utilizando tecnologías avanzadas que limitan el uso o divulgación de sus datos, permitiéndonos tratarlos debidamente. Así mismo, puede tener la confianza que sus datos personales serán tratados, exclusivamente, por aquellas personas que requieran del conocimiento de dichos datos para los fines objeto del presente aviso.',
      },
      {
        tipo: 'h2',
        texto:
          'Solicitud de acceso, rectificación, cancelación u oposición de datos personales y revocación del consentimiento (Solicitud ARCO)',
      },
      {
        tipo: 'p',
        texto:
          'Todos sus datos personales son tratados de acuerdo a la legislación aplicable y vigente en el país, por ello le informamos que usted tiene en todo momento el derecho de acceder, rectificar, cancelar u oponerse al tratamiento que le damos a sus datos personales (los "Derechos ARCO"), así como, revocar el consentimiento otorgado para el tratamiento de los mismos; derecho que podrá hacer valer a través del Centro de Atención al Clientes de "LHOPITAL S.A. DE C.V.", en su teléfono: 55 9462 1951 (solo llamadas, no cuenta con WhatsApp) o por medio de su correo electrónico: contacto@lhopital.mx',
      },
      {
        tipo: 'p',
        texto:
          'A través de estos canales usted podrá actualizar sus datos y especificar el medio por el cual desea recibir información, ya que, en caso de no contar con esta especificación de su parte, "LHOPITAL S.A. DE C.V.", establecerá el canal que considere pertinente para enviarle información. Le pedimos que considere que (i) por su protección y beneficio, es posible que le solicitemos documentación que acredite las correcciones a los datos que deseé acceder, rectificar y/o cancelar o aquellos a los que desee oponerse, (ii) es posible que "LHOPITAL S.A. DE C.V.", no pueda cancelar o bloquear la totalidad de sus datos personales de conformidad con las leyes que le sean aplicables, y (iii) el ejercicio de sus Derechos ARCO es gratuito.',
      },
      {
        tipo: 'p',
        texto:
          'Asimismo, usted tiene derecho a iniciar un procedimiento de protección de derechos ante el Instituto Federal de Acceso a la Información y Protección de Datos (IFAI), siempre y cuando reúna los requisitos señalados en la legislación aplicable y vigente, en los casos siguientes: (a) cuando "LHOPITAL S.A. DE C.V." no responda a su solicitud para ejercer sus Derechos ARCO dentro de los 20 días siguientes de haberla recibido, o (b) dentro de los 15 días siguientes de haber recibido una respuesta por parte de "LHOPITAL S.A. DE C.V.", pero ésta no cumpla con lo establecido en la legislación aplicable y vigente en materia de protección de datos personales.',
      },
      {
        tipo: 'p',
        texto:
          'De igual forma, usted tiene el derecho de solicitar en cualquier momento la limitación del uso y divulgación de sus Datos Personales, salvo que no sea procedente en términos de la Normatividad Aplicable, lo cual haríamos de su conocimiento en nuestra respuesta a su solicitud de limitación. Para efectos de lo anterior, deberá dirigirnos su respectiva solicitud por escrito, siguiendo el mismo procedimiento establecido en el presente Aviso de Privacidad para el ejercicio de los Derechos ARCO, con la diferencia de que requeriremos una descripción clara y precisa de los datos respecto de los cuales busca limitar su uso y divulgación y anexar en su caso los documentos que justifiquen su petición, recibido el escrito, tendremos 5 días hábiles para analizar, atender y enviarle la respuesta correspondiente. El medio por el cual le enviaremos nuestra respuesta será aquel que nos sea indicado por usted en su solicitud o, en su defecto, por el mismo medio por el cual nos hizo llegar su escrito.',
      },
      {
        tipo: 'p',
        texto:
          '**Cookies:** Utilizamos cookies en nuestro sitio de forma temporal durante el proceso de su experiencia de compra. Las cookies son pequeños archivos descargados a su computadora para rastrear movimientos dentro de sitios web. Las cookies enlazan a la información en relación con los elementos que ha seleccionado para su compra en nuestra tienda o en las páginas que se han visitado. Esta información se utiliza para realizar un seguimiento de su carrito de compras. La mayoría de los navegadores están configurados para aceptar cookies de forma automática cada vez que visita un sitio web. Puedes desactivar las cookies o configurar su navegador para que le avise cuando se envíen cookies. Sin embargo, algunas áreas de nuestros sitios no funcionarán correctamente si lo hace ya que ha completado la compra las cookies se borrarán y la bolsa de las compras estarán vacíos de nuevo.',
      },
      {
        tipo: 'p',
        texto:
          'Este aviso de privacidad podrá ser modificado de tiempo en tiempo por "LHOPITAL S.A. DE C.V.". Dichas modificaciones serán oportunamente informadas a través de nuestra página en Internet www.lhopital.mx o cualquier otro medio de comunicación oral, impreso o electrónico que "LHOPITAL S.A. DE C.V." determine para tal efecto.',
      },
      {
        tipo: 'p',
        texto:
          '"LHOPITAL S.A. DE C.V." es una sociedad de nacionalidad mexicana con domicilio (s) en: Andador 5, 5C-31, Alianza Popular Revolucionaria, Coyoacán, CDMX, 04800. Para cualquier duda o aclaración, así como para el ejercicio de sus Derechos ARCO, favor de comunicarse al Centro de Atención al Cliente, en su teléfono: 55 9462 1951 (solo llamadas, no cuenta con WhatsApp) con los horarios de atención 9 am a 6 pm o por medio de su correo electrónico: contacto@lhopital.mx',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 2. Términos y Condiciones
  // ──────────────────────────────────────────────────────────────────
  // PENDIENTE: el documento original (202501_TÉRMINOS_Y_CONDICIONES.docx,
  // 16 cláusulas PRIMERA–DÉCIMA SEXTA) no venía adjunto al brief y no
  // se encontró en el equipo. Esta página existe (no es un 404) pero
  // lleva un aviso explícito en vez de contenido inventado — nadie debe
  // publicar cláusulas legales que nadie escribió. Reemplazar este
  // bloque por el texto íntegro en cuanto Anahí lo comparta.
  {
    slug: 'terminos-y-condiciones',
    titulo: 'Términos y Condiciones',
    ultimaActualizacion: '07 de enero de 2025',
    cuerpo: [
      {
        tipo: 'p',
        texto:
          '**Esta página está en preparación.** El documento fuente (16 cláusulas) todavía no se ha integrado a este sitio — escríbenos a contacto@lhopital.mx si necesitas el texto completo mientras tanto.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 3. Políticas de Entrega
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'politicas-de-entrega',
    titulo: 'Políticas de Entrega',
    ultimaActualizacion: '07 de enero de 2025',
    cuerpo: [
      { tipo: 'h2', texto: 'Políticas de ventas' },
      {
        tipo: 'p',
        texto:
          'Al momento de realizar un pedido nos reservamos el derecho a separar de nuestro inventario el producto o productos ordenados. Esto se hará, EXCLUSIVAMENTE, después de recibir su pago o confirmar su compra.',
      },
      {
        tipo: 'p',
        texto:
          'En caso de haber un problema que requiera un considerable intervalo de tiempo, nuestro personal de ATENCIÓN A CLIENTES se pondrá en contacto inmediatamente con nuestro CLIENTE, según sea el caso.',
      },
      {
        tipo: 'p',
        texto:
          'En venta de productos denominados y que se especifiquen como "ESPECIALES" el tiempo de envío estará sujeto a las condiciones especificadas en la oferta.',
      },
      {
        tipo: 'p',
        texto:
          'TODOS nuestros productos son NUEVOS e incluyen una etiqueta codificada, esto con el fin de facilitar el procedimiento de GARANTÍA de la pieza en caso de que fuese necesaria (ver Política de Devoluciones).',
      },
      {
        tipo: 'p',
        texto:
          'Todos nuestros productos INCLUYEN diferentes TIEMPOS DE ENVÍO (48hrs, 72hrs o más, dependiendo el código postal), y se consideran únicamente días hábiles.',
      },
      {
        tipo: 'p',
        texto:
          'Una vez enviado el pedido, es responsabilidad plena de la paquetería cumplir con los tiempos mencionados. Nuestros CLIENTES pueden rastrear personalmente su paquete con el número de guía y paquetería que para tal efecto les será proporcionado.',
      },
      {
        tipo: 'p',
        texto:
          'NO nos hacemos responsables en caso de que se experimente un retraso por parte de la paquetería. Sin embargo, respaldamos su compra y le asistiremos en caso de que se presente algún inconveniente en la entrega de su pedido.',
      },
      {
        tipo: 'p',
        texto:
          'En caso de que se presente algún retraso en la entrega o envío de su pedido, es responsabilidad de nuestro CLIENTE ponerse en contacto con nosotros. Estamos a su servicio a través de nuestro correo electrónico contacto@lhopital.mx donde, rápidamente, le atenderemos. Los pedidos serán enviados, EXCLUSIVAMENTE, a la dirección especificada en los datos de ENVÍO que notifique el pedido.',
      },
      { tipo: 'h2', texto: 'Envíos, pérdida o daño' },
      {
        tipo: 'p',
        texto:
          'Una vez enviado el pedido, es responsabilidad plena de la paquetería cumplir con la entrega en el tipo de envío que nuestros clientes hayan elegido, por lo que es responsabilidad plena de dicha paquetería la entrega de su pedido, no nos hacemos responsables en caso de algún evento con la paquetería; sin embargo, le podremos asistir en caso de que se presente algún inconveniente en la entrega de su pedido y será responsabilidad del cliente ponerse en contacto con EL TITULAR en el correo electrónico contacto@lhopital.mx',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // 4. Política de Devoluciones
  // ──────────────────────────────────────────────────────────────────
  {
    slug: 'politica-de-devoluciones',
    titulo: 'Política de Devoluciones',
    ultimaActualizacion: '07 de enero de 2025',
    cuerpo: [
      { tipo: 'h2', texto: 'Cambios y/o devoluciones' },
      {
        tipo: 'p',
        texto:
          'EL CLIENTE podrá solicitar la devolución dentro del término de 14 (catorce) días contados a partir de la recepción del producto, indicando el motivo de la devolución.',
      },
      {
        tipo: 'p',
        texto:
          'En devoluciones y cambios los gastos de envío que se generen deberán ser cubiertos por el adquiriente.',
      },
      { tipo: 'p', texto: 'No se realizarán cambios en caso de que:' },
      {
        tipo: 'lista',
        items: [
          'El empaque o las cajas tengan etiquetas no originales, dichos empaques estén rayados, sucios o maltratados.',
          'La prenda a realizar el cambio deberá de estar en el estado de NUEVA que fue recibida, NO lavada o usada, lo anterior por razones de higiene y salud.',
          'En ofertas no proceden cambios ni devoluciones.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'En caso de recibir una prenda/artículo que considere incorrecta a lo solicitado, deberá de inmediato notificarlo al correo electrónico contacto@lhopital.mx',
      },
      {
        tipo: 'p',
        texto:
          'Respecto de las prendas de vestir, podrán realizarse cambios por razón de talla y únicamente por una ocasión, de acuerdo con lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          'El cambio deberá de ser solicitado dentro del término de 3 (tres) días naturales una vez recibido el producto y proporcionando datos de la compra, tales como número de pedido, etc.',
          'El producto deberá de ser enviado/devuelto en su empaque original.',
          'No se realizarán reembolsos en efectivo.',
          'Se deberán de enviar fotografías de la prenda a devolver al correo electrónico contacto@lhopital.mx',
        ],
      },
      { tipo: 'h2', texto: 'Póliza de garantía' },
      {
        tipo: 'p',
        texto:
          'Esta garantía limitada es aplicable solamente a productos de las marcas Lhopital o Beeline comercializados por Lhopital S.A. de C.V. y/o por sus distribuidores nacionales autorizados.',
      },
      {
        tipo: 'p',
        texto:
          'Las prendas de vestir tienen 3 (tres) días naturales a partir de la recepción del producto contra cualquier DEFECTO DE FABRICACIÓN.',
      },
      {
        tipo: 'p',
        texto:
          'Lhopital S.A. de C.V. garantiza el funcionamiento de sus equipos de la marca Beeline, por el periodo comprendido de 30 (treinta) días naturales, contra cualquier defecto de fabricación a partir de la fecha de entrega del producto, bajo las siguientes:',
      },
      { tipo: 'h3', texto: 'Excepciones' },
      {
        tipo: 'lista',
        items: [
          'Cuando el producto se hubiese utilizado en condiciones distintas a las normales.',
          'Cuando el producto no hubiese sido operado de acuerdo con el instructivo de uso que se le acompaña.',
          'Cuando el producto hubiese sido alterado o reparado por personas no autorizadas por el fabricante nacional, importador o comercializador responsable respectivo.',
        ],
      },
      { tipo: 'h3', texto: 'Requisitos para tramitar garantía' },
      {
        tipo: 'p',
        texto:
          'Mandar foto del producto a garantía a través del correo electrónico contacto@lhopital.mx y detallar la falla.',
      },
      {
        tipo: 'p',
        texto:
          'Una vez que el equipo de EL USUARIO verifique visualmente (sujeta a revisión física) y determine que aplica la garantía, deberá realizar el envío del producto, incluyendo: copia de la factura y/o comprobante de compra, así como MANUALES, CAJA, CABLES, ETC., que incluya el producto original. EL USUARIO le generará una guía de paquetería designada por ella misma.',
      },
      { tipo: 'h3', texto: 'Validez e invalidez de las garantías' },
      {
        tipo: 'p',
        texto:
          'El producto es aceptado para revisión física y no implica la aceptación de este como una devolución o como un compromiso para aceptar la garantía:',
      },
      {
        tipo: 'lista',
        items: [
          'Sólo se harán válidas las garantías por defecto del fabricante, NO POR DAÑO FÍSICO (productos quebrados, rayados, con circuitos quemados, sellos de garantía violados o intervenidos).',
          'Si el empaque que utilizó para enviar el producto a garantía no fue el adecuado y el producto llega físicamente dañado, se procederá a notificarle por medio del correo con fotografías del daño presentado.',
          'En el caso de los navegadores todo artículo a garantía está sujeto a revisión y disponibilidad de Stock, en caso de que no se encuentre disponible, las garantías pueden llegar a tardar hasta 90 días para ser reembolsadas.',
          'En el caso de prendas de vestir, la garantía está sujeta a revisión y disponibilidad de Stock, en caso de que no se encuentre disponible el producto en la talla requerida, se le ofrecerá otro diseño en la talla deseada, las garantías pueden llegar a tardar hasta 60 días.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'Durante la vigencia de esta garantía, Lhopital S.A. de C.V. se compromete a reparar o en su defecto cambiar el producto por otro igual o de características similares, cuando el producto presente falla imputable a la fabricación del mismo, así como las piezas y componentes que se llegarán a requerir sin ningún cargo para el consumidor, y cubrir los gastos necesarios erogados que se deriven de la transportación del producto una vez que este ha sido entregado a la red de Centros de Servicio Autorizado.',
      },
      {
        tipo: 'p',
        texto:
          'Las refacciones y partes utilizadas para la reparación del aparato no tendrán ningún costo para el cliente, siempre y cuando el período de garantía estipulado en la presente póliza no se haya terminado. Esta garantía no incluye la instalación y el mantenimiento del equipo, de igual manera no cubre daños o reparaciones necesarias como consecuencia de fallas en la instalación del equipo.',
      },
    ],
  },
];

export function getLegalDocumento(slug: string): LegalDocumento | undefined {
  return LEGAL_DOCUMENTOS.find((doc) => doc.slug === slug);
}
