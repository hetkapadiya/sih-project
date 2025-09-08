import * as React from "react";

export default function NewsTicker({ items = [] }: { items?: string[] }) {
  return (
    <div className="w-full overflow-hidden bg-primary py-2 text-primary-foreground">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 text-sm">
          <strong className="mr-3">Latest:</strong>
          <div className="flex gap-6 animate-marquee">
            {items.length === 0 ? (
              <span>Welcome to AlumniHub — stay connected with events and news.</span>
            ) : (
              items.map((t, i) => (
                <span key={i} className="whitespace-nowrap">{t}</span>
              ))
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }
        .animate-marquee { display: inline-flex; gap: 3rem; animation: marquee 18s linear infinite; }
      `}</style>
    </div>
  );
}
