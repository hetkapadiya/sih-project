import React from "react";
import { useAuth } from "@/context/AuthProvider";

function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cr = e.contentRect;
        setSize({ width: cr.width, height: cr.height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, size] as const;
}

export default function AlumniDensityMap() {
  const { getUsers } = useAuth();
  const users = React.useMemo(
    () => getUsers().filter((u) => u.role === "alumni"),
    [getUsers],
  );
  const points = users.filter(
    (u) =>
      u.location &&
      typeof u.location.lat === "number" &&
      typeof u.location.lng === "number",
  );

  const [wrapRef, size] = useElementSize<HTMLDivElement>();

  const grouped = React.useMemo(() => {
    const centroids: Record<string, { lat: number; lng: number }> = {
      India: { lat: 22.9734, lng: 78.6569 },
      USA: { lat: 39.8283, lng: -98.5795 },
      "United Kingdom": { lat: 55.3781, lng: -3.436 },
      Japan: { lat: 36.2048, lng: 138.2529 },
      Australia: { lat: -25.2744, lng: 133.7751 },
      Canada: { lat: 56.1304, lng: -106.3468 },
    };

    const byCountry = new Map<
      string,
      { name: string; pts: { lat: number; lng: number }[] }
    >();
    const byPoint = new Map<
      string,
      { lat: number; lng: number; count: number; name: string }
    >();

    for (const u of points) {
      const loc = u.location!;
      const country = (loc.country || "").trim();
      if (country) {
        const cur = byCountry.get(country) || { name: country, pts: [] };
        cur.pts.push({ lat: loc.lat, lng: loc.lng });
        byCountry.set(country, cur);
      } else {
        const key = `${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;
        const name =
          [loc.city, loc.country].filter(Boolean).join(", ") || "Unknown";
        const cur = byPoint.get(key) || {
          lat: loc.lat,
          lng: loc.lng,
          count: 0,
          name,
        };
        cur.count += 1;
        byPoint.set(key, cur);
      }
    }

    const out: { lat: number; lng: number; count: number; name: string }[] = [];

    for (const [country, rec] of byCountry) {
      const cnt = rec.pts.length;
      if (centroids[country]) {
        const c = centroids[country];
        out.push({ lat: c.lat, lng: c.lng, count: cnt, name: country });
      } else {
        const avg = rec.pts.reduce(
          (a, p) => ({ lat: a.lat + p.lat, lng: a.lng + p.lng }),
          { lat: 0, lng: 0 },
        );
        out.push({
          lat: avg.lat / cnt,
          lng: avg.lng / cnt,
          count: cnt,
          name: country,
        });
      }
    }

    for (const v of byPoint.values()) out.push(v);

    return out;
  }, [points]);

  const max = grouped.reduce((m, p) => Math.max(m, p.count), 1);

  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * size.width;
    const y = ((90 - lat) / 180) * size.height;
    return { left: x, top: y };
  };

  const [zoom, setZoom] = React.useState(1);
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: "2 / 1" }}
      ref={wrapRef}
    >
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-9 h-9 rounded bg-white text-foreground shadow border"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-9 h-9 rounded bg-white text-foreground shadow border"
        >
          -
        </button>
      </div>

      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2048px-World_map_-_low_resolution.svg.png"
          alt="World map"
          className="absolute inset-0 w-full h-full object-cover opacity-95 rounded-md brightness-105 contrast-105"
        />
        {grouped.map((p, i) => {
          const pos = project(p.lat, p.lng);
          const r = 6 + Math.round((p.count / max) * 18);
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: pos.left, top: pos.top }}
            >
              <div
                title={`${p.name} — ${p.count} alumni`}
                className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/85 ring-2 ring-white/80 shadow flex items-center justify-center text-white font-semibold"
                style={{
                  width: r,
                  height: r,
                  fontSize: Math.max(10, Math.min(14, Math.floor(r / 1.5))),
                }}
              >
                {p.count}
              </div>
            </div>
          );
        })}
      </div>

      {grouped.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          No alumni locations available yet.
        </div>
      )}
    </div>
  );
}
