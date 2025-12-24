import { Storage } from "@google-cloud/storage";

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) throw new Error("Missing GCS_BUCKET_NAME");

const storage = new Storage();
const bucket = storage.bucket(bucketName);

function safeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

function inferExt(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

export async function uploadReviewImage(opts: {
  serviceSlug: string;
  file: File;
}) {
  const { serviceSlug, file } = opts;

  const slug = safeSlug(serviceSlug);
  const ext = inferExt(file.type);

  const objectPath = `reviews/${slug}/${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${ext}`;

  const gcsFile = bucket.file(objectPath);
  const buffer = Buffer.from(await file.arrayBuffer());

  await gcsFile.save(buffer, {
    resumable: false,
    contentType: file.type,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
  });

  // ⬅️ return ONLY the object path
  return objectPath;
}

export async function signImage(objectPath: string, expiresSeconds = 3600) {
  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + expiresSeconds * 1000,
  });

  return url;
}
