/**
 * Test if an object is transferable
 * @param x Object
 */
export function isTransferableObject(x: any) {
  return (
    x instanceof ArrayBuffer ||
    x instanceof MessagePort ||
    (globalThis.ImageBitmap && x instanceof ImageBitmap) ||
    (globalThis.OffscreenCanvas && x instanceof OffscreenCanvas)
  );
}
