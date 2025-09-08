import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

interface Props {
  role: "alumni" | "student" | "admin";
}

export default function LoginCard({ role }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const title = role === "alumni" ? "Alumni Sign In" : role === "student" ? "Student Sign In" : "Admin Sign In";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-card rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Use your {role === "alumni" ? "alumni" : role === "student" ? "student" : "admin"} credentials to access the portal.
      </p>

      {error && <div className="text-sm text-destructive mb-3">{error}</div>}

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
          <div className="flex items-center gap-3">
            <a href="#" className="text-sm text-primary-foreground">Forgot?</a>
            {role !== "admin" ? (
              <a href={`/register?role=${role}`} className="text-sm text-muted-foreground hover:text-primary-foreground">New? Register</a>
            ) : (
              <a href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary-foreground">Admin Dashboard</a>
            )}
          </div>
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
