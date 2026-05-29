import type { DemoUser } from "./types";

export const SESSION_COOKIE = "contextads_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret(): string | null {
  return process.env.AUTH_SESSION_SECRET ?? process.env.AUTH_PASSWORD ?? null;
}

export function getAllowedEmails(): string[] {
  return (process.env.AUTH_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_PASSWORD && getAllowedEmails().length > 0);
}

export function validateCredentials(email: string, password: string): boolean {
  if (!isAuthConfigured()) return false;

  const normalizedEmail = email.trim().toLowerCase();
  return (
    getAllowedEmails().includes(normalizedEmail) &&
    password === process.env.AUTH_PASSWORD
  );
}

export function userFromEmail(email: string): DemoUser {
  const normalized = email.trim().toLowerCase();
  const localPart = normalized.split("@")[0] ?? "User";
  const name = localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    id: normalized,
    name: name || "User",
    email: normalized,
    role: "Member",
    workspaceName: "Workspace",
  };
}

function encodePayload(payload: SessionPayload): string {
  return btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodePayload(payloadB64: string): SessionPayload {
  const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(padded);
  return JSON.parse(json) as SessionPayload;
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return bufferToBase64Url(signature);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createSessionToken(email: string): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadB64 = encodePayload(payload);
  const signature = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = await hmacSign(payloadB64, secret);
  if (signature.length !== expected.length) return null;

  let match = 0;
  for (let i = 0; i < signature.length; i++) {
    match |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (match !== 0) return null;

  try {
    const payload = decodePayload(payloadB64);
    if (!payload.email || !payload.exp || Date.now() > payload.exp) return null;
    if (!getAllowedEmails().includes(payload.email.toLowerCase())) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE_SECONDS };
