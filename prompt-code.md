# CLAUDE.md — Projeto: Website de Revenda de Relógios

Este ficheiro descreve o projeto completo, stack, funcionalidades, requisitos de segurança
e boas práticas para o Claude Code construir tudo de forma estruturada e segura.

---

## Contexto do Projeto

Website profissional para um negócio de revenda de relógios de luxo. O frontend
foi criado com o Claude Design e está disponível como código HTML/React neste repositório.
A tua missão é integrá-lo num projeto Next.js completo e implementar todo o backend,
funcionalidades, base de dados, segurança e integrações descritas abaixo.

**Não alteres a estética ou design já criado** — adapta os componentes HTML/React do
Claude Design para Next.js, mas mantém toda a identidade visual.

---

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript strict |
| Styling | Tailwind CSS v3 |
| Base de dados | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth |
| File storage | Supabase Storage |
| AI (blog) | Anthropic Claude API (claude-sonnet-4-5) |
| Bot | Telegram Bot API |
| Analytics | Tabela própria no Supabase (sem third-party) |
| Hosting | Vercel |
| Validação | Zod |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` |
| Email | Resend |

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Homepage
│   │   ├── catalogo/
│   │   │   ├── page.tsx              # Listagem de relógios
│   │   │   └── [slug]/page.tsx       # Detalhe do relógio
│   │   ├── blog/
│   │   │   ├── page.tsx              # Listagem de artigos
│   │   │   └── [slug]/page.tsx       # Artigo individual
│   │   ├── sobre-nos/page.tsx
│   │   ├── contacto/page.tsx
│   │   ├── mercado/page.tsx           # Preços de metais + relógios em alta
│   │   └── layout.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx            # Layout protegido com sidebar
│   │       ├── page.tsx              # Dashboard
│   │       ├── relogios/
│   │       │   ├── page.tsx
│   │       │   ├── novo/page.tsx
│   │       │   └── [id]/editar/page.tsx
│   │       ├── blog/page.tsx
│   │       ├── leads/page.tsx
│   │       ├── mercado/page.tsx       # Gestão dos "Relógios em Alta"
│   │       ├── analytics/page.tsx
│   │       └── definicoes/page.tsx
│   ├── api/
│   │   ├── relogios/
│   │   │   ├── route.ts              # GET (lista paginada + filtros) / POST (criar)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET / PUT (editar) / DELETE (eliminar permanente)
│   │   │       ├── status/route.ts   # PATCH — mudar status (available|sold|archived)
│   │   │       ├── imagens/route.ts  # POST (adicionar) / DELETE (remover imagem individual)
│   │   │       └── contacto/route.ts # POST — submeter lead (email/tel + mensagem)
│   │   ├── blog/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── gerar/route.ts        # Gerar artigo com IA
│   │   ├── telegram/webhook/route.ts # Webhook do bot
│   │   ├── contacto/route.ts
│   │   ├── analytics/
│   │   │   ├── track/route.ts        # Registar visita
│   │   │   └── route.ts              # Dados para o dashboard
│   │   ├── cron/
│   │   │   └── weekly-report/route.ts # Cron job — relatório semanal via Telegram
│   │   ├── mercado/
│   │   │   ├── metais/route.ts        # GET — preços de metais preciosos (cached 1h)
│   │   │   └── relogios-alta/route.ts # GET/POST/DELETE — gestão dos relógios em alta (admin)
│   │   └── upload/route.ts           # Upload de imagens
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                           # Componentes reutilizáveis (botões, inputs, badges, etc.)
│   ├── public/                       # Componentes do site público
│   └── admin/                        # Componentes do painel admin
├── lib/
│   ├── db/
│   │   ├── index.ts                  # Instância do Drizzle
│   │   └── schema.ts                 # Schema completo
│   ├── auth/
│   │   └── utils.ts                  # Helpers de autenticação
│   ├── ai/
│   │   └── blog-generator.ts         # Geração de artigos com Claude API
│   ├── telegram/
│   │   └── bot.ts                    # Lógica do bot Telegram
│   ├── validations/
│   │   ├── relogio.ts                # Schema Zod para relógios
│   │   ├── blog.ts
│   │   └── contacto.ts
│   ├── security/
│   │   ├── rate-limit.ts             # Rate limiting com Upstash
│   │   ├── sanitize.ts               # Sanitização de inputs
│   │   └── headers.ts                # Security headers
│   └── analytics/
│       └── track.ts                  # Client-side tracking (respeitando privacidade)
├── middleware.ts                      # Auth + rate limiting middleware
├── types/
│   └── index.ts
└── constants/
    └── index.ts
```

---

## Schema da Base de Dados (Drizzle + PostgreSQL)

Implementa este schema completo no ficheiro `src/lib/db/schema.ts`:

