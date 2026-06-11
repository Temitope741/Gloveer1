// ============================================================
// src/pages/courses/CourseDetail.tsx
// ============================================================
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, useCourses, addMaterial, deleteMaterial, updateCourse, getUsers } from "@/lib/store";
import { Upload, Trash2, FileText, Download, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { CourseMaterial } from "@/lib/store";

const FILE_TYPE_ICONS: Record<CourseMaterial["fileType"], string> = {
  pdf: "📄",
  slides: "📊",
  video: "🎬",
  document: "📝",
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useAuth();
  const nav = useNavigate();
  const courses = useCourses();
  const course = courses.find((c) => c.id === id);
  const allUsers = getUsers();

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";
  const basePath = user?.role === "admin" ? "/admin" : "/instructor";

  const [matForm, setMatForm] = useState({
    title: "",
    fileUrl: "",
    fileType: "pdf" as CourseMaterial["fileType"],
    downloadable: true,
  });
  const [showAdd, setShowAdd] = useState(false);

  if (!course) return (
    <AppShell variant={variant}>
      <div className="text-center py-20 text-muted-foreground">Course not found.</div>
    </AppShell>
  );

  function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!matForm.title.trim() || !matForm.fileUrl.trim()) {
      toast({ title: "Title and file URL are required", variant: "destructive" });
      return;
    }
    addMaterial(course!.id, { ...matForm, courseId: course!.id, uploadedBy: user?.id ?? "" });
    toast({ title: "Material added!" });
    setMatForm({ title: "", fileUrl: "", fileType: "pdf", downloadable: true });
    setShowAdd(false);
  }

  function handleDeleteMaterial(matId: string) {
    if (!confirm("Remove this material?")) return;
    deleteMaterial(course!.id, matId);
    toast({ title: "Material removed" });
  }

  const assignedLearnerObjects = allUsers.filter((u) => course.assignedLearners.includes(u.id));

  return (
    <AppShell variant={variant}>
      <button onClick={() => nav(`${basePath}/courses`)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </button>

      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-wider text-primary">{course.category}</div>
        <h1 className="mt-1 font-display text-3xl font-bold">{course.title}</h1>
        <p className="mt-1 text-muted-foreground">{course.description}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>{course.instructorName}</span>
          <span>·</span>
          <span>{course.tag}</span>
          <span>·</span>
          <span>{course.assignedLearners.length} learner{course.assignedLearners.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Materials */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Course Materials</h2>
            <Button size="sm" onClick={() => setShowAdd((v) => !v)} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Material
            </Button>
          </div>

          {/* Add material form */}
          {showAdd && (
            <form onSubmit={handleAddMaterial} className="rounded-2xl border border-primary/30 bg-card p-5 shadow-card space-y-3">
              <h3 className="font-semibold text-sm">New Material</h3>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={matForm.title} onChange={(e) => setMatForm({ ...matForm, title: e.target.value })} placeholder="e.g. Week 1 Slides" />
              </div>
              <div className="space-y-1">
                <Label>File URL <span className="text-muted-foreground text-xs">(paste link — in production, connect file upload)</span></Label>
                <Input value={matForm.fileUrl} onChange={(e) => setMatForm({ ...matForm, fileUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Type</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={matForm.fileType} onChange={(e) => setMatForm({ ...matForm, fileType: e.target.value as CourseMaterial["fileType"] })}>
                    <option value="pdf">PDF</option>
                    <option value="slides">Slides</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={matForm.downloadable} onChange={(e) => setMatForm({ ...matForm, downloadable: e.target.checked })} className="accent-primary" />
                    Allow download
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="bg-gradient-primary hover:opacity-90"><Upload className="h-4 w-4" /> Save Material</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {course.materials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-muted-foreground text-sm">
              No materials yet. Add your first file above.
            </div>
          ) : (
            <div className="space-y-3">
              {course.materials.map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-card">
                  <span className="text-2xl">{FILE_TYPE_ICONS[m.fileType]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground font-mono uppercase">{m.fileType} · {new Date(m.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {m.downloadable && (
                      <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </a>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMaterial(m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Learners */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Assigned Learners</h2>
          {assignedLearnerObjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">No learners assigned.</div>
          ) : (
            <div className="space-y-2">
              {assignedLearnerObjects.map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shrink-0">
                    {l.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}