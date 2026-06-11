import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/store";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export function RequireInstructor({ children }: { children: JSX.Element }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "instructor" && user.role !== "admin")
    return <Navigate to="/dashboard" replace />;
  return children;
}

export function RequireLearner({ children }: { children: JSX.Element }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "learner") {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
  }
  return children;
}

// Redirects to the correct dashboard based on role after login
export function RoleRedirect() {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "instructor") return <Navigate to="/instructor" replace />;
  return <Navigate to="/dashboard" replace />;
}