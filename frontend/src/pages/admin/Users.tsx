import { AppShell } from "@/components/AppShell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUsers, useStore } from "@/lib/store";

export default function Users() {
  useStore();
  const users = getUsers();
  return (
    <AppShell variant="admin">
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Everyone who has signed up to Gloveer Virtual Academy.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No users yet.</TableCell></TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="font-mono text-xs">{u.email}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}