import { useAuth } from "@/context/AuthProvider";
import { useEffect, useMemo, useState } from "react";

export default function DashboardAdmin() {
  const { user, getUsers, getPendingUsers, verifyUser, rejectUser, deleteUser, updateUserRole } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "unverified">("pending");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(() => getUsers());

  useEffect(() => {
    // refresh list when mounted
    setUsers(getUsers());
  }, []);

  const refresh = () => setUsers(getUsers());

  const list = useMemo(() => {
    let base = getUsers();
    if (filter === "pending") base = getPendingUsers();
    if (filter === "verified") base = base.filter((u) => u.verified);
    if (filter === "unverified") base = base.filter((u) => !u.verified);
    if (query) base = base.filter((u) => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));
    return base;
  }, [filter, query]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-muted-foreground mt-2">Manage users and system settings. Verify new registrations and manage roles.</p>

      <div className="mt-6 bg-card rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">User Management</h3>
          <div className="flex items-center gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="px-3 py-2 border rounded-md" />
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2 border rounded-md">
              <option value="pending">Pending</option>
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <button onClick={refresh} className="px-3 py-2 rounded-md bg-white border">Refresh</button>
          </div>
        </div>

        <div className="grid gap-3">
          {list.length === 0 && <div className="text-sm text-muted-foreground">No users found.</div>}

          {list.map((u: any) => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div>
                <div className="font-medium">
                  {u.name} <span className="text-sm text-muted-foreground">({u.role})</span>
                  {!u.verified && <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending</span>}
                </div>
                <div className="text-sm text-muted-foreground">{u.email} · {u.batch || "—"}</div>
              </div>

              <div className="flex items-center gap-2">
                {!u.verified && (
                  <>
                    <button onClick={() => { verifyUser(u.id); refresh(); }} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Verify</button>
                    <button onClick={() => { rejectUser(u.id); refresh(); }} className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-sm">Reject</button>
                  </>
                )}

                <button onClick={() => { updateUserRole(u.id, u.role === "admin" ? "alumni" : "admin"); refresh(); }} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">{u.role === "admin" ? "Revoke Admin" : "Make Admin"}</button>
                <button onClick={() => { deleteUser(u.id); refresh(); }} className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
