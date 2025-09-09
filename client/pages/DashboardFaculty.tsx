import * as React from "react";
import { useAuth } from "@/context/AuthProvider";

export default function DashboardFaculty() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Welcome, {user?.name} (Faculty)</h1>
      <p className="text-muted-foreground mt-2">Access faculty tools, course management, and advisement resources.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Courses</h4>
          <p className="text-sm text-muted-foreground">Manage course materials and assignments.</p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Advising</h4>
          <p className="text-sm text-muted-foreground">Track advisees and appointments.</p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Department</h4>
          <p className="text-sm text-muted-foreground">Departmental announcements and resources.</p>
        </div>
      </div>
    </div>
  );
}
