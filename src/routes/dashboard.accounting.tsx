import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, BookOpen, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/accounting")({
  component: () => (
    <ModulePage
      title="Accounting"
      description="Double-entry bookkeeping with journals, ledgers, and trial balance."
      icon={<Calculator className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><ArrowDownLeft className="h-4 w-4 text-emerald-600" /><div className="mt-2 text-2xl font-bold text-navy-deep">₹0</div><div className="text-sm text-muted-foreground">Receivables</div></Card>
        <Card className="p-5"><ArrowUpRight className="h-4 w-4 text-rose-600" /><div className="mt-2 text-2xl font-bold text-navy-deep">₹0</div><div className="text-sm text-muted-foreground">Payables</div></Card>
        <Card className="p-5"><BookOpen className="h-4 w-4 text-muted-foreground" /><div className="mt-2 text-2xl font-bold text-navy-deep">0</div><div className="text-sm text-muted-foreground">Journal entries</div></Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Journal entries</h3>
          <Button className="bg-gradient-hero text-white">New Entry</Button>
        </div>
        <div className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No journal entries yet.
        </div>
      </Card>
    </ModulePage>
  ),
});
