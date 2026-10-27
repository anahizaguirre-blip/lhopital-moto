/**
 * Validación del checkout — la usan el formulario (mensajes en vivo) y
 * /api/checkout (la que manda). Precios y envío nunca vienen del cliente.
 */

import { z } from 'zod';

export const ESTADOS_MX = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
] as const;

const texto = (min: number, max: number, msg: string) =>
  z.string().trim().min(min, msg).max(max, `Máximo ${max} caracteres`);

export const DireccionSchema = z.object({
  calle: texto(3, 160, 'Escribe calle y número'),
  colonia: texto(2, 120, 'Escribe la colonia'),
  cp: z.string().trim().regex(/^\d{5}$/, 'El código postal tiene 5 dígitos'),
  alcaldia: texto(2, 120, 'Escribe la alcaldía o municipio'),
  ciudad: texto(2, 120, 'Escribe la ciudad'),
  estado: z.enum(ESTADOS_MX, { errorMap: () => ({ message: 'Elige un estado' }) }),
  referencias: z.string().trim().max(300, 'Máximo 300 caracteres').optional().default(''),
});

export const CheckoutSchema = z
  .object({
    nombre: texto(3, 120, 'Escribe tu nombre completo').refine(
      (v) => v.split(/\s+/).length >= 2,
      'Escribe nombre y apellido'
    ),
    email: z.string().trim().toLowerCase().email('Revisa tu correo').max(160),
    telefono: z
      .string()
      .transform((v) => v.replace(/[\s\-().]/g, '').replace(/^\+?52/, ''))
      .pipe(z.string().regex(/^\d{10}$/, 'El teléfono tiene 10 dígitos')),
    metodo: z.enum(['envio', 'recoleccion'], {
      errorMap: () => ({ message: 'Elige envío o recolección' }),
    }),
    direccion: DireccionSchema.optional(),
    acepto: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los Términos y el Aviso de privacidad' }),
    }),
    items: z
      .array(z.object({ sku: z.string().min(1).max(80), qty: z.number().int().min(1).max(99) }))
      .min(1, 'Tu carrito está vacío')
      .max(50),
  })
  .superRefine((v, ctx) => {
    if (v.metodo === 'envio' && !v.direccion) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['direccion'], message: 'Falta la dirección de envío' });
    }
  });

export type CheckoutInput = z.input<typeof CheckoutSchema>;
export type CheckoutDatos = z.output<typeof CheckoutSchema>;
