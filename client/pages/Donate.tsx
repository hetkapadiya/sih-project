import * as React from "react";

export default function Donate() {
  React.useEffect(() => { document.title = "Donate — AlumniHub"; }, []);
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-3xl mx-auto bg-card rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-3">Support Scholarships & Programs</h1>
        <p className="text-muted-foreground mb-6">Your contribution helps fund scholarships, research, events, and mentorship for our community.</p>

        <form className="space-y-4">
          <div>
            <label className="block">
              <span className="text-sm text-muted-foreground">Amount (USD)</span>
              <input type="number" min={1} defaultValue={50} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-muted-foreground">Full name</span>
              <input className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="Your name" />
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">Email</span>
              <input type="email" className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="you@example.com" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-muted-foreground">Card number</span>
              <input className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="4242 4242 4242 4242" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-muted-foreground">Expiry</span>
                <input className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="MM/YY" />
              </label>
              <label className="block">
                <span className="text-sm text-muted-foreground">CVC</span>
                <input className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="CVC" />
              </label>
            </div>
          </div>
          <button type="button" className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-medium">Donate now</button>
        </form>
      </div>
    </div>
  );
}
