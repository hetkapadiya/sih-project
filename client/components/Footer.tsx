export default function Footer() {
  return (
    <footer className="w-full bg-card border-t mt-16">
      <div className="container mx-auto py-8 flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">AlumniHub</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">Connecting generations. Events, mentorships, and lifelong learning for our alumni community.</p>
        </div>

        <div className="flex gap-12">
          <div>
            <h4 className="font-medium mb-2">Pages</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><a href="/">Home</a></li>
              <li><a href="/alumni-login">Alumni Login</a></li>
              <li><a href="/student-login">Student Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Contact</h4>
            <p className="text-sm text-muted-foreground">alumni@institute.edu</p>
            <p className="text-sm text-muted-foreground">+1 (555) 555-0123</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
