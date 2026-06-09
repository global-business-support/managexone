import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Receipt, Calculator, Users, ArrowRight, Download } from "lucide-react";

type Billing = "monthly" | "yearly";

const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 2999,
    desc: "Perfect for small businesses & freelancers.",
    features: ["1 Company", "Up to 10 Employees", "GST Billing", "Basic Accounting", "Email Support"],
    cta: "Start Trial",
    highlight: false,
  },
  {
    id: "professional",
    name: "Professional",
    monthly: 5999,
    desc: "For growing SMEs & multi-branch businesses.",
    features: ["5 Companies", "Up to 100 Employees", "EPFO + ESIC + TDS Files", "P&L + Balance Sheet", "Priority Support", "Multi-user Access"],
    cta: "Start Trial",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    desc: "For large organizations & chains.",
    features: ["Unlimited Companies", "Unlimited Employees", "Dedicated CRM Module", "Custom Reports", "24x7 Support + SLA", "On-site Onboarding"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const inr = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Transparent Pricing</div>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Simple Plans. Powerful Features.</h2>
        <p className="mt-4 text-muted-foreground">1-day free trial. No credit card. Cancel anytime.</p>

        <div className="mt-8 inline-flex items-center rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              billing === "monthly" ? "bg-navy-deep text-white shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
              billing === "yearly" ? "bg-navy-deep text-white shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="rounded-full bg-gradient-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">SAVE 20%</span>
          </button>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const yearlyTotal = p.monthly ? Math.round(p.monthly * 12 * 0.8) : null;
          const yearlyPerMonth = p.monthly ? Math.round((p.monthly * 12 * 0.8) / 12) : null;
          const priceLabel = p.monthly === null
            ? "Custom"
            : billing === "monthly" ? inr(p.monthly) : inr(yearlyPerMonth!);
          const period = p.monthly === null ? "" : "/month";

          return (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                p.highlight
                  ? "border-accent bg-gradient-hero text-white shadow-elegant md:-translate-y-4"
                  : "border-border bg-card hover:border-accent/40"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-semibold text-gold-foreground shadow-gold">
                  MOST POPULAR
                </div>
              )}
              <div className="font-display text-2xl font-bold">{p.name}</div>
              <p className={`mt-1 text-sm ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{priceLabel}</span>
                <span className={p.highlight ? "text-white/60" : "text-muted-foreground"}>{period}</span>
              </div>
              {billing === "yearly" && yearlyTotal && (
                <div className={`mt-1 text-xs ${p.highlight ? "text-gold" : "text-accent"}`}>
                  {inr(yearlyTotal)} billed yearly · 20% off
                </div>
              )}
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-gold" : "text-accent"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  p.highlight
                    ? "bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-90"
                    : "bg-navy-deep text-white hover:bg-navy"
                }`}
              >
                {p.monthly === null ? (
                  <a href="#contact">{p.cta}</a>
                ) : (
                  <Link to="/checkout" search={{ plan: p.id, billing }}>{p.cta}</Link>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Per-module pricing */}
      <div className="mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-accent">Pick what you need</div>
          <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl">Buy individual modules</h3>
          <p className="mt-3 text-muted-foreground">Don't need the full suite? Get just Billing, Accounting or HRIS at a lower price.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { to: "/pricing/billing", icon: Receipt, name: "GST Billing", from: 799, desc: "GST invoices, e-Invoice, e-Way Bill, UPI collections.", color: "from-blue-500 to-indigo-600" },
            { to: "/pricing/accounting", icon: Calculator, name: "Accounting", from: 999, desc: "Double-entry accounting, P&L, BS, bank reconciliation.", color: "from-slate-700 to-blue-700" },
            { to: "/pricing/hris", icon: Users, name: "HRIS & Payroll", from: 1499, desc: "Attendance, payroll, PF/ESIC/TDS, payslips, ESS portal.", color: "from-indigo-600 to-blue-500" },
          ].map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-elegant"
            >
              <div className={`flex items-center justify-between bg-gradient-to-br ${m.color} p-6 text-white`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <m.icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-white/70">Starting at</div>
                  <div className="font-display text-2xl font-bold">₹ {m.from.toLocaleString("en-IN")}<span className="text-sm font-normal text-white/70">/mo</span></div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="font-display text-xl font-bold text-navy-deep">{m.name}</div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-2.5 transition-all">
                  View plans <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-hero p-8 text-white md:flex-row">
          <div>
            <div className="font-display text-2xl font-bold">Complete Services Brochure</div>
            <p className="mt-1 text-white/80">Every module, every feature, every plan — in one PDF.</p>
          </div>
          <a
            href="/ManageXOne-Services.pdf"
            download
            className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-gold hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}
