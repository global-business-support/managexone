import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, loading, isAdmin, isActive, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (isAdmin) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (user && !isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 p-6">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-2xl">⛔</div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">Account Suspended</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hi {profile?.full_name ?? "there"}, your account access has been temporarily deactivated by an administrator.
            Please contact support to re-enable your account.
          </p>
          <div className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{profile?.email}</div>
          <button onClick={() => signOut()} className="mt-6 w-full rounded-md bg-navy-deep px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep/90">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
