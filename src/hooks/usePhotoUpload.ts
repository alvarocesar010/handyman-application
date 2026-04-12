import { useState, useCallback } from "react";

interface UploadResult {
  publicUrl: string;
  objectPath: string;
}

export function usePhotoUpload(initialUrl = "", initialPath = "") {
  const [preview, setPreview] = useState(initialUrl);
  const [path, setPath] = useState(initialPath);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Handle selection (Local Preview)
  const selectImage = useCallback((file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setPendingFile(file);
  }, []);

  // 2. Clear image
  const removeImage = useCallback(() => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview("");
    setPath("");
    setPendingFile(null);
  }, [preview]);

  // 3. The actual Upload Logic
  const uploadToServer = useCallback(
    async (folder: string, slug: string): Promise<UploadResult | null> => {
      if (!pendingFile) return { publicUrl: preview, objectPath: path };

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", pendingFile);
        formData.append("folder", folder);
        formData.append("slug", slug);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        // Update local state with real cloud data
        setPreview(data.publicUrl);
        setPath(data.objectPath);
        setPendingFile(null); // Clear the queue

        return { publicUrl: data.publicUrl, objectPath: data.objectPath };
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [pendingFile, preview, path],
  );

  return {
    preview,
    path,
    isUploading,
    selectImage,
    removeImage,
    uploadToServer,
    hasPendingUpload: !!pendingFile,
  };
}
