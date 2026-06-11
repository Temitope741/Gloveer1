import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/store";

export default function Profile() {
  const user = useAuth();
  if (!user) return null;
  return (
    <AppShell variant="user">
      <h1 className="font-display text-3xl font-bold">Profile</h1>
      <div className="mt-8 max-w-xl rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-2xl font-bold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-display text-xl font-bold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">User ID</dt>
            <dd className="mt-1 font-mono">{user.id}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Joined</dt>
            <dd className="mt-1">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</dd>
          </div>
        </dl>
      </div>
    </AppShell>
  );
}