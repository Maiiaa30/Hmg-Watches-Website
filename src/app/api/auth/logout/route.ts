import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/utils";
import { APP_URL } from "@/lib/app-url";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", APP_URL), { status: 303 });
}
