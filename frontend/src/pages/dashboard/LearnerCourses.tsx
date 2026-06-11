// ============================================================
// src/pages/dashboard/LearnerCourses.tsx
// ============================================================
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useCourses } from "@/lib/store";
import { BookOpen, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnerCourses() {
  const user = useAuth();
  const allCourses = useCourses();
  const myCourses = allCourses.filter((c) => user && c.assignedLearners.includes(user.id));

  return (
    <AppShell variant="user">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Learning</div>
        <h1 className="mt-1 font-display text-3xl font-bold">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">{myCourses.length} course{myCourses.length !== 1 ? "s" : ""} assigned to you</p>
      </div>

      {myCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No courses assigned yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myCourses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
              <div className="h-1 bg-gradient-primary" />
              <div className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-primary">{c.category}</div>
                    <h3 className="mt-1 font-display text-xl font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {c.instructorName} · {c.tag}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-mono">{c.materials.length} material{c.materials.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Materials list */}
                {c.materials.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Course Materials</div>
                    {c.materials.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{m.fileType === "pdf" ? "📄" : m.fileType === "slides" ? "📊" : m.fileType === "video" ? "🎬" : "📝"}</span>
                          <div>
                            <div className="text-sm font-medium">{m.title}</div>
                            <div className="text-xs text-muted-foreground font-mono uppercase">{m.fileType}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button asChild variant="ghost" size="sm" className="text-primary">
                            <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Play className="h-4 w-4" /> Open
                            </a>
                          </Button>
                          {m.downloadable && (
                            <Button asChild variant="ghost" size="sm">
                              <a href={m.fileUrl} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {c.materials.length === 0 && (
                  <div className="mt-4 rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                    No materials uploaded yet. Check back soon!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}