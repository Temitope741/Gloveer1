import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { signUp, type Role } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [role, setRole] = useState<Role>("learner");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      signUp({ name: form.name, email: form.email, password: form.password, role });
      toast({ title: "Account created!", description: "Welcome to Gloveer Virtual Academy 🎓" });
      if (role === "instructor") nav("/instructor");
      else nav("/dashboard");
    } catch (err) {
      toast({ title: "Sign up failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8"><Link to="/"><Logo /></Link></div>
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* Role selector */}
            <div className="space-y-2">
              <Label>I am joining as a…</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["learner", "instructor"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                      role === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {r === "learner" ? "🎓 Learner" : "👨‍🏫 Instructor"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Temitope Glover" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm</Label>
                <Input id="confirm" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90">
              {loading ? "Creating…" : "Create Account"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:block bg-gradient-hero">
        <div className="flex h-full items-center justify-center p-10">
          <div className="max-w-sm">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Get started</div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">Build skills that ship.</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">▸</span> Live, interactive classes</li>
              <li className="flex gap-2"><span className="text-primary">▸</span> Real projects, real feedback</li>
              <li className="flex gap-2"><span className="text-primary">▸</span> Community of builders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}