```typescript
// watches — relógios
id (uuid, PK), slug (text, unique), brand (text), model (text),
reference (text), year (integer), movement_type (enum: automatic|manual|quartz),
case_material (text), case_diameter_mm (decimal), bracelet_material (text),
condition (enum: excellent|very_good|good), has_box (boolean), has_papers (boolean),
description (text), price (decimal), status (enum: available|sold|archived),
images (text[]),         -- array de URLs públicas no Supabase Storage
image_order (text[]),    -- array de UUIDs a definir a ordem de apresentação
external_link (text, nullable),
sold_at (timestamp, nullable),   -- preenchido automaticamente ao marcar como vendido
created_at (timestamp), updated_at (timestamp)

// blog_posts — artigos do blog
id (uuid, PK), slug (text, unique), title (text), content (text, markdown),
excerpt (text), cover_image (text), category (enum: novidades|curiosidades|guias|mercado),
status (enum: draft|pending_approval|published), generated_by_ai (boolean),
telegram_message_id (integer, nullable), reading_time_minutes (integer),
published_at (timestamp, nullable), created_at (timestamp), updated_at (timestamp)

// page_views — analytics
id (uuid, PK), page (text), watch_id (uuid, nullable, FK),
blog_post_id (uuid, nullable, FK), country (text, nullable),
device_type (enum: desktop|mobile|tablet), session_id (text),
created_at (timestamp)

// contact_messages — mensagens do formulário de contacto
id (uuid, PK), name (text), email (text), subject (text),
message (text), read (boolean, default false),
created_at (timestamp)

// watch_leads — contactos gerados a partir de páginas de relógios
id (uuid, PK),
watch_id (uuid, FK → watches),
watch_status_at_time (enum: available|sold),  -- estado do relógio no momento do contacto
name (text, nullable),
email (text, nullable),                        -- pelo menos um de email ou phone obrigatório
phone (text, nullable),
message (text),
notified_telegram (boolean, default false),    -- confirmação de envio ao Telegram
notified_email (boolean, default false),       -- confirmação de envio ao email
read (boolean, default false),
created_at (timestamp)

// audit_logs — logs de segurança (OWASP A09)
id (uuid, PK), action (text), entity (text), entity_id (text, nullable),
admin_email (text), ip_address (text), user_agent (text),
created_at (timestamp)
```

---

## Funcionalidades a Implementar

### 1. Site Público
- Todas as páginas do design: Homepage, Catálogo, Detalhe do Relógio, Blog (listagem e artigo),
  Sobre Nós, Contacto, Mercado
- Server Components onde possível (SEO e performance)
- Metadata dinâmica (title, description, OG tags) em cada página
- Sitemap.xml e robots.txt gerados automaticamente
- Imagens otimizadas com `next/image`
- Links de navegação com `next/link`
- Formulário de contacto com envio real via Resend e confirmação ao utilizador

**Regras de design obrigatórias a respeitar ao integrar o frontend do Claude Design:**
- Ghost buttons em todo o site público: `border: 1px solid` (ouro ou branco), fundo transparente,
  hover com fill suave via `transition: background 250ms`. Zero botões sólidos no site público.
- Whitespace extremo: os relógios devem "flutuar" na página. Padding e margens generosas,
  nunca elementos comprimidos ou encostados uns aos outros.
- As fotos são a estrela — qualquer elemento de UI que compete com as imagens deve ser revisto.
  Texto, badges e botões devem ser discretos e recuados.

### 1a. Formulário de Lead na Página de Cada Relógio

Em cada página de detalhe de relógio existe um botão que abre um formulário de contacto
direto sobre aquele relógio específico. O texto e tom do formulário mudam consoante
o estado do relógio.

**Botão e título consoante estado:**

| Estado do relógio | Texto do botão | Título do formulário |
|---|---|---|
| `available` | "Tenho interesse neste relógio" | "Entrar em contacto" |
| `sold` | "Quero algo assim" | "Avisem-me quando tiverem algo semelhante" |

**Campos do formulário** (validados com Zod):
- Nome (text, opcional — se não preencher, usar "Anónimo")
- Email (email, opcional mas pelo menos um de email ou telemóvel obrigatório)
- Telemóvel (text, opcional mas pelo menos um de email ou telemóvel obrigatório)
- Mensagem (textarea, obrigatório):
  - Pré-preenchida para relógio disponível: *"Olá, tenho interesse neste relógio. Podem contactar-me?"*
  - Pré-preenchida para relógio vendido: *"Olá, gostaria de encontrar algo semelhante a este. Avisem-me se tiverem disponível."*
  - O utilizador pode editar livremente

**Validação de segurança:**
- Pelo menos um de email ou telemóvel obrigatório — rejeitar se ambos estiverem vazios
- Formato de email válido se preenchido
- Honeypot field oculto (`website` field) — se preenchido, rejeitar silenciosamente (anti-bot)
- Rate limiting: máximo 3 submissões por IP em 10 minutos (OWASP A07)
- Sanitizar mensagem antes de guardar (OWASP A03)

**Após submissão bem-sucedida (`/api/relogios/[id]/contacto` POST):**
1. Guardar lead na tabela `watch_leads` com `watch_status_at_time`
2. Enviar notificação Telegram (ver formato abaixo)
3. Enviar email de notificação ao admin via Resend (ver formato abaixo)
4. Atualizar `notified_telegram` e `notified_email` na BD conforme sucesso
5. Mostrar mensagem de sucesso ao utilizador: *"Mensagem enviada! Entraremos em contacto em breve."*
6. Registar no `audit_log` com action `watch_lead.created`

**Formato da mensagem Telegram — relógio disponível:**
```
🔔 *Novo contacto — [Marca] [Modelo]*
_[Referência] · [Ano] · €[Preço]_ ✅ Disponível

👤 *Quem contactou:*
Nome: [nome ou "Não indicado"]
Email: [email ou "—"]
Telemóvel: [phone ou "—"]

💬 *Mensagem:*
"[mensagem do utilizador]"

🔗 Ver anúncio: [URL completa da página do relógio]
⏰ [data e hora em Portugal]
```

