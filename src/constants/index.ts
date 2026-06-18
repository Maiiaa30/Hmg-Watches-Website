export const SITE_NAME = "HMG Watches";
export const SITE_DESCRIPTION =
  "Relojoaria de luxo, online. Peças seleccionadas e autenticadas, com curadoria pessoal — encontramos o relógio certo para cada pessoa.";

export const ALLOWED_EXTERNAL_LINK_DOMAINS = [
  "vinted.pt",
  "vinted.com",
  "chrono24.com",
  "chrono24.pt",
  "ebay.com",
  "ebay.pt",
  "watchfinder.co.uk",
  "bobswatches.com",
  "hodinkee.com",
];

export const MAX_IMAGES_PER_WATCH = 10;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_IMAGE_MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
};

export const WATCH_STATUS_LABELS: Record<string, string> = {
  available: "Disponível",
  sold: "Vendido",
  archived: "Arquivado",
};

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  automatic: "Automático",
  manual: "Manual",
  quartz: "Quartzo",
};

export const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excelente",
  very_good: "Muito bom",
  good: "Bom",
};

export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  novidades: "Novidades",
  curiosidades: "Curiosidades",
  guias: "Guias",
  mercado: "Mercado",
};

// Human-friendly labels for audit_log actions (shown in the admin dashboard)
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "watch.created": "Relógio criado",
  "watch.updated": "Relógio editado",
  "watch.status_changed": "Estado do relógio alterado",
  "watch.featured_changed": "Destaque do relógio alterado",
  "watch.deleted": "Relógio eliminado",
  "watch.image_added": "Imagem adicionada",
  "watch.image_removed": "Imagem removida",
  "watch.image_deleted": "Imagem removida",
  "watch.images_updated": "Imagens atualizadas",
  "watch.image_reordered": "Imagens reordenadas",
  "watch_lead.created": "Novo contacto de relógio",
  "watch_lead.read": "Contacto marcado como lido",
  "blog.created": "Artigo criado",
  "blog.published": "Artigo publicado",
  "blog.deleted": "Artigo eliminado",
  "blog_post.updated": "Artigo editado",
  "blog_post.status_changed": "Estado do artigo alterado",
  "contact_message.read": "Mensagem marcada como lida",
  "contact_message.deleted": "Mensagem eliminada",
  "market_highlight.created": "Relógio em alta adicionado",
  "market_highlight.updated": "Relógio em alta atualizado",
  "market_highlight.deleted": "Relógio em alta removido",
  "market_highlight.ai_refreshed": "Top 10 atualizado pela IA",
  "auction.created": "Leilão adicionado",
  "auction.updated": "Leilão atualizado",
  "auction.deleted": "Leilão removido",
  "settings.updated": "Definições atualizadas",
  "telegram.test_sent": "Mensagem de teste do Telegram enviada",
  "cron.weekly_report_sent": "Relatório semanal enviado",
  "cron.weekly_report_skipped": "Relatório semanal ignorado",
  "auth.login": "Início de sessão",
  "auth.login_failed": "Tentativa de login falhada",
  "auth.logout": "Sessão terminada",
  "auth.password_changed": "Password alterada",
};

// Human-friendly labels for audit_log entities
export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  watches: "Relógios",
  watch_leads: "Leads",
  blog_posts: "Blog",
  contact_messages: "Mensagens",
  watch_market_highlights: "Mercado",
  auctions: "Leilões",
  site_settings: "Definições",
  admin: "Administração",
};
