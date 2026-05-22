import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileDown } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({
  component: () => (
    <ModulePage
      title="Reports — P&L / Balance Sheet"
      description="Automated financial statements straight from your books."
      icon={<BarChart3 className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Profit & Loss", desc: "Revenue, expenses, net profit — period-wise" },
          { title: "Balance Sheet", desc: "Assets, liabilities & equity snapshot" },
          { title: "Trial Balance", desc: "All ledger balances at a glance" },
          { title: "Cash Flow", desc: "Operating, investing, financing flows" },
        ].map((r) => (
          <Card key={r.title} className="p-6">
            <h3 className="font-display text-lg font-bold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <Button className="mt-4 bg-gradient-hero text-white"><FileDown className="mr-2 h-4 w-4" />Download PDF</Button>
          </Card>
        ))}
      </div>
    </ModulePage>
  ),
});
