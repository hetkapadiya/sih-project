import * as React from "react";
import { Suspense } from "react";
import AdminPanel from "./admin/AdminPanel";

export default function DashboardAdmin() {
  return (
    <Suspense fallback={<div className="p-4">Loading admin...</div>}>
      <div className="min-h-[70vh]"><AdminPanel /></div>
    </Suspense>
  );
}
