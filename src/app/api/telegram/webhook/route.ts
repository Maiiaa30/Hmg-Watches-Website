import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAudit } from "@/lib/auth/utils";

interface TelegramUpdate {
  update_id: number;
  callback_query?: {
    id: string;
    from: { id: number; first_name: string };
    message?: { message_id: number; chat: { id: number } };
    data?: string;
  };
}

export async function POST(request: NextRequest) {
  // Verify the Telegram webhook secret token (sent by Telegram on each call).
  // Fail closed: if the secret is unset/empty we reject outright, otherwise an
  // unconfigured deploy would accept unauthenticated POSTs from anyone.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const signature = request.headers.get("x-telegram-bot-api-secret-token");
  if (signature !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json() as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const callbackQuery = update.callback_query;
  if (!callbackQuery?.data) {
    return NextResponse.json({ ok: true });
  }

  const [action, postId] = callbackQuery.data.split(":");
  if (!postId) return NextResponse.json({ ok: true });

  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  // Identify the approver for the audit trail (Telegram name, not an admin email).
  const approver = `telegram:${callbackQuery.from.first_name ?? callbackQuery.from.id}`;

  if (action === "publish_post") {
    const [post] = await db
      .update(blogPosts)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(blogPosts.id, postId))
      .returning({ title: blogPosts.title });

    if (chatId && messageId && post) {
      await answerCallback(callbackQuery.id, "✅ Publicado!");
      await editMessage(chatId, messageId, `✅ *Publicado:* ${post.title}`);
    }
    if (post) {
      await logAudit({ action: "blog.published", entity: "blog_posts", entityId: postId, adminEmail: approver, request });
    }
  } else if (action === "delete_post") {
    const [post] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, postId))
      .returning({ title: blogPosts.title });

    if (chatId && messageId && post) {
      await answerCallback(callbackQuery.id, "🗑️ Eliminado.");
      await editMessage(chatId, messageId, `🗑️ *Eliminado:* ${post.title}`);
    }
    if (post) {
      await logAudit({ action: "blog.deleted", entity: "blog_posts", entityId: postId, adminEmail: approver, request });
    }
  }

  return NextResponse.json({ ok: true });
}

async function answerCallback(callbackQueryId: string, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    }
  );
}

async function editMessage(chatId: number, messageId: number, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "Markdown",
      }),
    }
  );
}
