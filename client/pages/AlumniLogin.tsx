import LoginCard from "../components/LoginCard";

export default function AlumniLogin() {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Alumni Login</h1>
          <p className="text-muted-foreground mb-6">Welcome back. Access alumni benefits, events, mentoring opportunities, and update your profile.</p>

          <section className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold">Alumni Network</h3>
              <p className="text-sm text-muted-foreground">Find batches, join chapters, and connect with peers</p>
            </div>
            <div>
              <h3 className="font-semibold">Give Back</h3>
              <p className="text-sm text-muted-foreground">Support scholarships and mentoring programs</p>
            </div>
          </section>
        </div>

        <div className="flex justify-center">
          <LoginCard role="alumni" />
        </div>
      </div>
    </div>
  );
}
