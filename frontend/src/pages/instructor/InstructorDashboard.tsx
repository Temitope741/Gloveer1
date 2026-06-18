import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useCourses, useAssessments, useSubmissions } from "@/lib/store";
import { BookOpen, ClipboardList, FileText, Users, Plus, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstructorDashboard() {
  const user = useAuth();
  const allCourses = useCourses() || [];
  const allAssessments = useAssessments() || [];
  const allSubmissions = useSubmissions() || [];

  const myCourses = allCourses.filter((c) => c.instructorId === user?.id);
  const myAssessments = allAssessments.filter((a) => a.createdBy === user?.id);
  const mySubmissions = allSubmissions.filter((s) =>
    myAssessments.some((a) => a.id === s.assessmentId)
  );
  const pendingGrades = mySubmissions.filter((s) => s.status === "submitted").length;

  const totalLearners = new Set(myCourses.flatMap((c) => c.assignedLearners)).size;

  const stats = [
    { label: "My Courses", value: myCourses.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Assessments", value: myAssessments.length, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "My Learners", value: totalLearners, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "To Grade", value: pendingGrades, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <AppShell variant="instructor">
      {/* Welcome */}
      <div className="mb-8 rounded-3xl border border-border/60 bg-gradient-hero p-8">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Instructor Portal</div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 max-w-lg text-muted-foreground text-sm">Manage your courses, upload materials, and track your learners' progress.</p>
        {pendingGrades > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            You have <strong>{pendingGrades}</strong> submission{pendingGrades > 1 ? "s" : ""} waiting to be graded
          </div>
        )}
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

      {/* Quick actions + recent courses */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Quick Actions</div>
          <h2 className="mt-2 font-display text-xl font-bold">Get Things Done</h2>
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/instructor/courses/new"><Plus className="h-4 w-4" /> Create New Course</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/instructor/courses/upload"><Plus className="h-4 w-4" /> Upload Material</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/instructor/assessments/new"><Plus className="h-4 w-4" /> Create Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/instructor/submissions"><FileText className="h-4 w-4" /> Review Submissions</Link>
            </Button>
          </div>
        </div>

        {/* My courses */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Courses</div>
              <h2 className="mt-1 font-display text-xl font-bold">My Courses</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/instructor/courses">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {myCourses.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No courses yet. <Link to="/instructor/courses/new" className="text-primary hover:underline">Create your first</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myCourses.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.assignedLearners.length} learner{c.assignedLearners.length !== 1 ? "s" : ""} · {c.tag}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider rounded-full bg-primary/10 px-2 py-0.5 text-primary">{c.materials.length} files</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent submissions */}
      {mySubmissions.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent Submissions</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/instructor/submissions">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Assessment</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mySubmissions.slice(0, 5).map((s) => {
                  const assessment = myAssessments.find((a) => a.id === s.assessmentId);
                  return (
                    <tr key={s.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{assessment?.title ?? "Unknown"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(s.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${s.status === "graded" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}