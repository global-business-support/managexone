import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Calendar, ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ManageXOne | Business, GST, Payroll & Compliance Insights" },
      { name: "description", content: "Guides on GST, payroll, EPFO/ESIC, accounting and growing Indian SMEs with ManageXOne." },
      { property: "og:title", content: "ManageXOne Blog" },
      { property: "og:description", content: "Insights for Indian businesses — GST, payroll, compliance and growth." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    slug: "gst-e-invoicing-guide-2026",
    title: "The Complete Guide to GST e-Invoicing in 2026",
    excerpt: "Thresholds, IRN workflow, common rejections and how to automate e-Invoicing end-to-end.",
    date: "Jun 02, 2026",
    read: "8 min",
    tag: "GST & Billing",
    color: "from-blue-500 to-indigo-500",
  },
  {
    slug: "payroll-mistakes-indian-smes",
    title: "7 Payroll Mistakes Every Indian SME Should Avoid",
    excerpt: "From PF basis to TDS slabs — the small errors that lead to big statutory penalties.",
    date: "May 24, 2026",
    read: "6 min",
    tag: "HRIS & Payroll",
    color: "from-sky-500 to-blue-600",
  },
  {
    slug: "epfo-ecr-file-checklist",
    title: "EPFO ECR File Checklist: Filing Without Errors",
    excerpt: "A field-by-field walkthrough of the ECR file with the common mismatches employers face.",
    date: "May 12, 2026",
    read: "5 min",
    tag: "Compliance",
    color: "from-indigo-500 to-blue-500",
  },
  {
    slug: "balance-sheet-explained",
    title: "Reading a Balance Sheet (For Non-Accountants)",
    excerpt: "Assets, liabilities, equity — explained with a simple Indian SME example.",
    date: "Apr 28, 2026",
    read: "7 min",
    tag: "Accounting",
    color: "from-blue-600 to-slate-700",
  },
  {
    slug: "multi-company-crm-playbook",
    title: "The Multi-Company CRM Playbook",
    excerpt: "How holding companies and group businesses run a single pipeline across entities.",
    date: "Apr 14, 2026",
    read: "9 min",
    tag: "CRM",
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "hotel-pms-checklist",
    title: "Choosing a Hotel PMS: 12-Point Checklist",
    excerpt: "Front desk, POS, channel manager — what to evaluate before signing a contract.",
    date: "Mar 30, 2026",
    read: "10 min",
    tag: "Industries",
    color: "from-indigo-600 to-blue-700",
  },
];

function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-accent">Insights & Resources</div>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">The ManageXOne Blog</h1>
          <p className="mt-4 text-muted-foreground">
            Practical guides on GST, payroll, compliance and growing your business in India.
          </p>
        </div>

        {/* Featured */}
        <Link
          to="/blog"
          className="mt-12 grid overflow-hidden rounded-2xl border bg-card shadow-elegant transition-all hover:shadow-lg md:grid-cols-2"
        >
          <div className={`relative bg-gradient-to-br ${featured.color} p-12 text-white`}>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
            <div className="relative">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">Featured</span>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight">{featured.title}</h2>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">{featured.tag}</div>
            <h3 className="mt-2 font-display text-2xl font-bold text-navy-deep">{featured.title}</h3>
            <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featured.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.read} read</span>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Read article <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/blog"
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className={`h-32 bg-gradient-to-br ${p.color}`} />
              <div className="flex flex-1 flex-col p-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">{p.tag}</div>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy-deep group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.read}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-hero p-10 text-center text-white">
          <h3 className="font-display text-2xl font-bold">Get the ManageXOne Services Brochure</h3>
          <p className="mt-2 text-white/80">Download a complete PDF with every module, feature and pricing plan.</p>
          <a
            href="/ManageXOne-Services.pdf"
            download
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy-deep shadow hover:opacity-90"
          >
            Download PDF Brochure
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
