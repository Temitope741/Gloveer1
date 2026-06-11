// ============================================================
// src/pages/assessments/TakeAssessment.tsx  (Learner submits)
// ============================================================
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth, useAssessments, useSubmissions, createSubmission } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";

export default function TakeAssessment() {
  const { id } = useParams<{ id: string }>();
  const user = useAuth();
  const nav = useNavigate();
  const assessments = useAssessments();
  const submissions = useSubmissions();

  const assessment = assessments.find((a) => a.id === id);
  const existing = submissions.find((s) => s.assessmentId === id && s.learnerId === user?.id);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!assessment) return (
    <AppShell variant="user">
      <div className="text-center py-20 text-muted-foreground">Assessment not found.</div>
    </AppShell>
  );

  if (existing) return (
    <AppShell variant="user">
      <button onClick={() => nav("/dashboard/assessments")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">{assessment.title}</h1>
        <div className="mt-4 rounded-2xl border border-border/60 bg-card p-6 shadow-card text-center">
          <div className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${existing.status === "graded" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
            {existing.status === "graded" ? "✅ Graded" : "⏳ Awaiting grade"}
          </div>
          {existing.status === "graded" && (
            <div className="mt-4">
              <div className="font-display text-5xl font-bold">{existing.score}<span className="text-2xl text-muted-foreground">/100</span></div>
              {existing.feedback && (
                <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm text-left">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Feedback</div>
                  {existing.feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allAnswered = assessment!.questions.every((q) => answers[q.id]?.trim());
    if (!allAnswered) {
      toast({ title: "Please answer all questions", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    createSubmission({
      assessmentId: assessment!.id,
      learnerId: user!.id,
      answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
    });
    toast({ title: "Submitted!", description: "Your instructor will review and grade it soon." });
    nav("/dashboard/assessments");
  }

  return (
    <AppShell variant="user">
      <button onClick={() => nav("/dashboard/assessments")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to assessments
      </button>

      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">{assessment.title}</h1>
        {assessment.description && <p className="mt-2 text-muted-foreground">{assessment.description}</p>}
        <div className="mt-2 text-xs font-mono text-muted-foreground">
          Due: {new Date(assessment.deadline).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {assessment.questions.map((q, i) => (
            <div key={q.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">Question {i + 1}</div>
              <p className="font-medium">{q.question}</p>
              {q.type === "text" ? (
                <textarea
                  className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Type your answer here…"
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                />
              ) : (
                <div className="mt-3">
                  <input
                    type="url"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Paste file URL (in production: connect file upload)"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                </div>
              )}
            </div>
          ))}

          <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary hover:opacity-90">
            <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Assessment"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}