**Formato da mensagem Telegram — relógio já vendido:**
```
👀 *Interesse em relógio similar — [Marca] [Modelo]*
_Este relógio já foi vendido — o contacto quer algo parecido_

👤 *Quem contactou:*
Nome: [nome ou "Não indicado"]
Email: [email ou "—"]
Telemóvel: [phone ou "—"]

💬 *Mensagem:*
"[mensagem do utilizador]"

🔗 Ver anúncio: [URL]
⏰ [data e hora em Portugal]
```

**Email de notificação ao admin (via Resend):**
- Assunto: `[Relógio Disponível] Novo contacto — [Marca] [Modelo]` ou
           `[Relógio Vendido] Interesse em algo similar — [Marca] [Modelo]`
- Corpo: mesmo conteúdo da mensagem Telegram mas em HTML formatado
- Incluir miniatura do relógio (primeira imagem) se disponível

### 2. Sistema de Blog com IA
O fluxo completo deve funcionar assim:

1. Admin clica "Gerar Artigo" no painel → escolhe categoria e opcionalmente um tema
2. API route `/api/blog/gerar` chama a Claude API com um prompt cuidado para gerar:
   - Título apelativo
   - Excerpt (2–3 linhas)
   - Conteúdo completo em Markdown (600–1000 palavras)
   - Sugestão de categoria
   Em Português de Portugal, tom editorial de qualidade sobre relojoaria
3. O artigo é guardado na BD com `status: pending_approval`
4. O bot Telegram envia uma mensagem formatada para o canal/grupo do admin com:
   - Título do artigo
   - Excerpt
   - Botões inline: ✅ Publicar | ✏️ Editar | 🗑️ Eliminar
5. Quando o admin carrega "Publicar" no Telegram, o webhook `/api/telegram/webhook`
   atualiza o status para `published` e define `published_at`

**Variáveis de ambiente necessárias:**
```
ANTHROPIC_API_KEY
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_WEBHOOK_SECRET
```

### 3. Painel de Admin — Gestão Completa de Relógios

Protegido por Supabase Auth. Sidebar: Dashboard, Relógios, Blog, Leads, Analytics, Definições.

#### 3a. Ciclo de Vida de um Anúncio

Um relógio pode transitar entre os seguintes estados. Todas as transições registam
entrada no `audit_log`. A API PATCH `/api/relogios/[id]/status` gere todas as transições.

```
[available] ──→ [sold]      (marcar como vendido — preenche sold_at automaticamente)
[available] ──→ [archived]  (arquivar — remove do catálogo público)
[sold]      ──→ [available] (reverter venda — limpa sold_at)
[sold]      ──→ [archived]  (arquivar relógio já vendido)
[archived]  ──→ [available] (restaurar para o catálogo público)
[qualquer]  ──→ [eliminado] (DELETE permanente — requer confirmação modal + elimina
                              imagens do Supabase Storage)
```

**Comportamento no site público por estado:**
- `available` → aparece no catálogo e na homepage, badge "Disponível"
- `sold` → aparece no catálogo MAS com badge "Vendido" e sem CTA de compra
  (serve como portfólio/histórico de vendas). Filtrável pelo admin.
- `archived` → não aparece em nenhuma página pública. Só visível no admin.

#### 3b. Adicionar Novo Relógio (`/admin/relogios/novo`)

Formulário completo validado com Zod, dividido em secções:

**Informações Básicas**
- Marca (text, obrigatório)
- Modelo (text, obrigatório)
- Referência (text, opcional)
- Ano de fabrico (number, 1900–ano atual)
- Preço em EUR (decimal, obrigatório)

**Especificações Técnicas**
- Tipo de movimento (select: Automático / Manual / Quartzo)
- Material da caixa (text, ex: "Aço inoxidável", "Ouro 18k", "Titânio")
- Diâmetro da caixa em mm (decimal)
- Material da bracelete/pulseira (text)

**Estado e Documentação**
- Estado de conservação (select: Excelente / Muito bom / Bom)
- Inclui caixa original (checkbox)
- Inclui papéis/documentação (checkbox)

**Descrição**
- Campo de texto longo — descrição livre do relógio

**Link Externo** (opcional)
- URL do anúncio na Vinted/Chrono24 — validada contra allowlist de domínios

**Imagens** (secção dedicada, ver 3d)

Ao submeter: gera o `slug` automaticamente a partir de `brand-model-reference` (slugify),
garante unicidade acrescentando sufixo numérico se necessário.

#### 3c. Editar Relógio (`/admin/relogios/[id]/editar`)

- Todos os campos do formulário de criação pré-preenchidos com os valores atuais
- O `slug` pode ser editado manualmente (com aviso de impacto em URLs existentes)
- Secção de gestão de imagens integrada (ver 3d)
- Botões de ação rápida no topo da página:
  - "Marcar Vendido" / "Reverter para Disponível" (consoante estado atual)
  - "Arquivar" / "Restaurar"
  - "Eliminar" (botão destrutivo vermelho com confirmação obrigatória)
- Guardar regista `updated_at` e entrada no `audit_log`

#### 3d. Gestão de Imagens

Upload e gestão de imagens é uma funcionalidade crítica — implementar com cuidado:

**Upload:**
- Múltiplas imagens em simultâneo (drag & drop + file picker)
- Tipos aceites: apenas JPEG, PNG, WebP (validar MIME type server-side — não confiar no
  content-type do cliente)
