import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { NextRequest, NextResponse } from "next/server";

import { sanitizeCartItems, type CartItem } from "@/domain/cart/types";

const CART_COOKIE = "cartSessionId";
const STORE_PATH = join(tmpdir(), "shopee-mini-cart-store.json");

type CartStore = Record<string, CartItem[]>;

async function readStore(): Promise<CartStore> {
  try {
    const file = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(file);
    if (parsed && typeof parsed === "object") {
      return parsed as CartStore;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Failed to read cart store", error);
    }
  }
  return {};
}

async function writeStore(store: CartStore) {
  await writeFile(STORE_PATH, JSON.stringify(store));
}

function getSession(request: NextRequest) {
  const cookie = request.cookies.get(CART_COOKIE);
  if (cookie?.value) {
    return { id: cookie.value, isNew: false };
  }
  return { id: randomUUID(), isNew: true };
}

function attachSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const { id, isNew } = getSession(request);
  const store = await readStore();
  const items = store[id] ?? [];
  const response = NextResponse.json({ items });
  return isNew ? attachSessionCookie(response, id) : response;
}

export async function PUT(request: NextRequest) {
  const { id, isNew } = getSession(request);
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sanitized = sanitizeCartItems((payload as { items?: unknown })?.items ?? []);
  const store = await readStore();
  store[id] = sanitized;
  await writeStore(store);
  const response = NextResponse.json({ items: sanitized });
  return isNew ? attachSessionCookie(response, id) : response;
}
