import { createFileRoute } from "@tanstack/react-router";
import { ModulePricing } from "@/components/landing/ModulePricing";

export const Route = createFileRoute("/pricing/accounting")({
  head: () => ({
    meta: [
      { title: "Accounting Software Pricing — ManageXOne" },
      { name: "description", content: "Double-entry accounting with P&L, Balance Sheet & bank reconciliation. From ₹999/month." },
    ],
  }),
  component: () => (
    <ModulePricing
      moduleName="Accounting & Bookkeeping"
      tagline="Full double-entry accounting with ledgers, P&L, Balance Sheet, bank reconciliation and audit-ready exports."
      accent="from-slate-800 to-blue-700"
      highlights={[
        { title: "Double-entry", desc: "Audit-ready" },
        { title: "Bank Recon", desc: "Auto-match" },
        { title: "P&L + BS", desc: "Real-time" },
        { title: "Multi-currency", desc: "Built-in FX" },
      ]}
      plans={[
        {
          id: "acc-basic",
          name: "Basic",
          monthly: 999,
          desc: "Single-user bookkeeping.",
          features: ["1 user, 1 company", "Chart of accounts", "Sales / Purchase / Journal", "Trial balance + P&L", "Excel export"],
          cta: "Start Trial",
        },
        {
          id: "acc-standard",
          name: "Standard",
          monthly: 1799,
          desc: "For practising accountants & SMEs.",
          features: ["3 users", "Up to 3 companies", "Bank reconciliation", "Cost center accounting", "Balance Sheet + Cash Flow", "Multi-currency", "Tally import/export"],
          cta: "Start Trial",
          highlight: true,
        },
        {
          id: "acc-pro",
          name: "Pro",
          monthly: 2999,
          desc: "Firms managing many clients.",
          features: ["Unlimited users", "Unlimited companies", "Audit trail + approvals", "Project / branch accounting", "Scheduled report emails", "API + Webhooks", "Priority support"],
          cta: "Start Trial",
        },
      ]}
    />
  ),
});
