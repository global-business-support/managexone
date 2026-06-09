import { createFileRoute } from "@tanstack/react-router";
import { ModulePricing } from "@/components/landing/ModulePricing";

export const Route = createFileRoute("/pricing/billing")({
  head: () => ({
    meta: [
      { title: "GST Billing Pricing — ManageXOne" },
      { name: "description", content: "Affordable GST billing & e-Invoicing plans for Indian businesses. From ₹799/month." },
    ],
  }),
  component: () => (
    <ModulePricing
      moduleName="GST Billing & Invoicing"
      tagline="Create GST-compliant invoices, e-Invoices and e-Way Bills in seconds. Send by WhatsApp or email, collect via UPI in one tap."
      accent="from-blue-600 to-indigo-700"
      highlights={[
        { title: "GST Compliant", desc: "B2B, B2C, Export, RCM" },
        { title: "e-Invoice + IRN", desc: "Auto-generated" },
        { title: "e-Way Bill", desc: "One-click" },
        { title: "UPI / QR", desc: "Instant payments" },
      ]}
      plans={[
        {
          id: "billing-basic",
          name: "Basic",
          monthly: 799,
          desc: "For freelancers & solo founders.",
          features: ["1 user", "100 invoices / month", "GST invoices (B2B, B2C)", "PDF + Email delivery", "GSTR-1 summary"],
          cta: "Start Trial",
        },
        {
          id: "billing-standard",
          name: "Standard",
          monthly: 1499,
          desc: "For growing SMEs.",
          features: ["5 users", "Unlimited invoices", "e-Invoice (IRN) + e-Way Bill", "Quotation → Invoice flow", "Recurring invoices + UPI/QR", "GSTR-1, 3B, 9 reports"],
          cta: "Start Trial",
          highlight: true,
        },
        {
          id: "billing-pro",
          name: "Pro",
          monthly: 2499,
          desc: "Multi-branch & multi-company.",
          features: ["Unlimited users", "Multi-company billing", "WhatsApp invoices", "Stock-linked billing (batch & expiry)", "API access", "Priority support"],
          cta: "Start Trial",
        },
      ]}
    />
  ),
});
