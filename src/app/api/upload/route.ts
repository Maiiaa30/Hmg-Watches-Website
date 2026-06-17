import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/utils";
import {
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_IMAGE_MAGIC_BYTES,
} from "@/constants";
import { randomUUID } from "crypto";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const watchId = form.get("watchId") as string | null;

  if (!(file instanceof File)) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Ficheiro em falta." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Ficheiro demasiado grande. Máximo: ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // Read bytes for MIME validation
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Detect real MIME from magic bytes
  let detectedMime: string | null = null;
  for (const [mime, signatures] of Object.entries(ALLOWED_IMAGE_MAGIC_BYTES)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => bytes[i] === byte)) {
        detectedMime = mime;
        break;
      }
    }
    if (detectedMime) break;
  }

  if (!detectedMime || !ALLOWED_IMAGE_MIME_TYPES.includes(detectedMime)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Tipo de ficheiro não permitido. Apenas JPEG, PNG e WebP." },
      { status: 400 }
    );
  }

  const ext = detectedMime === "image/jpeg" ? "jpg" : detectedMime === "image/png" ? "png" : "webp";
  const uuid = randomUUID();
  const path = watchId ? `${watchId}/${uuid}.${ext}` : `${uuid}.${ext}`;

  // Upload to Supabase Storage
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Storage não configurado." }, { status: 500 });
  }

  const uploadRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/watch-images/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": detectedMime,
        "x-upsert": "false",
      },
      body: buffer,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro no upload." }, { status: 500 });
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/watch-images/${path}`;

  return NextResponse.json<ApiResponse>({ success: true, data: { url: publicUrl, path } }, { status: 201 });
}
