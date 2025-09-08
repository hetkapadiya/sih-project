import React from "react";
import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import type { Role } from "@/context/AuthProvider";

export default function PrivateRoute({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: Role | Role[];
}) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children;
}
