import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const id = setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1200);
    return () => clearTimeout(id);
  }, [navigate]);
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="text-2xl font-semibold mb-2">Signing you in…</div>
        <div className="text-sm text-muted-foreground">Redirecting to Admin Dashboard</div>
      </div>
    </div>
  );
}
