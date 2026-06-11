// ============================================================
// src/pages/assessments/AssessmentList.tsx
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, useAssessments, deleteAssessment } from "@/lib/store";
import { Plus, Trash2, Pencil, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function AssessmentList() {
  const user = useAuth();
  const allAssessments = useAssessments();
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";
  const basePath = user?.role === "admin" ? "/admin" : "/instructor";

  const assessments = user?.role === "admin"
    ? allAssessments
    : allAssessments.filter((a) => a.createdBy === user?.id);

  const filtered = assessments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    if (!confirm("Delete this assessment?")) return;
    deleteAssessment(id);
    toast({ title: "Assessment deleted" });
  }

  return (
    <AppShell variant={variant}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Assessments</div>
          <h1 className="mt-1 font-display text-3xl font-bold">
            {user?.role === "admin" ? "All Assessments" : "My Assessments"}
          </h1>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90">
          <Link to={`${basePath}/assessments/new`}><Plus className="h-4 w-4" /> Create Assessment</Link>
        </Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search assessments..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No assessments found.</p>
          <Button asChild className="mt-4 bg-gradient-primary hover:opacity-90">
            <Link to={`${basePath}/assessments/new`}><Plus className="h-4 w-4" /> Create your first assessment</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-secondary/40">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Assessment</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Questions</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Deadline</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Learners</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((a) => {
                const overdue = new Date(a.deadline) < new Date();
                return (
                  <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{a.questions.length}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-mono ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                        {new Date(a.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.assignedLearners.length}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => nav(`${basePath}/assessments/${a.id}`)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}