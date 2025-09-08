import LoginCard from "../components/LoginCard";

export default function AdminLogin() {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Admin Portal</h1>
          <p className="text-muted-foreground mb-6">Administrative access to verify and manage registrations, users, and content.</p>

          <section className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold">Verification Queue</h3>
              <p className="text-sm text-muted-foreground">Approve or reject pending registrations.</p>
            </div>
            <div>
              <h3 className="font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">Promote, demote, or remove accounts.</p>
            </div>
          </section>
        </div>

        <div className="flex justify-center">
          <LoginCard role="admin" />
        </div>
      </div>
    </div>
  );
}
