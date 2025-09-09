import * as React from "react";

export default function NewsTicker({ items = [] }: { items?: string[] }) {
  return (
    <div className="w-full overflow-hidden bg-primary py-2 text-primary-foreground">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 text-sm">
          <strong className="mr-3">Latest:</strong>
          <div className="relative overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap will-change-transform">
              {(items.length === 0 ? ["Welcome to AlumniHub — stay connected with events and news."] : items).map((t, i) => (
                <span key={`a-${i}`} className="inline-block whitespace-nowrap mr-12">{t}</span>
              ))}
              {(items.length === 0 ? ["Welcome to AlumniHub — stay connected with events and news."] : items).map((t, i) => (
                <span key={`b-${i}`} aria-hidden className="inline-block whitespace-nowrap mr-12">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }
        .animate-marquee { display: inline-flex; gap: 0; animation: marquee 18s linear infinite; }
      `}</style>
    </div>
  );
}
