import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClasses, deleteClass } from "@/lib/store";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ManageClasses() {
  const classes = useClasses();
  const nav = useNavigate();

  function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteClass(id);
    toast({ title: "Class deleted" });
  }

  return (
    <AppShell variant="admin">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Manage Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Edit, reschedule, or remove classes.</p>
        </div>
        <Button onClick={() => nav("/admin/new")} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Trainer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No classes yet.</TableCell></TableRow>
            )}
            {classes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{c.category}</TableCell>
                <TableCell className="font-mono text-xs">
                  {new Date(c.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{c.trainer}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => nav(`/admin/edit/${c.id}`)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.id, c.title)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}