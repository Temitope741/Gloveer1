// ============================================================
// src/pages/assessments/SubmissionsReview.tsx
// ============================================================
import { useState } from "react";
import { AppShell, type AppShellVariant } from "@/components/AppShell";
import { useAuth, useAssessments, useSubmissions, getUsers, gradeSubmission } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Clock } from "lucide-react";

export default function SubmissionsReview() {
  const user = useAuth();
  const allAssessments = useAssessments();
  const allSubmissions = useSubmissions();
  const allUsers = getUsers();

  const variant: AppShellVariant = user?.role === "admin" ? "admin" : "instructor";

  const myAssessments = user?.role === "admin"
    ? allAssessments
    : allAssessments.filter((a) => a.createdBy === user?.id);

  const mySubmissions = allSubmissions.filter((s) =>
    myAssessments.some((a) => a.id === s.assessmentId)
  );

  const [grading, setGrading] = useState<Record<string, { score: string; feedback: string }>>({});

  function handleGrade(subId: string) {
    const g = grading[subId];
    if (!g?.score || isNaN(Number(g.score))) {
      toast({ title: "Enter a valid score", variant: "destructive" });
      return;
    }
    gradeSubmission(subId, Number(g.score), g.feedback ?? "");
    toast({ title: "Graded!", description: `Score: ${g.score}/100` });
  }

  return (
    <AppShell variant={variant}>
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Submissions</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Review Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mySubmissions.filter((s) => s.status === "submitted").length} pending · {mySubmissions.filter((s) => s.status === "graded").length} graded
        </p>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {mySubmissions.map((s) => {
            const assessment = myAssessments.find((a) => a.id === s.assessmentId);
            const learner = allUsers.find((u) => u.id === s.learnerId);
            const g = grading[s.id] ?? { score: "", feedback: "" };

            return (
              <div key={s.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-display text-lg font-bold">{assessment?.title ?? "Unknown Assessment"}</div>
                    <div className="text-sm text-muted-foreground">
                      {learner?.name ?? "Unknown learner"} · Submitted {new Date(s.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-mono uppercase shrink-0 ${s.status === "graded" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {s.status === "graded" ? <><CheckCircle2 className="h-3 w-3" /> Graded · {s.score}/100</> : <><Clock className="h-3 w-3" /> Pending</>}
                  </span>
                </div>

                {/* Answers */}
                <div className="mt-4 space-y-3">
                  {s.answers.map((ans, i) => {
                    const question = assessment?.questions.find((q) => q.id === ans.questionId);
                    return (
                      <div key={ans.questionId} className="rounded-xl bg-secondary/50 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Q{i + 1}: {question?.question}</div>
                        <div className="text-sm">{ans.answer}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Grade form */}
                {s.status === "submitted" && (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Score (0–100)</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-28"
                        placeholder="85"
                        value={g.score}
                        onChange={(e) => setGrading({ ...grading, [s.id]: { ...g, score: e.target.value } })}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium">Feedback (optional)</label>
                      <Input
                        placeholder="Great work! Consider…"
                        value={g.feedback}
                        onChange={(e) => setGrading({ ...grading, [s.id]: { ...g, feedback: e.target.value } })}
                      />
                    </div>
                    <Button onClick={() => handleGrade(s.id)} className="bg-gradient-primary hover:opacity-90 shrink-0">
                      Submit Grade
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}