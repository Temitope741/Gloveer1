import { Calendar, Clock, ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClassItem } from "@/lib/store";

const categoryStyles: Record<string, string> = {
  "Web Development": "bg-primary/10 text-primary",
  "Cybersecurity": "bg-accent/15 text-accent-foreground",
  "Data Analytics": "bg-success/15 text-success",
};

export function ClassCard({ item, onJoin }: { item: ClassItem; onJoin?: (item: ClassItem) => void }) {
  const d = new Date(item.date);
  const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
      <Badge variant="secondary" className={`mb-3 font-mono text-[10px] uppercase tracking-wider ${categoryStyles[item.category] ?? ""}`}>
        {item.category}
      </Badge>
      <h3 className="font-display text-xl font-bold leading-tight">{item.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      <div className="mt-4 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{dateStr}</div>
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{timeStr}</div>
        <div className="flex items-center gap-1.5 sm:col-span-2"><User className="h-3.5 w-3.5" />{item.trainer}</div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <Button
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => onJoin?.(item)}
          asChild
        >
          <a href={item.zoomLink} target="_blank" rel="noopener noreferrer">
            Join Class <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live · Zoom</span>
      </div>
    </article>
  );
}