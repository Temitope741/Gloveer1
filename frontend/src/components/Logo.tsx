import { GraduationCap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-tight">Gloveer</div>
        <div className="-mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Virtual Academy</div>
      </div>
    </div>
  );
}