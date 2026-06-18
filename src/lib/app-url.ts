// Normalized public app URL. Tolerates a missing protocol or a malformed
// NEXT_PUBLIC_APP_URL so it can never throw at build time.
function normalize(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const APP_URL = normalize();
