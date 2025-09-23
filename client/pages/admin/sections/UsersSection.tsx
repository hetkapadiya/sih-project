import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth, User } from "@/context/AuthProvider";
import { exportCSV, exportPDF } from "../store";

function csvRow(u: User): (string | number | boolean | null | undefined)[] {
  return [u.name, u.email, u.role, u.batch || "", u.department || "", (u.skills || []).join(";"), u.verified ? "Yes" : "No", u.disabled ? "Yes" : "No", u.location?.country || "", u.location?.city || ""];
}

export default function UsersSection() {
  const { getUsers, verifyUser, rejectUser, deleteUser, updateUserRole, createUser, updateUser, setUserDisabled, resetPassword } = useAuth();
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<string>("all");
  const [verify, setVerify] = React.useState<string>("all");
  const [users, setUsers] = React.useState<User[]>(getUsers());

  const refresh = () => setUsers(getUsers());

  const filtered = users.filter((u) => {
    if (q && !(u.name + u.email + (u.department || "") + (u.skills || []).join(",") + (u.location?.country || "") + (u.location?.city || "")).toLowerCase().includes(q.toLowerCase())) return false;
    if (role !== "all" && u.role !== role) return false;
    if (verify !== "all" && (verify === "verified" ? !u.verified : u.verified)) return false;
    return true;
  });

  const [form, setForm] = React.useState<Omit<User, "id">>({ name: "", email: "", password: "temp123", role: "alumni", batch: "", department: "", skills: [], verified: true });

  function onCreate() {
    createUser(form);
    refresh();
    setForm({ name: "", email: "", password: "temp123", role: "alumni", batch: "", department: "", skills: [], verified: true });
  }

  function onExportCSV() {
    exportCSV("users", ["Name", "Email", "Role", "Batch", "Department", "Skills", "Verified", "Disabled", "Country", "City"], filtered.map(csvRow));
  }

  function onExportPDF() {
    exportPDF("Users", ["Name", "Email", "Role", "Batch", "Department", "Skills", "Verified", "Disabled", "Country", "City"], filtered.map(csvRow));
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Search & Export</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <Input placeholder="Search by name, email, department, skills, location" value={q} onChange={(e) => setQ(e.target.value)} className="md:col-span-2" />
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Verification</Label>
            <Select value={verify} onValueChange={setVerify}>
              <SelectTrigger><SelectValue placeholder="Verification" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={onExportCSV} variant="secondary">Export CSV</Button>
            <Button onClick={onExportPDF}>Export PDF</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input placeholder="Batch" value={form.batch || ""} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
          <Input placeholder="Department" value={form.department || ""} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={onCreate}>Add</Button>
            <Button variant="secondary" onClick={() => setForm({ name: "", email: "", password: "temp123", role: "alumni", batch: "", department: "", skills: [], verified: true })}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select defaultValue={u.role} onValueChange={(v) => { updateUserRole(u.id, v as any); refresh(); }}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {u.disabled ? "Disabled" : u.verified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {!u.verified && (
                      <>
                        <Button size="sm" onClick={() => { verifyUser(u.id); refresh(); }}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => { rejectUser(u.id); refresh(); }}>Reject</Button>
                      </>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => { const r = resetPassword(u.id); alert(`Reset link: ${r.link}`); }}>Reset Password</Button>
                    <Button size="sm" variant={u.disabled ? "secondary" : "destructive"} onClick={() => { setUserDisabled(u.id, !u.disabled); refresh(); }}>{u.disabled ? "Enable" : "Disable"}</Button>
                    <Button size="sm" variant="outline" onClick={() => { deleteUser(u.id); refresh(); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">No matching users.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
