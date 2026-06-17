import { z } from "zod";
import { ALLOWED_EXTERNAL_LINK_DOMAINS } from "@/constants";

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
  externalLink: z
    .string()
    .url()
    .refine(
      (url) => {
        try {
          const hostname = new URL(url).hostname.replace(/^www\./, "");
          return ALLOWED_EXTERNAL_LINK_DOMAINS.some(
            (d) => hostname === d || hostname.endsWith(`.${d}`)
          );
        } catch {
          return false;
        }
      },
      { message: "Domínio externo não permitido" }
    )
    .optional()
    .nullable(),
});

export const watchStatusSchema = z.object({
  status: z.enum(["available", "sold", "archived"]),
});

export type WatchInput = z.infer<typeof watchSchema>;
export type WatchStatusInput = z.infer<typeof watchStatusSchema>;
