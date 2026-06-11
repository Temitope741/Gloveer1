import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useCourses, useAssessments, useSubmissions, useClasses } from "@/lib/store";
import { BookOpen, ClipboardList, CheckCircle2, Clock, Sparkles, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassCard } from "@/components/ClassCard";

export default function LearnerDashboard() {
  const user = useAuth();
  const allCourses = useCourses();
  const allAssessments = useAssessments();
  const allSubmissions = useSubmissions();
  const classes = useClasses();

  const myCourses = allCourses.filter((c) => user && c.assignedLearners.includes(user.id));
  const myAssessments = allAssessments.filter((a) => user && a.assignedLearners.includes(user.id));
  const mySubmissions = allSubmissions.filter((s) => s.learnerId === user?.id);
  const completedAssessments = mySubmissions.filter((s) => s.status === "graded").length;
  const pendingAssessments = myAssessments.filter(
    (a) => !mySubmissions.some((s) => s.assessmentId === a.id)
  );
  const upcomingClasses = [...classes]
    .filter((c) => +new Date(c.date) > Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const nextClass = upcomingClasses[0];

  const stats = [
    { label: "My Courses", value: myCourses.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Assessments", value: myAssessments.length, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Completed", value: completedAssessments, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending", value: pendingAssessments.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <AppShell variant="user">
      {/* Welcome */}
      <section className="mb-8 rounded-3xl border border-border/60 bg-gradient-hero p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Welcome back</div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Hello, {user?.name?.split(" ")[0] ?? "Student"} 👋
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground text-sm">Pick a class below and join live with one click.</p>
        {nextClass && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm shadow-card">
            <Sparkles className="h-4 w-4 text-accent" />
            Next up: <span className="font-semibold">{nextClass.title}</span>
            <span className="font-mono text-xs text-muted-foreground">
              · {new Date(nextClass.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        )}
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className={`rounded-lg p-2 ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </div>
            <div className="mt-3 font-display text-4xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Learning</div>
            <h2 className="mt-1 font-display text-2xl font-bold">My Courses</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/dashboard/courses">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        {myCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-muted-foreground text-sm">
            No courses assigned yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myCourses.slice(0, 3).map((c) => (
              <Link key={c.id} to={`/dashboard/courses/${c.id}`} className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-primary">{c.category}</div>
                <h3 className="font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.instructorName}</span>
                  <span className="font-mono">{c.materials.length} materials</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-3 w-3" /> Open course
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending Assessments */}
      {pendingAssessments.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Due Soon</div>
              <h2 className="mt-1 font-display text-2xl font-bold">Pending Assessments</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/dashboard/assessments">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingAssessments.slice(0, 4).map((a) => {
              const overdue = new Date(a.deadline) < new Date();
              return (
                <Link key={a.id} to={`/dashboard/assessments/${a.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{a.questions.length} question{a.questions.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-mono ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                      {overdue ? "Overdue" : "Due"} {new Date(a.deadline).toLocaleDateString()}
                    </div>
                    <span className="mt-1 inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-amber-600">pending</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming live classes */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Upcoming</div>
            <h2 className="mt-1 font-display text-2xl font-bold">Live This Week</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/dashboard/classes">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {upcomingClasses.slice(0, 3).map((c) => <ClassCard key={c.id} item={c} />)}
        </div>
      </div>
    </AppShell>
  );
}