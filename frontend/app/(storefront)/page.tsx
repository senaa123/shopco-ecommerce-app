/**
 * Storefront home page.
 *
 * Placeholder — the real landing page (hero, featured products, category grid)
 * is built in a later prompt.
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        ShopCo
      </h1>
      <p className="max-w-md text-primary-500">
        Storefront scaffold. Nothing to see here yet.
      </p>
      <button
        type="button"
        className="rounded-pill bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Shop now
      </button>
    </main>
  );
}
