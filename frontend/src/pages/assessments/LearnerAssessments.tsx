// ============================================================
// src/pages/assessments/LearnerAssessments.tsx
// ============================================================
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useAssessments, useSubmissions } from "@/lib/store";
import { ClipboardList, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnerAssessments() {
  const user = useAuth();
  const allAssessments = useAssessments();
  const allSubmissions = useSubmissions();

  const myAssessments = allAssessments.filter((a) => user && a.assignedLearners.includes(user.id));
  const mySubmissions = allSubmissions.filter((s) => s.learnerId === user?.id);

  function getSubmission(assessmentId: string) {
    return mySubmissions.find((s) => s.assessmentId === assessmentId);
  }

  return (
    <AppShell variant="user">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Assessments</div>
        <h1 className="mt-1 font-display text-3xl font-bold">My Assessments</h1>
      </div>

      {myAssessments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No assessments assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myAssessments.map((a) => {
            const submission = getSubmission(a.id);
            const overdue = new Date(a.deadline) < new Date() && !submission;
            const isGraded = submission?.status === "graded";
            return (
              <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{a.questions.length} question{a.questions.length !== 1 ? "s" : ""}</span>
                      <span>·</span>
                      <span className={overdue ? "text-destructive font-medium" : ""}>
                        {overdue ? "Overdue · " : "Due · "}
                        {new Date(a.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {submission ? (
                      <div className="space-y-1 text-right">
                        <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-mono uppercase ${isGraded ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                          {isGraded ? <><CheckCircle2 className="h-3 w-3" /> Graded</> : <><Clock className="h-3 w-3" /> Submitted</>}
                        </div>
                        {isGraded && submission.score !== undefined && (
                          <div className="text-right text-xs text-muted-foreground">Score: <span className="font-bold text-foreground">{submission.score}/100</span></div>
                        )}
                      </div>
                    ) : (
                      <Button asChild className="bg-gradient-primary hover:opacity-90" size="sm">
                        <Link to={`/dashboard/assessments/${a.id}`}>
                          Start <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                {isGraded && submission?.feedback && (
                  <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Instructor Feedback</div>
                    {submission.feedback}
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