import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    document.title = "AlumniHub — Connecting Generations";
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white">
      <section className="hero-gradient text-foreground py-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-7/12">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow">
              AlumniHub — Where alumni and students connect
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Join a thriving community of graduates and current students.
              Discover events, mentoring, career services, and ways to give back
              to your institute.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="/alumni-login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold shadow-lg"
              >
                Alumni Login
              </a>
              <a
                href="/student-login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-foreground font-medium border"
              >
                Student Portal
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="font-semibold">Events</h4>
                <p className="text-sm text-foreground mt-1">Reunions, webinars, and local chapter meetups.</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="font-semibold">Mentorship</h4>
                <p className="text-sm text-foreground mt-1">Connect with alumni mentors across industries.</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="font-semibold">Giving</h4>
                <p className="text-sm text-foreground mt-1">Support scholarships and campus projects.</p>
              </div>
            </div>
          </div>

          <div className="md:w-5/12">
            <div className="bg-card p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Quick Access
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in quickly to access personalized content.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <a
                  href="/alumni-login"
                  className="w-full text-center px-4 py-3 rounded-md bg-primary text-primary-foreground"
                >
                  Alumni Login
                </a>
                <a
                  href="/student-login"
                  className="w-full text-center px-4 py-3 rounded-md bg-white text-foreground border"
                >
                  Student Portal
                </a>
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Upcoming Event</h4>
                <p className="text-sm text-muted-foreground">
                  Alumni Reunion — 25th July · Main Auditorium
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container mx-auto py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-3">About AlumniHub</h2>
            <p className="text-muted-foreground">
              AlumniHub brings together former and current students through
              curated events, mentorship programs, career resources and a
              network that lasts a lifetime. Our mission is to foster meaningful
              engagement between generations.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-md">
                <h5 className="font-semibold">Career Services</h5>
                <p className="text-sm text-muted-foreground">
                  Job listings, industry talks, and resume help.
                </p>
              </div>
              <div className="p-4 bg-card rounded-md">
                <h5 className="font-semibold">Chapters</h5>
                <p className="text-sm text-muted-foreground">
                  Regional chapters and student clubs coordination.
                </p>
              </div>
            </div>
          </div>

          <aside>
            <div className="p-4 bg-card rounded-md">
              <h4 className="font-semibold">Stay in touch</h4>
              <p className="text-sm text-muted-foreground">
                Subscribe for event alerts and newsletters.
              </p>
              <div className="mt-3">
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  placeholder="you@example.com"
                />
                <button className="mt-3 w-full rounded-md bg-primary text-primary-foreground px-3 py-2">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="events" className="bg-gray-50 py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-4">Upcoming Events</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-md shadow-sm">
              <h4 className="font-semibold">Alumni Reunion</h4>
              <p className="text-sm text-muted-foreground">
                25th July · Main Auditorium
              </p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-sm">
              <h4 className="font-semibold">Career Fair</h4>
              <p className="text-sm text-muted-foreground">
                10th Aug · Career Center
              </p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-sm">
              <h4 className="font-semibold">Webinar: Industry Trends</h4>
              <p className="text-sm text-muted-foreground">15th Sep · Online</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
