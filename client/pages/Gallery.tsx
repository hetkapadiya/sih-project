import * as React from "react";

const photos = [
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1200&auto=format&fit=crop",
];

export default function Gallery() {
  React.useEffect(() => {
    document.title = "Gallery — AlumniHub";
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>
      <p className="text-muted-foreground mb-8">Moments from reunions, convocations, chapters, and campus life.</p>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {photos.map((src, i) => (
          <img key={i} src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-44 md:h-56 object-cover rounded-md shadow" />
        ))}
      </div>
    </div>
  );
}
