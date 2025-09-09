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
    const map = new Map<
      string,
      { lat: number; lng: number; count: number; city: string; country: string }
    >();
    for (const u of points) {
      const { lat, lng, city, country } = u.location!;
      const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      const cur = map.get(key);
      if (cur) cur.count += 1;
      else map.set(key, { lat, lng, count: 1, city, country });
    }
    return Array.from(map.values());
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
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png"
          alt="World map"
          className="absolute inset-0 w-full h-full object-cover opacity-90 rounded-md"
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
                title={`${p.city}, ${p.country} — ${p.count} alumni`}
                className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 ring-2 ring-white/70 shadow"
                style={{ width: r, height: r }}
              />
              <div className="-translate-x-1/2 translate-y-1 text-[10px] text-white font-semibold drop-shadow text-center">
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
