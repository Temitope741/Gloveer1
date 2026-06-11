// ============================================================
// src/pages/admin/UsersManagement.tsx
// ============================================================
import { AppShell } from "@/components/AppShell";
import { useStore, getUsers } from "@/lib/store";
import { Users, GraduationCap, BookOpen } from "lucide-react";

export default function UsersManagement() {
  useStore();
  const users = getUsers();
  const admins = users.filter((u) => u.role === "admin");
  const instructors = users.filter((u) => u.role === "instructor");
  const learners = users.filter((u) => u.role === "learner");

  const roleConfig = {
    admin: { label: "Admins", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", items: admins },
    instructor: { label: "Instructors", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", items: instructors },
    learner: { label: "Learners", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10", items: learners },
  };

  return (
    <AppShell variant="admin">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">People</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">{users.length} total registered users</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(roleConfig).map(([role, cfg]) => (
          <div key={role}>
            <div className="mb-3 flex items-center gap-2">
              <div className={`rounded-lg p-1.5 ${cfg.bg}`}>
                <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <h2 className="font-display text-lg font-bold">{cfg.label}</h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-mono">{cfg.items.length}</span>
            </div>
            {cfg.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                No {cfg.label.toLowerCase()} yet.
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/60 bg-secondary/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Email</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground hidden md:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {cfg.items.map((u) => (
                      <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}