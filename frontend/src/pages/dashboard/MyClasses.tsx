import { AppShell } from "@/components/AppShell";
import { ClassCard } from "@/components/ClassCard";
import { useClasses } from "@/lib/store";

export default function MyClasses() {
  const classes = useClasses();
  return (
    <AppShell variant="user">
      <h1 className="font-display text-3xl font-bold">My Classes</h1>
      <p className="mt-1 text-sm text-muted-foreground">All the live classes you can join right now.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => <ClassCard key={c.id} item={c} />)}
      </div>
    </AppShell>
  );
}