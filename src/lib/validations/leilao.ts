import { z } from "zod";

export const auctionSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(160),
  house: z.string().max(120).optional().nullable(),
  url: z
    .string()
    .url("URL inválida")
    .max(500)
    .refine((u) => /^https?:\/\//i.test(u), "A ligação deve começar por http(s)://"),
  description: z.string().max(600).optional().nullable(),
  imageUrl: z.string().url("URL de imagem inválida").max(500).optional().nullable().or(z.literal("")),
  startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (AAAA-MM-DD)"),
  location: z.string().max(160).optional().nullable(),
  active: z.boolean().default(true),
});

export type AuctionInput = z.infer<typeof auctionSchema>;
