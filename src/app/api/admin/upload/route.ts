import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/uploadImage";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const folder = String(formData.get("folder") || "general");
    const slug = formData.get("slug") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔥 OPTIMISATION PIPELINE
    const optimised = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const result = await uploadImage({
      folder,
      entitySlug: slug || undefined,
      file: optimised,
      contentType: "image/webp",
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
