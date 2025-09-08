import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const Logo = () => (
  <div className="flex items-center gap-3">
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="48" height="48" rx="10" fill="white" />
      <path d="M8 34L24 10L40 34H8Z" fill="hsl(var(--primary))" />
      <circle cx="24" cy="24" r="4" fill="hsl(var(--accent))" />
    </svg>
    <div>
      <div className="text-xl font-semibold leading-none">AlumniHub</div>
      <div className="text-xs text-muted-foreground">
        Institute of Excellence
      </div>
    </div>
  </div>
);

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="#about"
            className="text-sm text-foreground hover:text-primary-foreground"
          >
            About
          </Link>
          <Link
            to="#events"
            className="text-sm text-foreground hover:text-primary-foreground"
          >
            Events
          </Link>
          <Link
            to="#benefits"
            className="text-sm text-foreground hover:text-primary-foreground"
          >
            Benefits
          </Link>
          <Link
            to="#contact"
            className="text-sm text-foreground hover:text-primary-foreground"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/student-login"
                className="hidden sm:inline-block px-4 py-2 rounded-md text-sm font-medium bg-white border border-transparent hover:bg-slate-50"
              >
                Student Portal
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block px-4 py-2 rounded-md text-sm font-medium bg-white border border-transparent hover:bg-slate-50"
              >
                Register
              </Link>
              <Link
                to="/alumni-login"
                className="hidden sm:inline-block px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-95"
              >
                Alumni Login
              </Link>
              <Link
                to="/admin-login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-95"
              >
                Admin Login
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.role.toUpperCase()}
                </div>
              </div>

              <Link
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "student"
                      ? "/dashboard/student"
                      : "/dashboard/alumni"
                }
                className="px-3 py-2 rounded-md text-sm bg-white border"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm bg-destructive text-destructive-foreground"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
