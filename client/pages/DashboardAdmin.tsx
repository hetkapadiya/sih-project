import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

export default function DashboardAdmin() {
  const { user, getUsers } = useAuth();
  const [users, setUsers] = useState(() => getUsers());

  const deleteUser = (id: string) => {
    const raw = localStorage.getItem("alumnihub_users") || "[]";
    const list = JSON.parse(raw) as any[];
    const filtered = list.filter((u) => u.id !== id);
    localStorage.setItem("alumnihub_users", JSON.stringify(filtered));
    setUsers(filtered);
  };

  const toggleAdmin = (id: string) => {
    const raw = localStorage.getItem("alumnihub_users") || "[]";
    const list = JSON.parse(raw) as any[];
    const updated = list.map((u) =>
      u.id === id ? { ...u, role: u.role === "admin" ? "alumni" : "admin" } : u,
    );
    localStorage.setItem("alumnihub_users", JSON.stringify(updated));
    setUsers(updated);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-muted-foreground mt-2">
        Manage users and system settings.
      </p>

      <div className="mt-6 bg-card rounded-md p-4">
        <h3 className="font-semibold mb-3">Registered Users</h3>
        <div className="grid gap-3">
          {users.length === 0 && (
            <div className="text-sm text-muted-foreground">No users found.</div>
          )}
          {users.map((u: any) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 bg-white rounded-md border"
            >
              <div>
                <div className="font-medium">
                  {u.name}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({u.role})
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {u.email} · {u.batch || "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAdmin(u.id)}
                  className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                >
                  {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
