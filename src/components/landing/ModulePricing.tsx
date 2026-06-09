import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowLeft } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  monthly: number | null;
  perUnit?: string;
  desc: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export function ModulePricing({
  moduleName,
  tagline,
  accent,
  plans,
  highlights,
}: {
  moduleName: string;
  tagline: string;
  accent: string;
  plans: Plan[];
  highlights: { title: string; desc: string }[];
}) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const inr = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className={`relative overflow-hidden border-b bg-gradient-to-br ${accent} py-20 text-white`}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white, transparent 60%)" }} />
          <div className="container relative mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <div className="mt-6 max-w-3xl">
              <div className="text-xs uppercase tracking-widest text-white/70">Module Pricing</div>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">{moduleName}</h1>
              <p className="mt-4 text-lg text-white/85">{tagline}</p>
            </div>
            <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.title} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-sm font-semibold">{h.title}</div>
                  <div className="mt-1 text-xs text-white/75">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Plans built for {moduleName}</h2>
            <p className="mt-3 text-muted-foreground">Start with a 1-day free trial. Upgrade, downgrade or cancel anytime.</p>
            <div className="mt-7 inline-flex items-center rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${billing === "monthly" ? "bg-navy-deep text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${billing === "yearly" ? "bg-navy-deep text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Yearly <span className="rounded-full bg-gradient-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((p) => {
              const yearlyMonth = p.monthly ? Math.round((p.monthly * 12 * 0.8) / 12) : null;
              const priceLabel = p.monthly === null ? "Custom" : billing === "monthly" ? inr(p.monthly) : inr(yearlyMonth!);
              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl border p-8 transition-all ${
                    p.highlight ? "border-accent bg-gradient-hero text-white shadow-elegant md:-translate-y-3" : "border-border bg-card hover:border-accent/40"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-semibold text-gold-foreground shadow-gold">
                      RECOMMENDED
                    </div>
                  )}
                  <div className="font-display text-2xl font-bold">{p.name}</div>
                  <p className={`mt-1 text-sm ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-bold">{priceLabel}</span>
                    {p.monthly !== null && <span className={p.highlight ? "text-white/60" : "text-muted-foreground"}>/month</span>}
                  </div>
                  {p.perUnit && (
                    <div className={`mt-1 text-xs ${p.highlight ? "text-gold" : "text-accent"}`}>{p.perUnit}</div>
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
                      p.highlight ? "bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-90" : "bg-navy-deep text-white hover:bg-navy"
                    }`}
                  >
                    {p.monthly === null ? <a href="/#contact">{p.cta}</a> : <Link to="/signup">{p.cta}</Link>}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-card p-8 md:flex-row">
            <div>
              <div className="font-display text-xl font-bold text-navy-deep">Want full details?</div>
              <p className="mt-1 text-sm text-muted-foreground">Download our complete services brochure with every module, feature & pricing plan.</p>
            </div>
            <a
              href="/ManageXOne-Services.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Download PDF Brochure
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
