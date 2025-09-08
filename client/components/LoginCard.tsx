import React, { useState } from "react";

interface Props {
  role: "alumni" | "student";
}

export default function LoginCard({ role }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const title = role === "alumni" ? "Alumni Sign In" : "Student Portal";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`${title} — Logged in as ${email}`);
  };

  return (
    <div className="max-w-md w-full bg-card rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">Use your {role === "alumni" ? "alumni" : "student"} credentials to access the portal.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-muted-foreground">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
            placeholder="you@domain.edu"
          />
        </label>

        <label className="block">
          <span className="text-sm text-muted-foreground">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
            placeholder="••••••••"
          />
        </label>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-sm text-primary-foreground">Forgot?</a>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-95"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
