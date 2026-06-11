import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, User as UserIcon, LogOut, Plus, ListChecks,
  Users as UsersIcon, FileText, ClipboardList, Upload, Settings, Menu, X, Bell,
  ChevronDown, ChevronRight, GraduationCap,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth, logout } from "@/lib/store";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: Item[];
};

const adminItems: Item[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/admin/courses", label: "Courses", icon: BookOpen,
    children: [
      { to: "/admin/courses", label: "All Courses", icon: ListChecks },
      { to: "/admin/courses/new", label: "Add Course", icon: Plus },
    ],
  },
  {
    to: "/admin/assessments", label: "Assessments", icon: ClipboardList,
    children: [
      { to: "/admin/assessments", label: "All Assessments", icon: ListChecks },
      { to: "/admin/assessments/new", label: "Create Assessment", icon: Plus },
    ],
  },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
  { to: "/admin/classes", label: "Live Classes", icon: GraduationCap },
  { to: "/admin/profile", label: "Profile", icon: UserIcon },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const instructorItems: Item[] = [
  { to: "/instructor", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/instructor/courses", label: "Courses", icon: BookOpen,
    children: [
      { to: "/instructor/courses", label: "My Courses", icon: ListChecks },
      { to: "/instructor/courses/new", label: "Create Course", icon: Plus },
      { to: "/instructor/courses/upload", label: "Upload Material", icon: Upload },
    ],
  },
  {
    to: "/instructor/assessments", label: "Assessments", icon: ClipboardList,
    children: [
      { to: "/instructor/assessments", label: "My Assessments", icon: ListChecks },
      { to: "/instructor/assessments/new", label: "Create Assessment", icon: Plus },
      { to: "/instructor/submissions", label: "Submissions", icon: FileText },
    ],
  },
  { to: "/instructor/learners", label: "My Learners", icon: UsersIcon },
  { to: "/instructor/profile", label: "Profile", icon: UserIcon },
  { to: "/instructor/settings", label: "Settings", icon: Settings },
];

const learnerItems: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { to: "/dashboard/assessments", label: "Assessments", icon: ClipboardList },
  { to: "/dashboard/classes", label: "Live Classes", icon: GraduationCap },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavItem({ item, depth = 0 }: { item: Item; depth?: number }) {
  const loc = useLocation();
  const isParentActive = loc.pathname.startsWith(item.to) && item.children;
  const [open, setOpen] = useState(!!isParentActive);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isParentActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {open && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border/60 pl-3">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <child.icon className="h-3.5 w-3.5" />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to.split("/").length <= 2}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </NavLink>
  );
}

export type AppShellVariant = "user" | "admin" | "instructor";

export function AppShell({ children, variant }: { children: ReactNode; variant: AppShellVariant }) {
  const items = variant === "admin" ? adminItems : variant === "instructor" ? instructorItems : learnerItems;
  const user = useAuth();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleBadge = variant === "admin"
    ? { label: "Admin Panel", color: "bg-gradient-ink text-primary-foreground" }
    : variant === "instructor"
    ? { label: "Instructor", color: "bg-accent/20 text-accent-foreground" }
    : null;

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-5">
        <Link to="/" onClick={() => setMobileOpen(false)}><Logo /></Link>
        <button className="md:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
      </div>

      {roleBadge && (
        <div className={`mx-4 mb-3 rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-wider ${roleBadge.color}`}>
          {roleBadge.label}
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.map((it) => <NavItem key={it.to} item={it} />)}
      </nav>

      <div className="border-t border-border/60 p-3 space-y-1">
        {user && (
          <div className="rounded-lg bg-secondary/60 px-3 py-2 mb-2">
            <div className="text-xs font-medium truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-primary">{user.role}</div>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => { logout(); nav("/"); }}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card md:flex">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-card transition-transform md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </aside>

        {/* Main content */}
        <div className="flex min-h-screen w-full flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur md:hidden">
            <button onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/"><Logo /></Link>
            <button onClick={() => { logout(); nav("/"); }}>
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </header>

          {/* Desktop top bar */}
          <header className="sticky top-0 z-20 hidden h-14 items-center justify-end border-b border-border/60 bg-background/90 px-8 backdrop-blur md:flex gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            {user && (
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5">
                <div className="h-6 w-6 rounded-full bg-gradient-primary grid place-items-center text-[10px] font-bold text-primary-foreground">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium">{user.name}</span>
              </div>
            )}
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}