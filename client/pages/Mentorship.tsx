import * as React from "react";

export default function Mentorship() {
  React.useEffect(() => {
    document.title = "Mentorship — AlumniHub";
  }, []);
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-3">Mentorship Program</h1>
        <p className="text-muted-foreground mb-8">
          Connect alumni and students for guidance, career advice, and
          networking. Join as a mentor or mentee.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-md border">
            <h2 className="text-xl font-semibold mb-2">Become a Mentor</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Share your experience and help the next generation grow.
            </p>
            <a
              href="#"
              className="inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              Sign up as Mentor
            </a>
          </div>
          <div className="p-5 rounded-md border">
            <h2 className="text-xl font-semibold mb-2">Find a Mentor</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Get matched with experienced alumni in your field.
            </p>
            <a
              href="#"
              className="inline-block px-4 py-2 rounded-md bg-accent text-accent-foreground"
            >
              Apply as Mentee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
