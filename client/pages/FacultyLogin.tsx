import LoginCard from "../components/LoginCard";

export default function FacultyLogin() {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Faculty Portal</h1>
          <p className="text-muted-foreground mb-6">
            Access faculty dashboard, courses, and departmental resources.
          </p>

          <section className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold">Teaching</h3>
              <p className="text-sm text-muted-foreground">Manage classes, materials, and assessments.</p>
            </div>
            <div>
              <h3 className="font-semibold">Advising</h3>
              <p className="text-sm text-muted-foreground">Support students and coordinate schedules.</p>
            </div>
          </section>
        </div>

        <div className="flex justify-center">
          <LoginCard role="faculty" />
        </div>
      </div>
    </div>
  );
}
