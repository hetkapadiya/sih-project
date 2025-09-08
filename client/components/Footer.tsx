export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground mt-12">
      <div className="container mx-auto py-12 grid md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-semibold">AlumniHub</h3>
          <p className="text-sm text-primary-foreground/90 mt-3">Institute of Excellence — Connecting alumni and students through events, mentorship and support.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/">Home</a></li>
            <li><a href="/alumni-login">Alumni Login</a></li>
            <li><a href="/student-login">Student Portal</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">alumni@institute.edu</p>
          <p className="text-sm">+1 (555) 555-0123</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Address</h4>
          <p className="text-sm">123 Institute Road<br/>City, State ZIP</p>
        </div>
      </div>

      <div className="border-t border-primary/20 py-4 text-center text-sm text-primary-foreground/80">© {new Date().getFullYear()} AlumniHub — All rights reserved</div>
    </footer>
  );
}
