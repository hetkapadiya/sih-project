import { useAuth } from "@/context/AuthProvider";

export default function DashboardStudent() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Welcome, {user?.name} (Student)</h1>
      <p className="text-muted-foreground mt-2">
        Access student services, course materials, and campus updates.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Courses</h4>
          <p className="text-sm text-muted-foreground">
            Course registrations and materials.
          </p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Library</h4>
          <p className="text-sm text-muted-foreground">
            Search the library and reserve books.
          </p>
        </div>
        <div className="p-4 bg-card rounded-md">
          <h4 className="font-semibold">Support</h4>
          <p className="text-sm text-muted-foreground">
            Contact student affairs and IT support.
          </p>
        </div>
      </div>
    </div>
  );
}
