import { Link } from "react-router-dom";
import { ArrowRight, Code2, Shield, BarChart3, Sparkles, Calendar, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/SiteNavbar";
import { ClassCard } from "@/components/ClassCard";
import { useClasses } from "@/lib/store";

const features = [
  { icon: Play, title: "Live Classes", desc: "Real instructors, real-time, real questions answered." },
  { icon: Users, title: "Expert Trainers", desc: "Practitioners shipping in the field — not just teachers." },
  { icon: Calendar, title: "Flexible Schedule", desc: "Evening and weekend cohorts that fit your week." },
];

const courseHighlights = [
  { icon: Code2, title: "Web Development", desc: "From first <div> to deployed full-stack apps.", tag: "12 weeks" },
  { icon: Shield, title: "Cybersecurity", desc: "Threat modeling, hardening, blue & red team basics.", tag: "10 weeks" },
  { icon: BarChart3, title: "Data Analytics", desc: "SQL, Python, dashboards and storytelling with data.", tag: "8 weeks" },
];

const Index = () => {
  const classes = useClasses().slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="container relative grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> New cohort starting soon
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Learn tech skills{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">live</span>
              <br />with expert trainers.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Join live online classes in <span className="text-foreground font-medium">Web Development</span>,{" "}
              <span className="text-foreground font-medium">Cybersecurity</span> and{" "}
              <span className="text-foreground font-medium">Data Analytics</span>. Build real projects. Ship real things.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elegant">
                <Link to="/signup">🚀 Get Started <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#courses">▶️ View Classes</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <div><span className="text-foreground font-bold">2,400+</span> students</div>
              <div><span className="text-foreground font-bold">98%</span> completion</div>
              <div><span className="text-foreground font-bold">4.9/5</span> rating</div>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl border border-border/60 bg-card p-6 shadow-elegant">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <div className="ml-auto font-mono text-[10px] text-muted-foreground">live · zoom</div>
              </div>
              <div className="mt-5 space-y-3">
                {classes.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                    <div>
                      <div className="text-sm font-semibold">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.trainer}</div>
                    </div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground">
                      {new Date(c.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-ink px-4 py-3 text-primary-foreground shadow-elegant">
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-70">Next session</div>
              <div className="font-display text-lg font-bold">Tonight · 7:00 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-20">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Why Gloveer</div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Built for people who actually want to ship.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-7 shadow-card animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="bg-secondary/40 py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Tracks</div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Pick your path.</h2>
            </div>
            <Link to="/signup" className="hidden text-sm font-medium text-primary hover:underline md:inline">All courses →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {courseHighlights.map((c) => (
              <div key={c.title} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />
                <c.icon className="h-9 w-9 text-primary" />
                <h3 className="mt-5 font-display text-2xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.tag}</span>
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/signup">Join Class <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING SAMPLE */}
      <section className="container py-20">
        <div className="mb-10">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Upcoming</div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Live this week</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {classes.map((c) => <ClassCard key={c.id} item={c} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ink p-10 text-primary-foreground md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-5xl">Your next skill is one class away.</h2>
            <p className="mt-4 text-primary-foreground/70">Create your free Gloveer Virtual Academy account and join your first live class today.</p>
            <Button asChild size="lg" className="mt-7 bg-background text-foreground hover:bg-background/90">
              <Link to="/signup">Create free account <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Gloveer Virtual Academy. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Contact</a>
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
