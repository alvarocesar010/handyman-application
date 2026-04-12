import { Storage } from "@google-cloud/storage";

let cachedStorage: Storage | null = null;

function getStorage() {
  if (!cachedStorage) cachedStorage = new Storage();
  return cachedStorage;
}

function getBucketName(): string {
  const name = process.env.GCS_BUCKET_NAME;
  if (!name) throw new Error("Missing GCS_BUCKET_NAME");
  return name;
}

function safeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

export async function uploadImage(opts: {
  folder: string;
  entitySlug?: string;
  file: Buffer;
  contentType: string;
}) {
  const { folder, entitySlug, file, contentType } = opts;

  const storage = getStorage();
  const bucket = storage.bucket(getBucketName());

  const safeEntity = entitySlug ? safeSlug(entitySlug) : "general";

  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.webp`;

  const objectPath = `${folder}/${safeEntity}/${fileName}`;

  await bucket.file(objectPath).save(file, {
    resumable: false,
    contentType,
  });

  return {
    objectPath,
    publicUrl: `https://storage.googleapis.com/${bucket.name}/${objectPath}`,
  };
}

export async function deleteImage(objectPath: string) {
  const storage = getStorage();
  const bucket = storage.bucket(getBucketName());

  await bucket
    .file(objectPath)
    .delete()
    .catch(() => {});
}
