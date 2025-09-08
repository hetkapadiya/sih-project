import React from "react";

export default function QuickLinks() {
  const links = [
    { title: "Alumni Services", href: "/alumni-login" },
    { title: "Student Portal", href: "/student-login" },
    { title: "Events", href: "#events" },
    { title: "Donate", href: "#" },
    { title: "Mentorship", href: "#" },
    { title: "Contact", href: "#contact" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {links.map((l) => (
        <a key={l.title} href={l.href} className="p-3 rounded-md bg-card border hover:shadow-sm text-sm text-foreground text-center">{l.title}</a>
      ))}
    </div>
  );
}
