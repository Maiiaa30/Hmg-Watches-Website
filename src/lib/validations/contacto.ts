import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().email("Email inválido").max(300).optional(),
  subject: z.string().min(1, "Assunto obrigatório").max(300),
  message: z.string().min(10, "Mensagem demasiado curta").max(5000),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export const watchLeadSchema = z
  .object({
    name: z.string().max(200).optional(),
    email: z.string().email("Email inválido").max(300).optional().or(z.literal("")),
    phone: z.string().max(30).optional(),
    message: z.string().min(5, "Mensagem obrigatória").max(2000),
    website: z.string().max(0).optional(), // honeypot
  })
  .refine(
    (data) => (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0),
    { message: "Indique pelo menos email ou telemóvel", path: ["email"] }
  );

export type ContactInput = z.infer<typeof contactSchema>;
export type WatchLeadInput = z.infer<typeof watchLeadSchema>;