- Limite: 5MB por imagem, máximo 10 imagens por relógio
- Ao fazer upload via `/api/upload`, o ficheiro é:
  1. Validado (tipo MIME real + tamanho)
  2. Renomeado para UUID aleatório (nunca usar nome original — segurança T1505.003)
  3. Guardado no Supabase Storage no bucket `watch-images/{watch-id}/{uuid}.ext`
  4. URL pública retornada e adicionada ao array `images` do relógio

**Gestão pós-upload:**
- Pré-visualização de todas as imagens em grid com miniaturas
- Drag & drop para reordenar (a primeira imagem é a imagem principal no catálogo)
- Botão "×" em cada imagem para remover — chama `/api/relogios/[id]/imagens` com DELETE
  que remove do Supabase Storage E do array na BD em operação atómica
- Ao eliminar o relógio permanentemente, eliminar TODAS as imagens do Storage

#### 3e. Listagem de Relógios no Admin (`/admin/relogios`)

Tabela completa com:
- Filtro por estado: Todos / Disponíveis / Vendidos / Arquivados (tabs ou pills)
- Pesquisa por texto (marca, modelo, referência)
- Ordenação por: data de adição, preço, estado
- Colunas: miniatura (primeira imagem), marca + modelo, referência, preço,
  estado (badge colorido), data de adição, data de venda (se vendido)
- Ações por linha: Editar | Mudar Estado (dropdown) | Eliminar
- **Ações em bulk** (checkboxes nas linhas):
  - Marcar selecionados como Vendidos
  - Arquivar selecionados
  - Eliminar selecionados (confirmação obrigatória com contagem: "Eliminar 3 relógios?")
- Paginação server-side (20 por página)

#### 3f. Gestão de Leads (`/admin/leads`)

Tabela de todos os contactos recebidos a partir de páginas de relógios:

- Colunas: relógio (marca + modelo com miniatura), estado do relógio no momento do contacto
  (badge "Disponível" ou "Vendido"), nome, contacto (email e/ou telemóvel), data e hora,
  lido (checkbox)
- Ordenação: mais recentes primeiro
- Filtro: Todos / Não lidos / Relógios disponíveis / Relógios vendidos
- Ao clicar numa linha, expande ou abre modal com:
  - Todos os dados do lead
  - Mensagem completa
  - Link direto para a página do relógio em questão
  - Botão "Marcar como lido"
  - Botão de resposta rápida (abre cliente de email com o endereço pré-preenchido, se tiver email)
- Badge de contagem no item "Leads" da sidebar quando houver leads não lidos
- No dashboard, incluir contador de leads não lidos nos cards de métricas

#### 3g. Gestão do Blog no Admin (`/admin/blog`)

Tabela com:
- Colunas: título, categoria (badge), status (badge: Rascunho / Pendente / Publicado),
  gerado por IA (ícone), data de criação, data de publicação
- Filtro por status (tabs) e por categoria
- Ações por linha:
  - **Publicar** — disponível para artigos em Rascunho ou Pendente Aprovação
  - **Editar** — editor de Markdown com pré-visualização em tempo real, todos os campos editáveis
  - **Despublicar** — reverte artigo publicado para Rascunho (não elimina)
  - **Eliminar** — com confirmação obrigatória, elimina também a imagem de capa do Storage
- Botão "Gerar Artigo com IA" no topo → abre modal para escolher categoria e tema opcional,
  chama `/api/blog/gerar`, envia para Telegram e mostra loading com feedback
- Artigos pendentes de aprovação com destaque visual (badge âmbar) para não passarem despercebidos

#### 3h. Dashboard (`/admin`)

Métricas reais calculadas a partir da BD, sem cache excecivo (máx 5 min de ISR):

**Cards de métricas (topo):**
- Visitas hoje (query `page_views` WHERE DATE = hoje)
- Relógios em stock (COUNT WHERE status = 'available')
- Relógios vendidos (COUNT WHERE status = 'sold')
- Artigos publicados (COUNT WHERE status = 'published')

**Gráfico de visitas:** linha temporal, últimos 30 dias, agrupado por dia

**Top 5 relógios mais vistos:** lista com miniatura, nome e número de visitas

**Atividade recente:** últimas 10 entradas do `audit_log` (ação, entidade, data)
— serve como monitor de atividade do admin

**Mensagens não lidas:** count de `contact_messages` WHERE read = false,
com link direto para ver mensagens (implementar vista simples em `/admin/mensagens`)

#### 3i. Página de Definições (`/admin/definicoes`)

- Alterar password (campo password atual + nova password + confirmação)
  — chamar Supabase Auth `updateUser`, registar no audit log
- Informações básicas do site (nome do negócio, email de contacto, links de redes sociais)
  — guardar na tabela `site_settings` (key-value)

**Relatório Semanal via Telegram:**
- Toggle on/off (guardado em `site_settings` com key `weekly_report_enabled`)
- Select para escolher o dia de envio: Sexta-feira ou Sábado
- Select para a hora de envio: opções das 19:00 às 23:00 (hora de Lisboa)
- Botão "Enviar relatório agora" para testar sem esperar pelo cron — chama
  `/api/cron/weekly-report` manualmente com autenticação de admin
- Ao guardar as definições do relatório, registar no `audit_log`

#### 3j. Audit Log — Entradas Obrigatórias para Relógios

Todas as seguintes ações devem gerar uma entrada na tabela `audit_logs`:

