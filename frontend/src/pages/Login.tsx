import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { login } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      const roleLabel = res.role === "admin" ? "Admin" : res.role === "instructor" ? "Instructor" : "Learner";
      toast({ title: "Welcome back!", description: `Signed in as ${roleLabel}` });
      if (res.role === "admin") nav("/admin");
      else if (res.role === "instructor") nav("/instructor");
      else nav("/dashboard");
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden md:block bg-gradient-ink">
        <div className="flex h-full flex-col justify-between p-10 text-primary-foreground">
          <Link to="/"><Logo className="text-primary-foreground" /></Link>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Welcome back</div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">Pick up where you left off.</h2>
            <p className="mt-3 max-w-sm text-primary-foreground/70">Log in to continue your live classes and track your progress.</p>
          </div>
          <div className="font-mono text-xs opacity-60">{new Date().getFullYear()} · Gloveer Virtual Academy</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="font-display text-3xl font-bold">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">New here? <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link></p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90">
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}   