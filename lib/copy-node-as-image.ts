import { toBlob } from "html-to-image";

async function renderNodeToPng(node: HTMLElement): Promise<Blob> {
  const options = { pixelRatio: 2, cacheBust: true };
  // Safari can drop <img> content on the first foreignObject render.
  await toBlob(node, options);
  const blob = await toBlob(node, options);
  if (!blob) {
    throw new Error("Failed to render image");
  }
  return blob;
}

export function canCopyImages(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard?.write &&
    typeof ClipboardItem !== "undefined"
  );
}

export async function copyNodeAsImage(node: HTMLElement): Promise<void> {
  if (!canCopyImages()) {
    throw new Error("Clipboard images are not supported in this browser");
  }
  // The promise must be handed to ClipboardItem synchronously so Safari
  // still treats the write as part of the user gesture.
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": renderNodeToPng(node) }),
  ]);
}
