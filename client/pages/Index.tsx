import { useEffect } from "react";
import NewsTicker from "@/components/NewsTicker";
import QuickLinks from "@/components/QuickLinks";

export default function Index() {
  useEffect(() => {
    document.title = "AlumniHub — Institute Alumni";
  }, []);

  const news = [
    "Alumni Reunion 2025 registration open.",
    "New mentorship program launched.",
    "Donate to the scholarship fund.",
  ];

  return (
    <div>
      <NewsTicker items={news} />

      <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.02))] py-12">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">AlumniHub</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Connecting generations — events, mentorship, careers, and opportunities for alumni and students of the Institute.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/alumni-login" className="px-5 py-3 rounded-md bg-accent text-accent-foreground font-semibold">Alumni Login</a>
              <a href="/student-login" className="px-5 py-3 rounded-md bg-secondary text-secondary-foreground border">Student Portal</a>
              <a href="/register" className="px-5 py-3 rounded-md bg-card text-card-foreground border">Register</a>
            </div>

            <div className="mt-8">
              <QuickLinks />
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold">News & Events</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Alumni Reunion — 25th July · Main Auditorium</li>
                <li>Industry Talk Series — 10th Aug · Online</li>
                <li>Career Fair — 15th Sep · Career Center</li>
              </ul>

              <div className="mt-4">
                <a href="#events" className="text-sm text-primary hover:underline">View all events</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-3">About AlumniHub</h2>
            <p className="text-muted-foreground">AlumniHub brings together former and current students through curated events, mentorship programs, career resources and a network that lasts a lifetime. Our mission is to foster meaningful engagement between generations.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-card rounded-md shadow-sm">
                <h5 className="font-semibold">Career Services</h5>
                <p className="text-sm text-muted-foreground">Job listings, industry talks, and resume help.</p>
              </div>
              <div className="p-6 bg-card rounded-md shadow-sm">
                <h5 className="font-semibold">Chapters</h5>
                <p className="text-sm text-muted-foreground">Regional chapters and student clubs coordination.</p>
              </div>
            </div>
          </div>

          <aside>
            <div className="p-6 bg-card rounded-md shadow-sm">
              <h4 className="font-semibold">Stay in touch</h4>
              <p className="text-sm text-muted-foreground">Subscribe for event alerts and newsletters.</p>
              <div className="mt-3">
                <input className="w-full rounded-md px-3 py-2 border" placeholder="you@example.com" />
                <button className="mt-3 w-full rounded-md bg-accent text-accent-foreground px-3 py-2">Subscribe</button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="events" className="bg-white py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-4">Upcoming Events</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-md shadow-sm">
              <h4 className="font-semibold">Alumni Reunion</h4>
              <p className="text-sm text-muted-foreground">25th July · Main Auditorium</p>
            </div>
            <div className="p-6 bg-card rounded-md shadow-sm">
              <h4 className="font-semibold">Career Fair</h4>
              <p className="text-sm text-muted-foreground">10th Aug · Career Center</p>
            </div>
            <div className="p-6 bg-card rounded-md shadow-sm">
              <h4 className="font-semibold">Webinar: Industry Trends</h4>
              <p className="text-sm text-muted-foreground">15th Sep · Online</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
