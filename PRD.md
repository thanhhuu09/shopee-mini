# Shopee Mini MVP

## Goals
- Deliver a miniature Shopee-like shopping experience that demonstrates end-to-end commerce: browse catalog, view product details, manage cart, checkout, and see success confirmation.
- Provide a lightweight admin console that supports CRUD for products to keep the storefront data accurate.
- Prove baseline quality with Playwright E2E coverage for smoke flows before shipping any feature to production.

## MVP Scope
- Public storefront with catalog listing, product detail view, cart, checkout (shipping + payment info capture), and order success page.
- Persistent cart scoped to browser session and order creation stored server-side.
- Admin dashboard gated behind basic auth for CRUD over products (create, read, update, delete).
- Playwright smoke tests for customer happy paths plus admin CRUD sanity.

## Non-goals
- Advanced marketing features (search, promotions, vouchers, recommendations, reviews).
- Multi-warehouse inventory, fulfillment, or logistics integrations.
- Payments capture with real gateways (mock only) or order management beyond creation.
- Authentication for buyers (guest checkout only in MVP).

## User Flows
1. **Buyer: Catalog to Checkout**
   - Landing page lists published products with pagination or lazy load.
   - Selecting a product opens a detail page with gallery, price, description, inventory, and add-to-cart button.
   - Buyer can adjust quantity, add to cart, review cart, update/remove items, then proceed to checkout.
   - Checkout captures contact, shipping address, payment selection (mock), summarizes order, and submits.
   - Order success page shows order number, summary, and link back to catalog.
2. **Admin: Product CRUD**
   - Admin signs in through protected route (simple credential gate or .env password).
   - Admin list view shows all products with status, price, stock.
   - Admin can create new product, edit existing product fields, or archive/delete a product.
   - Changes immediately affect storefront catalog.
3. **Quality: E2E Smoke**
   - Automated Playwright suite covers buyer happy path (catalog -> detail -> cart -> checkout -> success) and admin CRUD sanity (create + edit + delete product) runnable in CI.

## Functional Requirements
- Catalog lists only active products, sorted by newest or highest priority.
- Product detail page shows title, price, description, stock count, and allows quantity selection with validation.
- Cart supports add/update/remove, displays per-item and total costs, and persists per session.
- Checkout form validates required fields before enabling submit; submission creates Order and associated OrderItems.
- Success page loads order summary data using order identifier from checkout response.
- Admin dashboard enforces authentication via environment-configured credentials; unauthenticated users redirected to login.
- Admin forms cover Product fields: title, slug, description, price, currency, media URL(s), inventory quantity, active flag.
- CRUD operations persist to backing store (e.g., JSON DB or hosted DB) and update timestamps.
- Playwright tests run headless in CI and must pass before merge to main.

## Data Model
- **Product**: `id`, `slug`, `title`, `description`, `price`, `currency`, `inventory`, `media` (array of URLs), `isActive`, `createdAt`, `updatedAt`.
- **Order**: `id`, `orderNumber`, `customerName`, `email`, `phone`, `shippingAddress` (structured fields), `paymentMethod`, `subtotal`, `shippingFee`, `total`, `status`, `createdAt`.
- **OrderItem**: `id`, `orderId`, `productId`, `productTitleSnapshot`, `unitPrice`, `quantity`, `lineTotal`.

## Non-functional Requirements
- Page load under 2 seconds on broadband for catalog and detail pages with <= 20 products.
- Responsive layouts for mobile-first; desktop support down to 1024px.
- Accessibility: semantic HTML, focus management, minimum AA contrast.
- Observability hooks (console/log statements) for checkout errors and admin mutations.
- Automated linting, type checking, and Playwright smoke suites run in CI before deploy.

## Technical Constraints
- Framework: Next.js App Router with TypeScript.
- Styling via existing stack (CSS Modules/Tailwind) to stay consistent with repo.
- State management should rely on React Server/App Router patterns; avoid adding heavy external stores unless justified.
- Use built-in Next.js API routes or app actions for CRUD; no additional backend services for MVP.
- Persist data using lightweight storage approved by team (e.g., file-based mock DB or hosted Supabase) but abstracted for swap.

## Acceptance Criteria
- Buyers can complete catalog -> detail -> cart -> checkout -> success without console errors; verified by Playwright smoke test.
- Admin can create, update, and delete a product with validation errors surfaced inline.
- Lint (`npm run lint`), build (`npm run build`), and Playwright tests all pass on CI for main branch.
- Documentation (this PRD, AGENTS, tasks) remains in repo and referenced by contributors.

## Open Questions
- Do we need localization or multi-currency toggles in MVP?
- Is there a preferred storage solution (local JSON, SQLite, Supabase) for product/order persistence?
- Should admin CRUD changes require audit logging (who changed what)?
- Are there performance targets for concurrent shoppers beyond smoke traffic?
- What authentication mechanism is acceptable for admin long term (basic auth vs OAuth)?
