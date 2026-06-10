"use client";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold mb-4 text-accent">⚙ ARMORY</h2>
            <p className="text-sm text-text-muted">
              Premium tactical equipment and shooting range accessories for professionals and enthusiasts.
            </p>
          </div>
          <div>
            <h2 className="font-bold mb-4 text-text-primary">Delivery</h2>
            <p className="text-sm text-text-muted">
              Fast delivery with tracking. Orders processed within 24 hours.
            </p>
          </div>
          <div>
            <h2 className="font-bold mb-4 text-text-primary">Returns</h2>
            <p className="text-sm text-text-muted">
              7-day returns for damaged or defective items. Full refunds guaranteed.
            </p>
          </div>
          <div>
            <h2 className="font-bold mb-4 text-text-primary">Security</h2>
            <p className="text-sm text-text-muted">
              Your data is secure. Cash on Delivery for maximum privacy.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; 2026 ARMORY. Professional Equipment Delivered.
          </p>
          <nav aria-label="Footer Links" className="mt-4">
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="text-text-muted hover:text-accent transition">Privacy</a>
              <a href="#" className="text-text-muted hover:text-accent transition">Terms</a>
              <a href="#" className="text-text-muted hover:text-accent transition">Contact</a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
