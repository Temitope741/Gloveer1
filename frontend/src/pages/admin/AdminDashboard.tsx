import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useCourses, useAssessments, useSubmissions, getUsers } from "@/lib/store";
import { BookOpen, Users, ClipboardList, FileText, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const user = useAuth();
  const courses = useCourses();
  const assessments = useAssessments();
  const submissions = useSubmissions();
  const users = getUsers();

  const learners = users.filter((u) => u.role === "learner");
  const instructors = users.filter((u) => u.role === "instructor");
  const pendingGrades = submissions.filter((s) => s.status === "submitted").length;

  const stats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Assessments", value: assessments.length, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Learners", value: learners.length, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Grades", value: pendingGrades, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <AppShell variant="admin">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening at Gloveer Virtual Academy.</p>
      </div>

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

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Quick Actions</div>
          <h2 className="mt-2 font-display text-xl font-bold">Manage Academy</h2>
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/courses/new"><Plus className="h-4 w-4" /> Create New Course</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/assessments/new"><Plus className="h-4 w-4" /> Create Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/users"><Users className="h-4 w-4" /> Manage Users</Link>
            </Button>
          </div>
        </div>

        {/* Team overview */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Team Overview</div>
          <h2 className="mt-2 font-display text-xl font-bold">People</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
              <span className="text-sm font-medium">Instructors</span>
              <span className="font-display text-2xl font-bold">{instructors.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
              <span className="text-sm font-medium">Learners</span>
              <span className="font-display text-2xl font-bold">{learners.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent courses */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent Courses</h2>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/admin/courses">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
          {courses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No courses yet. <Link to="/admin/courses/new" className="text-primary hover:underline">Create one</Link></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Course</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Instructor</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Learners</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {courses.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.instructorName}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.assignedLearners.length}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">{c.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-3xl bg-gradient-ink p-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 opacity-70" />
          <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Tip</div>
        </div>
        <p className="mt-2 text-primary-foreground/80 text-sm">Connect your MongoDB database to enable persistent storage, file uploads, and real-time updates across all users.</p>
      </div>
    </AppShell>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}