import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import {
  Users, Calculator, Receipt, ShieldCheck, FolderKanban, Building2,
  BarChart3, FileText, TrendingUp, IndianRupee, CheckCircle2, Clock,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

const MODULES = [
  { to: "/dashboard/hris", label: "HRIS & Payroll", icon: Users, color: "from-blue-500 to-indigo-600" },
  { to: "/dashboard/accounting", label: "Accounting", icon: Calculator, color: "from-emerald-500 to-teal-600" },
  { to: "/dashboard/billing", label: "Billing & GST", icon: Receipt, color: "from-amber-500 to-orange-600" },
  { to: "/dashboard/compliance", label: "EPFO / ESIC / TDS", icon: ShieldCheck, color: "from-rose-500 to-pink-600" },
  { to: "/dashboard/crm", label: "Multi-Company CRM", icon: FolderKanban, color: "from-violet-500 to-purple-600" },
  { to: "/dashboard/industries", label: "Industries", icon: Building2, color: "from-cyan-500 to-sky-600" },
  { to: "/dashboard/reports", label: "P&L / Balance Sheet", icon: BarChart3, color: "from-fuchsia-500 to-pink-600" },
  { to: "/dashboard/documents", label: "Documents", icon: FileText, color: "from-slate-500 to-zinc-600" },
] as const;

function OverviewPage() {
  const { profile, role, isAdmin, isApproved, trialExpired } = useAuth();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-navy-deep">
          Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.company_name && `${profile.company_name} • `}
          Here's a quick overview of your ManageXOne workspace.
        </p>
      </header>

      {/* Status banner */}
      {role === "trial" && !isApproved && (
        <Card className="border-amber-400/40 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900">
                {trialExpired ? "Your trial has expired" : "You're on a 1-day free trial"}
              </div>
              <p className="text-sm text-amber-800">
                Limited preview access only. An administrator will approve your account for full features.
              </p>
            </div>
          </div>
        </Card>
      )}

      {isApproved && !isAdmin && (
        <Card className="border-emerald-400/40 bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="font-medium text-emerald-900">
              Your account is approved — all modules are unlocked.
            </div>
          </div>
        </Card>
      )}

      {isAdmin && (
        <Card className="border-amber-400/60 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-bold text-navy-deep">Administrator access</div>
              <p className="text-sm text-muted-foreground">
                You have full control of users, modules and system settings.
              </p>
            </div>
            <Link
              to="/dashboard/admin"
              className="rounded-md bg-gradient-gold px-4 py-2 text-sm font-semibold text-gold-foreground"
            >
              Manage Users →
            </Link>
          </div>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "₹0", icon: IndianRupee, delta: "+0%" },
          { label: "Employees", value: "0", icon: Users, delta: "Active" },
          { label: "Invoices", value: "0", icon: Receipt, delta: "This month" },
          { label: "Growth", value: "—", icon: TrendingUp, delta: "Awaiting data" },
        ].map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-navy-deep">{k.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
          </Card>
        ))}
      </div>

      {/* Modules grid */}
      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-navy-deep">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to}>
              <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${m.color} p-2.5 text-white`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground">{m.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">Open module →</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
