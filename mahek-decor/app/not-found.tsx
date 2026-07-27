import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-7xl md:text-8xl font-bold text-ink tracking-tight mb-4">404</p>
        <h1 className="text-xl md:text-2xl font-semibold text-ink mb-3">
          This page could not be found.
        </h1>
        <p className="text-secondary-text mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to shopping.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-forest text-white font-medium text-sm transition-all duration-300 hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/20"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-forest font-medium text-sm border border-forest/20 transition-all duration-300 hover:bg-forest/5 hover:border-forest/40"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
