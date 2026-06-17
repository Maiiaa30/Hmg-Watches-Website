import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { MensagensList, type MessageRow } from "@/components/admin/MensagensList";

export const revalidate = 0;

export default async function AdminMensagensPage() {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  const messages: MessageRow[] = rows.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt,
  }));

  return (
    <AdminShell title="Mensagens">
      <MensagensList messages={messages} />
    </AdminShell>
  );
}
