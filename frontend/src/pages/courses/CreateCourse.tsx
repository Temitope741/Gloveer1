// ============================================================
// src/pages/courses/CreateCourse.tsx
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, createCourse, getUsers, type Course } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function CreateCourse() {
  const user = useAuth();
  const nav = useNavigate();
  const allUsers = getUsers();
  const learners = allUsers.filter((u) => u.role === "learner");

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";
  const basePath = user?.role === "admin" ? "/admin" : "/instructor";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development" as Course["category"],
    durationWeeks: 8,
    tag: "",
    assignedLearners: [] as string[],
  });

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
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    createCourse({
      ...form,
      instructorId: user?.id ?? "",
      instructorName: user?.name ?? "",
      tag: form.tag || `${form.durationWeeks} weeks`,
    });
    toast({ title: "Course created!", description: `"${form.title}" is ready.` });
    nav(`${basePath}/courses`);
  }

  return (
    <AppShell variant={variant}>
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">New Course</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Create a Course</h1>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold">Course Details</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Web Development Bootcamp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <textarea
              id="desc"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What will learners achieve in this course?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Course["category"] })}
              >
                <option>Web Development</option>
                <option>Cybersecurity</option>
                <option>Data Analytics</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeks">Duration (weeks)</Label>
              <Input id="weeks" type="number" min={1} max={52} value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Assign learners */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold">Assign Learners</h2>
          <p className="text-sm text-muted-foreground">Select which learners should have access to this course.</p>
          {learners.length === 0 ? (
            <p className="text-sm text-muted-foreground">No learners registered yet.</p>
          ) : (
            <div className="space-y-2">
              {learners.map((l) => (
                <label key={l.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-3 transition-colors hover:bg-secondary/50">
                  <input
                    type="checkbox"
                    checked={form.assignedLearners.includes(l.id)}
                    onChange={() => toggleLearner(l.id)}
                    className="h-4 w-4 rounded accent-primary"
                  />
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
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">Create Course</Button>
          <Button type="button" variant="outline" onClick={() => nav(-1)}>Cancel</Button>
        </div>
      </form>
    </AppShell>
  );
}