| action | entity | quando |
|---|---|---|
| `watch_lead.created` | `watch_leads` | Novo contacto submetido em página de relógio |
| `watch_lead.read` | `watch_leads` | Lead marcado como lido no admin |
| `watch.created` | `watches` | Novo relógio criado |
| `watch.updated` | `watches` | Campos editados |
| `watch.status_changed` | `watches` | Qualquer mudança de estado |
| `watch.image_added` | `watches` | Imagem adicionada |
| `watch.image_removed` | `watches` | Imagem removida |
| `watch.image_reordered` | `watches` | Ordem de imagens alterada |
| `watch.deleted` | `watches` | Eliminação permanente |
| `blog.created` | `blog_posts` | Artigo criado (manual ou IA) |
| `blog.published` | `blog_posts` | Artigo publicado |
| `blog.deleted` | `blog_posts` | Artigo eliminado |
| `auth.login` | `admin` | Login bem-sucedido |
| `auth.login_failed` | `admin` | Tentativa de login falhada |
| `auth.logout` | `admin` | Logout |
| `auth.password_changed` | `admin` | Password alterada |

### 4. Analytics Próprio
- Registar visitas via Server Action ou API route — sem cookies de terceiros
- Capturar: página, dispositivo, país (via header CF-IPCountry do Vercel), session ID anónimo
- Não armazenar IPs completos (RGPD) — hash do IP se necessário
- Dashboard com: visitas por dia, páginas mais vistas, split desktop/mobile

### 6. Página de Mercado (`/mercado`)

#### 6a. Preços de Metais Preciosos e Diamantes

Usar a API **Metals.dev** (https://metals.dev) — tem free tier com 100 pedidos/mês,
suficiente para atualizar de hora em hora com ISR do Next.js.

**Ativos a mostrar:**
| Ativo | Símbolo | Unidade | Relevância para relógios |
|---|---|---|---|
| Ouro | XAU | USD/oz | Caixas, braceletes, aplicações |
| Prata | XAG | USD/oz | Caixas entrada de gama, detalhes |
| Platina | XPT | USD/oz | Caixas premium (Rolex, Patek) |
| Paládio | XPD | USD/oz | Acabamentos raros |
| Diamante | — | USD/ct | Versões jóia / diamond-set |

Para o diamante, não existe API padronizada gratuita. Usar o **índice IDEX Online Diamond Index**
(https://www.idexonline.com) via web fetch server-side do valor público da página, ou
apresentar um valor fixo atualizado manualmente no admin com nota de data de atualização.

**Implementação:**
```typescript
// app/mercado/page.tsx
export const revalidate = 3600  // ISR — atualiza a cada hora

async function getMetalPrices() {
  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=EUR&symbols=XAU,XAG,XPT,XPD`,
    { next: { revalidate: 3600 } }
  )
  return res.json()
}
```

Mostrar para cada ativo: preço atual em EUR (converter de USD com taxa de câmbio inclusa
na resposta da API), variação % face às 24h anteriores com cor e seta, e unidade.
Nota de rodapé: *"Valores indicativos actualizados de hora em hora. Fonte: Metals.dev"*

#### 6b. Relógios em Alta — Curadoria Manual

**Por que não scraping do Chrono24:**
O scraping do Chrono24 (ou de qualquer marketplace) viola os seus termos de serviço
e pode resultar em bloqueio de IP, ação legal ou dados inconsistentes. Não implementar.

**Alternativa recomendada — curadoria manual com IA:**
A secção "Relógios em Alta" é gerida pelo admin no painel (`/admin/mercado`).
O admin adiciona/remove entradas manualmente. Para cada entrada:
- Marca, Modelo, Referência (text)
- Foto (upload ou URL externa)
- Valorização em % (ex: `+23`)
- Período de referência (ex: `6 meses`, `1 ano`, `2024`)
- Nota editorial breve (1–2 linhas sobre o porquê)
- Fonte da informação (ex: "WatchCharts", "Chrono24 Price Guide", "Christie's")
- Data de atualização

**Fontes públicas recomendadas para o admin consultar manualmente:**
- WatchCharts.com — dados de valorização públicos e gratuitos
- Chrono24 Price Guide — secção pública no site deles (sem necessidade de scraping)
- Bob's Watches Market Index — público e gratuito
- Leilões Christie's / Phillips / Sotheby's — resultados públicos

**Tabela no schema:**
```typescript
// watch_market_highlights
id (uuid, PK), brand (text), model (text), reference (text),
image_url (text), appreciation_pct (decimal), period (text),
editorial_note (text), source (text),
display_order (integer), active (boolean, default true),
updated_at (timestamp)
```

**No admin (`/admin/mercado`):**
- Tabela com as entradas ativas, drag & drop para reordenar
- Formulário de adição/edição
- Toggle ativo/inativo por entrada
- Máximo recomendado de 6 entradas visíveis em simultâneo

---

#### 5a. Como Funciona

1. O Vercel Cron Job dispara todas as sextas e sábados às 20:00 UTC (21:00 Lisboa inverno / 21:00 verão — ajustar conforme necessário)
2. A rota `/api/cron/weekly-report` é chamada pelo Vercel com o header `Authorization: Bearer {CRON_SECRET}`
3. A rota verifica: (a) o header de autorização, (b) se `weekly_report_enabled = true` na `site_settings`, (c) se o dia atual corresponde ao dia configurado
4. Agrega os dados da semana a partir da tabela `page_views`
5. Formata e envia uma mensagem para o Telegram

#### 5b. Configuração Vercel Cron (`vercel.json`)

Criar `vercel.json` na raiz do projeto:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-report",
      "schedule": "0 20 * * 5,6"
    }
  ]
}
```

