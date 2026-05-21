import { FileCheck2, Database, FileSpreadsheet, Receipt } from "lucide-react";

const items = [
  { icon: FileCheck2, title: "EPFO File Ready", desc: "Salary-based ECR file auto-generated. Upload directly to the EPFO portal — no manual entry." },
  { icon: FileSpreadsheet, title: "ESIC Excel Auto", desc: "Monthly ESIC contribution Excel generated automatically on a salary basis with notes." },
  { icon: Receipt, title: "GST Direct Fill", desc: "Party GST amount auto-fills into invoices the moment it's entered — saved as a compliant entry." },
  { icon: Database, title: "TDS & Documentation", desc: "Section-wise TDS, challan tracking and a complete audit-ready documentation vault." },
];

export function Compliance() {
  return (
    <section id="features" className="bg-muted/40 py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent">Advanced Compliance Engine</div>
            <h2 className="mt-3 font-display text-4xl font-bold text-navy-deep md:text-5xl">
              EPFO • ESIC • TDS • GST<br />
              <span className="text-gradient-gold">All Automated.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Every task a qualified accountant performs manually — ManageXOne automates for you. Files generated, returns ready, compliance in one click.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-elegant">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold text-gold-foreground shadow-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-navy-deep">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
