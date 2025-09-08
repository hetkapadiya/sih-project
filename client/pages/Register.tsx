import { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole =
    (searchParams.get("role") as "alumni" | "student" | null) || "alumni";

  const { register, getUsers } = useAuth();

  const [role, setRole] = useState<"alumni" | "student" | "admin">(defaultRole as any);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Register — AlumniHub";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If registering admin, require an existing admin access key (password of an existing admin)
    try {
      if (role === "admin") {
        const users = getUsers();
        const valid = users.find((u) => u.role === "admin" && u.password === adminKey);
        if (!valid) {
          setError("Invalid admin access key. Contact site administrator.");
          setLoading(false);
          return;
        }
      }

      await register({ name, email, password, role, batch });
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Create a new account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Register as a student or an alumnus to join the community.
        </p>

        <div className="mb-6">
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="role"
              value="alumni"
              checked={role === "alumni"}
              onChange={() => setRole("alumni")}
              className="mr-2"
            />
            Alumni
          </label>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
              className="mr-2"
            />
            Student
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
              className="mr-2"
            />
            Admin
          </label>
        </div>

        {error && <div className="text-sm text-destructive mb-3">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-sm text-muted-foreground">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
                placeholder="Your full name"
              />
            </label>
          </div>

          <div>
            <label className="block">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
                placeholder="you@domain.edu"
              />
            </label>
          </div>

          <div>
            <label className="block">
              <span className="text-sm text-muted-foreground">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
                placeholder="Choose a strong password"
              />
            </label>
          </div>

          <div>
            <label className="block">
              <span className="text-sm text-muted-foreground">
                Batch / Grad Year
              </span>
              <input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground"
                placeholder="e.g. 2015"
              />
            </label>
          </div>

          {role === "admin" && (
            <div>
              <label className="block">
                <span className="text-sm text-muted-foreground">Admin access key</span>
                <input value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-foreground" placeholder="Enter admin access key" />
              </label>
            </div>
          )}

          <div className="md:col-span-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              By registering you agree to our terms and privacy policy.
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium"
            >
              {loading
                ? "Registering..."
                : `Register as ${role === "alumni" ? "Alumni" : role === "student" ? "Student" : "Admin"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
