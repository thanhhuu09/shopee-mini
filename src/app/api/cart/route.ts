import { NextRequest, NextResponse } from "next/server";

import { sanitizeCartItems, type CartItem } from "@/domain/cart/types";

const CART_COOKIE = "cartPayload";

function decodeCartCookie(request: NextRequest) {
  const raw = request.cookies.get(CART_COOKIE)?.value;
  if (!raw) {
    return [];
  }

  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as { items?: unknown };
    return sanitizeCartItems(parsed?.items ?? []);
  } catch (error) {
    console.error("Failed to decode cart cookie", error);
    return [];
  }
}

function encodeCartCookie(items: CartItem[]) {
  const payload = JSON.stringify({ items });
  return Buffer.from(payload, "utf8").toString("base64url");
}

function withCartCookie(response: NextResponse, items: CartItem[]) {
  response.cookies.set(CART_COOKIE, encodeCartCookie(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const items = decodeCartCookie(request);
  return NextResponse.json({ items });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sanitized = sanitizeCartItems((payload as { items?: unknown })?.items ?? []);
  const response = NextResponse.json({ items: sanitized });
  return withCartCookie(response, sanitized);
}
