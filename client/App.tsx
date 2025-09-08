import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/StudentLogin";
import AlumniLogin from "./pages/AlumniLogin";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import DashboardAlumni from "./pages/DashboardAlumni";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardAdmin from "./pages/DashboardAdmin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <main className="min-h-[70vh]">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/alumni-login" element={<AlumniLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />

              {/* Protected dashboards */}
              <Route
                path="/dashboard/alumni"
                element={
                  <PrivateRoute role="alumni">
                    <React.Suspense fallback={<div />}>
                      <DashboardAlumni />
                    </React.Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/student"
                element={
                  <PrivateRoute role="student">
                    <React.Suspense fallback={<div />}>
                      <DashboardStudent />
                    </React.Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute role="admin">
                    <React.Suspense fallback={<div />}>
                      <DashboardAdmin />
                    </React.Suspense>
                  </PrivateRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
