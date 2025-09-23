import * as React from "react";
import React from "react";
import AdminPanel from "./admin/AdminPanel";

export default function DashboardAdmin() {
  return (
    <React.Suspense fallback={<div className="p-4">Loading admin...</div>}>
      {/* New full-featured Admin Panel */}
      <div className="min-h-[70vh]"><AdminPanel /></div>
    </React.Suspense>
  );
}
