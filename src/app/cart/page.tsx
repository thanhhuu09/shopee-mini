import { CartView } from "@/components/cart/cart-view";

export default function CartPage() {
  return (
    <div className="bg-orange-50/40">
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Review order
          </p>
          <h1 className="text-4xl font-bold text-zinc-950">Your cart</h1>
          <p className="text-sm text-zinc-600">
            Update quantities or remove items before continuing to checkout.
          </p>
        </header>
        <CartView />
      </main>
    </div>
  );
}
