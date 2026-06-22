import { z } from "zod";

export const watchSchema = z.object({
  brand: z.string().min(1, "Marca obrigatória").max(100),
  model: z.string().min(1, "Modelo obrigatório").max(200),
  reference: z.string().max(100).optional().nullable(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  movementType: z.enum(["automatic", "manual", "quartz"]),
  caseMaterial: z.string().max(200).optional().nullable(),
  caseDiameterMm: z.number().positive().optional().nullable(),
  braceletMaterial: z.string().max(200).optional().nullable(),
  condition: z.enum(["excellent", "very_good", "good"]),
  hasBox: z.boolean().default(false),
  hasPapers: z.boolean().default(false),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().positive("Preço deve ser positivo"),
  // Any marketplace/auction link (Chrono24, Vinted, eBay, an auction house, …).
  // It's only ever rendered as a click-out <a target="_blank">, never fetched
  // server-side, so a domain allowlist isn't needed — just require http(s).
  externalLink: z
    .string()
    .url()
    .refine((url) => /^https?:\/\//i.test(url), {
      message: "A ligação deve começar por http(s)://",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const watchStatusSchema = z.object({
  status: z.enum(["available", "sold", "archived"]),
});

export type WatchInput = z.infer<typeof watchSchema>;
export type WatchStatusInput = z.infer<typeof watchStatusSchema>;
