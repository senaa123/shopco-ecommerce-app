/**
 * Reads an image `File` chosen from the device, downscales it (so the base64
 * payload stays small — a few hundred KB at most) and returns a JPEG data URI
 * that can be stored straight in `ProductImage.url`.
 */
export async function fileToResizedDataUrl(
  file: File,
  maxDimension = 1000,
  quality = 0.82,
): Promise<string> {
  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not decode the image"));
    el.src = originalDataUrl;
  });

  const scale = Math.min(
    1,
    maxDimension / Math.max(image.width, image.height || 1),
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return originalDataUrl;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function isDataUri(value: string): boolean {
  return value.startsWith("data:");
}
