import { Storage } from "@google-cloud/storage";

let cachedStorage: Storage | null = null;

function getStorage() {
  if (!cachedStorage) cachedStorage = new Storage();
  return cachedStorage;
}

function getBucketName(): string {
  const name = process.env.GCS_BUCKET_NAME;
  if (!name) {
    throw new Error("Missing GCS_BUCKET_NAME");
  }
  return name;
}

function safeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

/** Uploads optimized image buffer and returns object path */
export async function uploadReviewImage(opts: {
  serviceSlug: string;
  file: Buffer; // ✅ now buffer
  contentType: string; // ✅ explicit
  prov: string;
}) {
  const { serviceSlug, file, contentType, prov } = opts;

  const storage = getStorage();
  const bucket = storage.bucket(getBucketName());

  const slug = safeSlug(serviceSlug);

  // since we convert to webp, force extension
  const ext = "webp";

  const objectPath = `${prov}/${slug}/${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${ext}`;

  await bucket.file(objectPath).save(file, {
    resumable: false,
    contentType,
  });

  return objectPath;
}
