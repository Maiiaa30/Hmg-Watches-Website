import { z } from "zod";

export const marketHighlightSchema = z.object({
  brand: z.string().min(1, "Marca obrigatória").max(100),
  model: z.string().min(1, "Modelo obrigatório").max(200),
  reference: z.string().max(100).optional().nullable(),
  imageUrl: z.string().url("URL de imagem inválida").optional().nullable().or(z.literal("")),
  appreciationPct: z.number({ invalid_type_error: "Valorização obrigatória" }),
  period: z.string().min(1, "Período obrigatório").max(100),
  editorialNote: z.string().max(500).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.number().int().optional(),
});

export type MarketHighlightInput = z.infer<typeof marketHighlightSchema>;
