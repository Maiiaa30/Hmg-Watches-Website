import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/admin/login");

  return <>{children}</>;
}
