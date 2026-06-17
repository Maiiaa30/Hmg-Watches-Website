import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(5, "Título obrigatório").max(300),
  content: z.string().min(100, "Conteúdo demasiado curto"),
  excerpt: z.string().min(10).max(500),
  coverImage: z.string().url().optional().nullable(),
  category: z.enum(["novidades", "curiosidades", "guias", "mercado"]),
  status: z.enum(["draft", "pending_approval", "published"]).default("draft"),
  readingTimeMinutes: z.number().int().min(1).max(60).default(5),
});

export const blogStatusSchema = z.object({
  status: z.enum(["draft", "pending_approval", "published"]),
});

export const generateBlogSchema = z.object({
  category: z.enum(["novidades", "curiosidades", "guias", "mercado"]),
  topic: z.string().max(300).optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type GenerateBlogInput = z.infer<typeof generateBlogSchema>;
