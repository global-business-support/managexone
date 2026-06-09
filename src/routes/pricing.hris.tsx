import { createFileRoute } from "@tanstack/react-router";
import { ModulePricing } from "@/components/landing/ModulePricing";

export const Route = createFileRoute("/pricing/hris")({
  head: () => ({
    meta: [
      { title: "HRIS & Payroll Pricing — ManageXOne" },
      { name: "description", content: "Payroll, attendance, PF/ESIC/TDS filings. From ₹1,499/month + per-employee." },
    ],
  }),
  component: () => (
    <ModulePricing
      moduleName="HRIS & Payroll"
      tagline="From hire to retire — attendance, payroll, statutory filings (PF/ESIC/TDS), payslips and employee self-service in one place."
      accent="from-indigo-700 to-blue-600"
      highlights={[
        { title: "PF / ESIC / TDS", desc: "Auto computed" },
        { title: "Attendance", desc: "Shift & leave" },
        { title: "Payslips", desc: "Bulk + email" },
        { title: "ESS Portal", desc: "Employee self-service" },
      ]}
      plans={[
        {
          id: "hris-basic",
          name: "Basic",
          monthly: 1499,
          perUnit: "+ ₹49 / employee / month",
          desc: "For small teams (up to 25).",
          features: ["Employee master", "Attendance & leave", "Payroll run + payslips", "PF / ESIC computation", "Email support"],
          cta: "Start Trial",
        },
        {
          id: "hris-standard",
          name: "Standard",
          monthly: 2999,
          perUnit: "+ ₹39 / employee / month",
          desc: "Growing companies (up to 100).",
          features: ["Everything in Basic", "Shift management", "TDS + Form 16", "ECR file export", "Reimbursements & loans", "Employee self-service portal"],
          cta: "Start Trial",
          highlight: true,
        },
        {
          id: "hris-pro",
          name: "Pro",
          monthly: 4999,
          perUnit: "+ ₹29 / employee / month",
          desc: "Unlimited employees & branches.",
          features: ["Everything in Standard", "Multi-company payroll", "Statutory filings (24Q, 26Q)", "Approval workflows", "API access", "Dedicated success manager"],
          cta: "Start Trial",
        },
      ]}
    />
  ),
});
