import { Link } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const Logo = () => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-md flex items-center justify-center bg-primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
        <path d="M12 3L3 21H21L12 3Z" fill="currentColor" />
      </svg>
    </div>
    <div>
      <div className="text-lg font-semibold">AlumniHub</div>
      <div className="text-xs text-muted-foreground">Institute of Excellence</div>
    </div>
  </div>
);

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full shadow-sm bg-primary text-primary-foreground">
      <div className="container mx-auto py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <RouterLink to="/" className="flex items-center">
            <Logo />
          </RouterLink>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <RouterLink to="#about" className="hover:underline">About</RouterLink>
            <RouterLink to="#events" className="hover:underline">Events</RouterLink>
            <RouterLink to="#benefits" className="hover:underline">Benefits</RouterLink>
            <RouterLink to="#contact" className="hover:underline">Contact</RouterLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <input placeholder="Search" className="px-3 py-2 rounded-md border w-56 text-sm" />
          </div>

          {!user ? (
            <>
              <RouterLink to="/student-login" className="hidden sm:inline-block px-3 py-2 rounded-md text-sm bg-secondary text-secondary-foreground">Student</RouterLink>
              <RouterLink to="/alumni-login" className="hidden sm:inline-block px-3 py-2 rounded-md text-sm bg-accent text-accent-foreground">Alumni</RouterLink>
              <RouterLink to="/admin-login" className="px-3 py-2 rounded-md text-sm bg-card text-card-foreground border">Admin</RouterLink>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-sm text-card-foreground">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </div>
              <RouterLink to={user.role === "admin" ? "/admin/dashboard" : user.role === "student" ? "/dashboard/student" : "/dashboard/alumni"} className="px-3 py-2 rounded-md text-sm bg-card text-card-foreground border">Dashboard</RouterLink>
              <button onClick={logout} className="px-3 py-2 rounded-md text-sm bg-destructive text-destructive-foreground">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
