import { NextRequest, NextResponse } from "next/server";

import { sanitizeCartItems, type CartItem } from "@/domain/cart/types";

const CART_COOKIE = "cartSessionId";

type CartStore = Map<string, CartItem[]>;

const globalCart = globalThis as typeof globalThis & { __cartStore?: CartStore };
const cartStore: CartStore = globalCart.__cartStore ?? new Map();
if (!globalCart.__cartStore) {
  globalCart.__cartStore = cartStore;
}

function getSessionId(request: NextRequest) {
  const cookie = request.cookies.get(CART_COOKIE);
  return { id: cookie?.value ?? crypto.randomUUID(), isNew: !cookie };
}

function buildResponse(request: NextRequest, sessionId: string, body: unknown) {
  const response = NextResponse.json(body);
  if (!request.cookies.get(CART_COOKIE)?.value || request.cookies.get(CART_COOKIE)?.value !== sessionId) {
    response.cookies.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
}

export async function GET(request: NextRequest) {
  const { id } = getSessionId(request);
  const items = cartStore.get(id) ?? [];
  return buildResponse(request, id, { items });
}

export async function PUT(request: NextRequest) {
  const { id } = getSessionId(request);
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = sanitizeCartItems((parsed as { items?: unknown })?.items ?? []);
  cartStore.set(id, items);
  return buildResponse(request, id, { items });
}
