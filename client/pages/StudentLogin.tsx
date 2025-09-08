import LoginCard from "../components/LoginCard";

export default function StudentLogin() {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Student Portal</h1>
          <p className="text-muted-foreground mb-6">Access your student dashboard, resources, and campus services. If you're a current student, use your institute credentials to sign in.</p>

          <section className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold">Campus Services</h3>
              <p className="text-sm text-muted-foreground">Library, course registration, campus alerts</p>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-sm text-muted-foreground">Contact student affairs for access issues</p>
            </div>
          </section>
        </div>

        <div className="flex justify-center">
          <LoginCard role="student" />
        </div>
      </div>
    </div>
  );
}