`0 20 * * 5,6` = todos os dias 5 (Sexta) e 6 (Sábado) às 20:00 UTC.
A rota verifica internamente qual dos dois dias está configurado nas definições e
só executa no dia correto — assim o cron pode correr nos dois dias sem problema.

#### 5c. Segurança da Rota do Cron

A rota `/api/cron/weekly-report` deve ser protegida de duas formas:

```typescript
// 1. Verificar header do Vercel Cron (apenas em produção)
const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

// 2. Verificar se feature está ativa
const enabled = await getSetting('weekly_report_enabled')
if (!enabled) return Response.json({ skipped: true }, { status: 200 })
```

Nunca expor esta rota sem autenticação — qualquer pessoa poderia disparar spam de Telegrams.
Registar no `audit_log` com action `cron.weekly_report_sent` ou `cron.weekly_report_skipped`.

#### 5d. Dados do Relatório

Consultar a tabela `page_views` para o período dos últimos 7 dias (Segunda a Domingo
ou os últimos 7 dias corridos a partir da data de envio):

```typescript
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Segunda
const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })     // Domingo

// Queries a executar:
// 1. Total de visitas na semana
// 2. Total da semana anterior (para comparação %)
// 3. Top 5 páginas mais visitadas (COUNT GROUP BY page)
// 4. Top 3 relógios mais vistos (JOIN watches, GROUP BY watch_id)
// 5. Split desktop vs mobile (COUNT GROUP BY device_type)
// 6. Top 3 países (COUNT GROUP BY country)
```

#### 5e. Formato da Mensagem Telegram

Mensagem formatada com Markdown do Telegram (parse_mode: 'Markdown'):

```
📊 *Relatório Semanal*
_[Segunda, DD/MM] — [Domingo, DD/MM]_

👁️ *Visitas totais:* 247 _(+18% vs semana anterior)_

📄 *Páginas mais visitadas:*
1. Página Inicial — 89 visitas
2. Catálogo — 67 visitas
3. Rolex Datejust 36 — 34 visitas
4. Blog — 28 visitas
5. Sobre Nós — 14 visitas

⌚ *Relógios mais vistos:*
1. Rolex Datejust 36 Ref.126234 — 34 visitas
2. Omega Seamaster 300M — 21 visitas
3. TAG Heuer Carrera — 15 visitas

📱 *Dispositivos:*
Desktop: 58% · Mobile: 39% · Tablet: 3%

🌍 *Países (top 3):*
🇵🇹 Portugal: 71% · 🇧🇷 Brasil: 14% · 🇬🇧 Reino Unido: 8%

_Relatório gerado automaticamente · [nome do site]_
```

Se não houver visitas na semana, enviar mensagem simplificada:
```
📊 *Relatório Semanal*
Sem visitas registadas esta semana. 🔇
```

#### 5f. `site_settings` — Chaves Necessárias

Adicionar ao schema uma tabela `site_settings` simples:

```typescript
// site_settings
key (text, PK), value (text), updated_at (timestamp)
```

Chaves utilizadas pelo relatório semanal:

| key | valor exemplo | descrição |
|---|---|---|
| `weekly_report_enabled` | `"true"` | Toggle on/off |
| `weekly_report_day` | `"saturday"` | `"friday"` ou `"saturday"` |
| `weekly_report_hour_utc` | `"20"` | Hora de envio em UTC (19–23) |
| `site_name` | `"Hora Nobre"` | Nome do site para rodapé da mensagem |

---

### OWASP Top 10 (2021) — Implementação Completa

**A01 — Broken Access Control**
- Middleware Next.js que verifica sessão Supabase em todas as rotas `/admin/*` e `/api/` protegidas
- Verificar sempre a sessão server-side nas API routes — nunca confiar só no cliente
- Princípio do menor privilégio: admin tem apenas um role, sem escalada possível
- Rotas de API de escrita (POST/PUT/DELETE) sempre protegidas

**A02 — Cryptographic Failures**
- Variáveis sensíveis apenas em variáveis de ambiente server-side (`NEXT_PUBLIC_*` apenas para dados verdadeiramente públicos)
- Nunca logar passwords, tokens ou dados sensíveis
- Cookies de sessão com flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- HTTPS forçado (garantido pelo Vercel, documentar no README)

**A03 — Injection**
- Usar Drizzle ORM em todas as queries — zero SQL concatenado manualmente
- Validação rigorosa de todos os inputs com Zod antes de qualquer operação na BD
- Sanitizar conteúdo HTML no blog com `DOMPurify` (server-side) antes de guardar
- Parametrizar todas as queries — nunca interpolar variáveis em SQL

**A04 — Insecure Design**
- Rate limiting em todas as rotas públicas de escrita (formulário de contacto, geração de artigo)
- Rate limiting mais restritivo em `/api/blog/gerar` (prevenção de custos excessivos na API)
- Confirmação dupla para ações destrutivas no admin (eliminar relógio, eliminar artigo)
- Webhook do Telegram verificado com HMAC — rejeitar requests sem assinatura válida

