import * as React from "react";
import { useAuth } from "@/context/AuthProvider";

export default function DashboardAlumni() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Welcome, {user?.name} (Alumnus)</h1>
      <p className="text-muted-foreground mt-2">Access alumni resources, events, and mentorship tools.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Profile</h4>
          <p className="text-sm text-muted-foreground">Update your contact information and bio.</p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Mentorship</h4>
          <p className="text-sm text-muted-foreground">Manage mentees and offers.</p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Events</h4>
          <p className="text-sm text-muted-foreground">View upcoming events and RSVP.</p>
        </div>
      </div>
    </div>
  );
}
