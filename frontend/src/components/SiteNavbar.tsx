import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAuth, logout } from "@/lib/store";
import { LogOut } from "lucide-react";

export function SiteNavbar() {
  const user = useAuth();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          <a href="/#courses" className="text-muted-foreground hover:text-foreground">Courses</a>
          <a href="/#features" className="text-muted-foreground hover:text-foreground">Why us</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => nav(user.isAdmin ? "/admin" : "/dashboard")}>
                {user.isAdmin ? "Admin" : "Dashboard"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { logout(); nav("/"); }}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => nav("/login")}>Login</Button>
              <Button onClick={() => nav("/signup")} className="bg-gradient-primary hover:opacity-90">Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}