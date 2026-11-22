import { getEnv } from "@/lib/env";

function decodeHex(value: string): Uint8Array | null {
  if (value.length === 0 || value.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(value)) {
    return null;
  }

  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return difference === 0;
}

export async function verifyPaymobSignature(
  payload: string,
  signatureHeader: string | null,
): Promise<boolean> {
  const secret = getEnv().PAYMOB_SECRET_KEY;
  if (!secret || !signatureHeader) {
    return false;
  }

  const provided = decodeHex(signatureHeader);
  if (!provided) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = new Uint8Array(
    await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );

  return constantTimeEqual(expected, provided);
}