**A05 — Security Misconfiguration**
- Security headers em `next.config.ts`:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  ```
- Ficheiro `.env.example` com todas as variáveis necessárias (sem valores reais)
- `.gitignore` correto — nunca commitar `.env.local` ou ficheiros com segredos
- Remover headers de identificação do servidor quando possível

**A06 — Vulnerable and Outdated Components**
- Usar versões estáveis e recentes de todas as dependências
- `npm audit` obrigatório antes de cada deploy — documentar no README
- `npm ci` em vez de `npm install` em CI/CD e produção (usa o lock file de forma estrita)
- Adicionar `npm audit --audit-level=high` ao pipeline — falhar o build se houver vulnerabilidades high/critical

**A06 — Supply Chain Security (npm) — ATENÇÃO CRÍTICA**

Os ataques de supply chain via npm são uma das ameaças mais ativas em projetos Node.js/Next.js.
Implementar todas as seguintes medidas sem exceção:

**Regras para adicionar qualquer dependência nova:**
- Verificar popularidade: mínimo aceitável ~100k downloads/semana no npmjs.com
- Verificar manutenção ativa: último commit há menos de 12 meses, issues respondidas
- Verificar o repositório GitHub: tem estrelas? Tem mantenedores conhecidos? O código é legível?
- Verificar histórico de segurança: pesquisar `[nome do pacote] security vulnerability` antes de instalar
- Evitar pacotes com poucos mantenedores para funcionalidades críticas (auth, crypto, upload)
- Suspeitar de pacotes com nomes muito similares a populares (typosquatting — ex: `expres`, `reakt`)
- Nunca instalar um pacote só porque apareceu num tutorial desconhecido ou numa sugestão de IA sem verificar

**Gestão do lock file — obrigatório:**
```bash
# NUNCA fazer isto em produção:
npm install          # pode atualizar versões e alterar o lock file

# SEMPRE usar em produção e CI:
npm ci               # instala exatamente o que está no package-lock.json, falha se divergir
```
- `package-lock.json` NUNCA no `.gitignore` — tem de estar no repositório
- Commitar o lock file em cada mudança de dependências — não ignorar diffs no lock file
- Rever o `package-lock.json` quando aparecem alterações inesperadas (sinal de comprometimento)

**Versões pinadas — sem ranges:**
```json
// ❌ NÃO fazer — permite atualizações automáticas que podem introduzir código malicioso:
"dependencies": {
  "next": "^14.2.0",
  "drizzle-orm": "~0.30.0"
}

// ✅ FAZER — versão exata, sem ^ ou ~:
"dependencies": {
  "next": "14.2.5",
  "drizzle-orm": "0.30.10"
}
```

**Minimizar dependências — superfície de ataque:**
- Zero dependências desnecessárias: se o Next.js ou o browser já fazem algo, não instalar pacote para isso
- Preferir código próprio simples a pacote para tarefas triviais (ex: capitalizar string, truncar texto)
- Antes de instalar: perguntar "consigo fazer isto com 10 linhas de código?"
- Auditar as dependências existentes: remover qualquer pacote que não esteja a ser usado

**Verificação de integridade:**
```bash
# Inspecionar o que um pacote contém antes de instalar:
npm pack [nome-do-pacote] --dry-run

# Ver todas as dependências transitivas (o que o pacote instala):
npm ls

# Verificar se alguma dependência foi alterada inesperadamente:
npm audit signatures
```

**Subresource Integrity para scripts externos:**
- Qualquer script CDN no HTML deve ter atributo `integrity` com hash SRI
- Gerar em https://www.srihash.org/ ou via `openssl dgst -sha384`
- Preferir sempre instalar via npm em vez de CDN quando possível

**Ferramentas adicionais recomendadas:**
- `socket.dev` — ferramenta gratuita que analisa pacotes npm em busca de comportamento suspeito,
  typosquatting e comprometimento de mantenedores. Instalar a GitHub App se o repo for privado.
- `npm audit fix` apenas com revisão manual do diff — nunca `npm audit fix --force` sem verificar

**Variáveis de ambiente e segredos:**
- Verificar que nenhuma dependência tem acesso a variáveis de ambiente em tempo de build
  (alguns pacotes maliciosos fazem exfiltração de `process.env` durante a instalação via `postinstall`)
- Rever qualquer script `postinstall`, `preinstall`, `prepare` de dependências de terceiros —
  são pontos de execução de código arbitrário durante `npm install`

**A07 — Identification and Authentication Failures**
- Rate limiting na página de login do admin (máximo 5 tentativas por 15 minutos por IP)
- Mensagens de erro de login genéricas ("Credenciais inválidas") — nunca revelar se o email existe
- Sessões com expiração adequada (Supabase Auth gere isto)
- Logout que invalida sessão server-side

**A08 — Software and Data Integrity Failures**
- CSP header para prevenir execução de scripts externos não autorizados
- Verificar assinatura do webhook Telegram com o secret configurado
- Não usar `eval()` ou `Function()` em nenhum ponto do código

**A09 — Security Logging and Monitoring Failures**
- Tabela `audit_logs` na BD para todas as ações do admin
- Logar: ação, entidade afetada, email do admin, IP, timestamp
- Logar tentativas de autenticação falhadas (sem armazenar password)
- Logar chamadas ao webhook Telegram (sucesso e falha)
- Não logar dados pessoais ou tokens

**A10 — Server-Side Request Forgery (SSRF)**
- Validar e sanitizar qualquer URL externa antes de fazer fetch server-side
- O campo `external_link` dos relógios deve aceitar apenas URLs de domínios conhecidos
  (vinted.pt, chrono24.com e similares) — validar com allowlist

### MITRE ATT&CK — Mitigações Relevantes

**T1195.002 — Supply Chain Compromise (npm)**
- Mitigação: versões pinadas sem `^` ou `~`, `npm ci` em produção, `package-lock.json` no git,
  verificação de pacotes antes de instalar (popularidade, mantenedores, histórico), socket.dev,
  rever scripts `postinstall` de dependências, `npm audit signatures`

**T1190 — Exploit Public-Facing Application**
- Mitigação: validação rigorosa de inputs (Zod), ORM parametrizado, security headers, rate limiting

**T1078 — Valid Accounts (roubo de credenciais)**
- Mitigação: rate limiting no login, mensagens de erro genéricas, sessões com expiração,
  logout que invalida server-side

**T1110 — Brute Force**
- Mitigação: Upstash rate limiting por IP na rota de login — bloquear após 5 falhas/15 min

**T1059.007 — JavaScript (XSS)**
- Mitigação: React escapa por defeito, CSP header restritivo, sanitização de conteúdo Markdown

**T1505.003 — Web Shell**
- Mitigação: validar tipo MIME de ficheiros em upload, aceitar apenas imagens (JPEG/PNG/WebP),
  limitar tamanho (máx 5MB por imagem), não executar ficheiros uploaded,
  guardar em Supabase Storage com nome aleatório (UUID)

**T1566 — Phishing (formulário de contacto como vetor)**
- Mitigação: rate limiting no formulário de contacto, validação de email com Zod,
  não redirecionar para URLs submetidas pelo utilizador

---

## Qualidade de Código

- **TypeScript strict mode** ativado em `tsconfig.json` (`strict: true`)
- **ESLint** com config Next.js + regras adicionais de segurança (`no-eval`, `no-implied-eval`)
- **Prettier** para formatação consistente
- **Tratamento de erros** em todas as API routes com respostas padronizadas:
  ```typescript
  { success: boolean, data?: T, error?: string }
  ```
- **Loading states** e **error boundaries** em todos os Server Components
- **Skeleton loaders** nas listas de relógios e blog
- **Server Components por defeito** — só usar `use client` onde estritamente necessário
  (formulários com estado, componentes interativos)
- **Zod schemas** exportados de `src/lib/validations/` e reutilizados tanto no cliente como servidor
- **Comentários em código complexo** — especialmente lógica de segurança e integrações externas
- **Sem `any` em TypeScript** — tipar tudo adequadamente
- **Sem `console.log` em produção** — usar abstração de logging

---

## Variáveis de Ambiente

Criar `.env.example` com todas as variáveis necessárias:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Metals API (preços de metais preciosos)
METALS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Cron Jobs
CRON_SECRET=
```

