import { AppShell } from "@/components/AppShell";
import { ClassCard } from "@/components/ClassCard";
import { useAuth, useClasses } from "@/lib/store";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const user = useAuth();
  const classes = useClasses();
  const next = [...classes].sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  return (
    <AppShell variant="user">
      <section className="mb-10 rounded-3xl border border-border/60 bg-gradient-hero p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Welcome back</div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Hello, {user?.name?.split(" ")[0] ?? "Student"} 👋
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Pick a class below and join live with one click.</p>
        {next && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm shadow-card">
            <Sparkles className="h-4 w-4 text-accent" />
            Next up: <span className="font-semibold">{next.title}</span>
            <span className="font-mono text-xs text-muted-foreground">
              · {new Date(next.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        )}
      </section>

      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Available now</div>
          <h2 className="mt-1 font-display text-2xl font-bold">Available Classes</h2>
        </div>
        <div className="font-mono text-xs text-muted-foreground">{classes.length} classes</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => <ClassCard key={c.id} item={c} />)}
      </div>
    </AppShell>
  );
}