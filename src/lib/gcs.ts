import { Storage } from "@google-cloud/storage";

let cachedStorage: Storage | null = null;

function getStorage() {
  if (!cachedStorage) cachedStorage = new Storage();
  return cachedStorage;
}

function getBucketName(): string {
  const name = process.env.GCS_BUCKET_NAME;
  if (!name) {
    // IMPORTANT: only throw at runtime (when a request happens)
    throw new Error("Missing GCS_BUCKET_NAME");
  }
  return name;
}

function safeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

function inferExt(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

/** Uploads image and returns object path (not URL) */
export async function uploadReviewImage(opts: {
  serviceSlug: string;
  file: File;
}) {
  const { serviceSlug, file } = opts;

  const storage = getStorage();
  const bucket = storage.bucket(getBucketName());

  const slug = safeSlug(serviceSlug);
  const ext = inferExt(file.type);

  const objectPath = `reviews/${slug}/${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await bucket.file(objectPath).save(buffer, {
    resumable: false,
    contentType: file.type,
  });

  return objectPath;
}

/** Generates a temporary signed URL */
export async function signImage(objectPath: string, expiresSeconds = 3600) {
  const storage = getStorage();
  const bucket = storage.bucket(getBucketName());

  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + expiresSeconds * 1000,
  });

  return url;
}