---

## Ordem de Implementação Sugerida

1. Setup do projeto Next.js + TypeScript + Tailwind + ESLint + Prettier
   - Pinar todas as versões no package.json sem `^` ou `~`
   - Verificar cada dependência instalada: popularidade, mantenedores, histórico de segurança
   - Commitar o `package-lock.json` imediatamente e nunca o ignorar
   - Usar `npm ci` em todos os passos seguintes em vez de `npm install`
2. Schema da BD (Drizzle) + configuração do Supabase (Auth, Storage, tabelas)
3. Middleware de autenticação + proteção de rotas `/admin/*` e APIs protegidas
4. Security headers em `next.config.ts` + rate limiting base com Upstash
5. Integração dos componentes do Claude Design (adaptar HTML/React → Next.js components)
6. **Gestão de relógios — Admin:**
   a. API routes CRUD completas (`/api/relogios/`)
   b. API route de mudança de status (`/api/relogios/[id]/status`)
   c. API route de upload e remoção de imagens (`/api/upload` + `/api/relogios/[id]/imagens`)
   d. Listagem no admin com filtros, bulk actions e paginação
   e. Formulário de criação com upload drag & drop
   f. Formulário de edição com gestão de imagens inline
7. Site público — todas as páginas com dados reais da BD (catálogo, detalhe, homepage)
   - Incluir formulário de lead em cada página de relógio (disponível e vendido)
   - Notificações Telegram + email ao admin em cada submissão
8. Página Mercado — preços de metais via Metals.dev (ISR 1h) + secção relógios em alta
9. Gestão de "Relógios em Alta" no admin (`/admin/mercado`)
10. Sistema de blog com IA (Claude API + bot Telegram + webhook)
11. Gestão de blog no admin (tabela, editor Markdown, fluxo de aprovação)
12. Gestão de leads no admin (listagem, filtros, marcar como lido, badge na sidebar)
13. Dashboard admin com métricas reais (incluindo contador de leads não lidos)
14. Analytics próprio (tracking + gráficos)
15. Formulário de contacto com Resend + vista de mensagens no admin
16. Audit logging em todas as ações
17. SEO (metadata dinâmica, sitemap.xml, robots.txt)
18. Relatório semanal (cron job Vercel + agregação analytics + mensagem Telegram formatada)
19. Definições do admin (alterar password, info do site, toggle relatório semanal)
20. Revisão final de segurança: testar OWASP Top 10, verificar headers, `npm audit`,
    rever todas as dependências instaladas com `npm ls`, correr `npm audit signatures`

---

## README

Gera um `README.md` completo com:
- Descrição do projeto e funcionalidades
- Pré-requisitos e instalação passo a passo
- Configuração de todas as variáveis de ambiente (o que cada uma faz)
- Como configurar o Supabase (Auth, Storage, tabelas)
- Como configurar o bot Telegram e o webhook
- Comandos disponíveis (`dev`, `build`, `db:push`, `db:migrate`)
- Considerações de segurança e como fazer `npm audit`
- Deploy no Vercel (variáveis de ambiente necessárias)
