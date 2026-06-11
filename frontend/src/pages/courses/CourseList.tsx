// ============================================================
// src/pages/courses/CourseList.tsx
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, useCourses, deleteCourse, getUsers } from "@/lib/store";
import { Plus, Trash2, Pencil, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function CourseList() {
  const user = useAuth();
  const allCourses = useCourses();
  const [search, setSearch] = useState("");

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";
  const courses = user?.role === "admin"
    ? allCourses
    : allCourses.filter((c) => c.instructorId === user?.id);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    deleteCourse(id);
    toast({ title: "Course deleted" });
  }

  const basePath = user?.role === "admin" ? "/admin" : "/instructor";

  return (
    <AppShell variant={variant}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Courses</div>
          <h1 className="mt-1 font-display text-3xl font-bold">
            {user?.role === "admin" ? "All Courses" : "My Courses"}
          </h1>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90">
          <Link to={`${basePath}/courses/new`}><Plus className="h-4 w-4" /> Create Course</Link>
        </Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No courses found.</p>
          <Button asChild className="mt-4 bg-gradient-primary hover:opacity-90">
            <Link to={`${basePath}/courses/new`}><Plus className="h-4 w-4" /> Create your first course</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-primary" />
              <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-primary">{c.category}</div>
              <h3 className="font-display text-lg font-bold leading-tight">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{c.assignedLearners.length} learner{c.assignedLearners.length !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{c.materials.length} material{c.materials.length !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{c.tag}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`${basePath}/courses/${c.id}`}><Pencil className="h-3.5 w-3.5" /> Manage</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}