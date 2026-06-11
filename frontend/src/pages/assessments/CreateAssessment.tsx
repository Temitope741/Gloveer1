// ============================================================
// src/pages/assessments/CreateAssessment.tsx
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, createAssessment, getCourses, getUsers, type AssessmentQuestion } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function CreateAssessment() {
  const user = useAuth();
  const nav = useNavigate();
  const allCourses = getCourses();
  const allUsers = getUsers();

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";
  const basePath = user?.role === "admin" ? "/admin" : "/instructor";

  const myCourses = user?.role === "admin" ? allCourses : allCourses.filter((c) => c.instructorId === user?.id);
  const learners = allUsers.filter((u) => u.role === "learner");

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: myCourses[0]?.id ?? "",
    deadline: "",
    assignedLearners: [] as string[],
    questions: [{ id: crypto.randomUUID(), question: "", type: "text" as AssessmentQuestion["type"] }],
  });

  function addQuestion() {
    setForm((f) => ({ ...f, questions: [...f.questions, { id: crypto.randomUUID(), question: "", type: "text" }] }));
  }

  function removeQuestion(id: string) {
    setForm((f) => ({ ...f, questions: f.questions.filter((q) => q.id !== id) }));
  }

  function updateQuestion(id: string, field: keyof AssessmentQuestion, value: string) {
    setForm((f) => ({ ...f, questions: f.questions.map((q) => q.id === id ? { ...q, [field]: value } : q) }));
  }

  function toggleLearner(id: string) {
    setForm((f) => ({
      ...f,
      assignedLearners: f.assignedLearners.includes(id)
        ? f.assignedLearners.filter((l) => l !== id)
        : [...f.assignedLearners, id],
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.deadline) {
      toast({ title: "Title and deadline are required", variant: "destructive" });
      return;
    }
    if (form.questions.some((q) => !q.question.trim())) {
      toast({ title: "All questions must have text", variant: "destructive" });
      return;
    }
    createAssessment({
      title: form.title,
      description: form.description,
      courseId: form.courseId,
      createdBy: user?.id ?? "",
      assignedLearners: form.assignedLearners,
      deadline: new Date(form.deadline).toISOString(),
      questions: form.questions,
    });
    toast({ title: "Assessment created!" });
    nav(`${basePath}/assessments`);
  }

  return (
    <AppShell variant={variant}>
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">New Assessment</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Create Assessment</h1>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
        {/* Details */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold">Details</h2>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Week 1 Quiz" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Instructions for learners…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Course</Label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Questions</h2>
            <Button type="button" size="sm" variant="outline" onClick={addQuestion}><Plus className="h-4 w-4" /> Add</Button>
          </div>
          {form.questions.map((q, i) => (
            <div key={q.id} className="flex gap-3 items-start rounded-xl border border-border/60 p-3">
              <span className="mt-2.5 text-xs font-mono text-muted-foreground shrink-0">Q{i + 1}</span>
              <div className="flex-1 space-y-2">
                <Input value={q.question} onChange={(e) => updateQuestion(q.id, "question", e.target.value)} placeholder="Enter question…" />
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={q.type} onChange={(e) => updateQuestion(q.id, "type", e.target.value)}>
                  <option value="text">Text answer</option>
                  <option value="file">File upload</option>
                </select>
              </div>
              {form.questions.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-1" onClick={() => removeQuestion(q.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Assign learners */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold">Assign Learners</h2>
          {learners.length === 0 ? (
            <p className="text-sm text-muted-foreground">No learners registered yet.</p>
          ) : (
            <div className="space-y-2">
              {learners.map((l) => (
                <label key={l.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-3 hover:bg-secondary/50">
                  <input type="checkbox" checked={form.assignedLearners.includes(l.id)}
                    onChange={() => toggleLearner(l.id)} className="h-4 w-4 accent-primary" />
                  <div>
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">Create Assessment</Button>
          <Button type="button" variant="outline" onClick={() => nav(-1)}>Cancel</Button>
        </div>
      </form>
    </AppShell>
  );
}