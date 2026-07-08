import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";
import { assertAdmin, rateLimit } from "@/lib/security";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm"
]);

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!assertAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 422 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 415 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo acima de 20 MB." }, { status: 413 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const destination = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    file: {
      name: file.name,
      url: `/uploads/${filename}`,
      type: file.type,
      size: file.size
    }
  });
}
