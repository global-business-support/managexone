import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileDown } from "lucide-react";

export const Route = createFileRoute("/dashboard/compliance")({
  component: () => (
    <ModulePage
      title="EPFO / ESIC / TDS Compliance"
      description="Generate ready-to-upload files for EPFO ECR, ESIC Excel, and TDS returns from your payroll data."
      icon={<ShieldCheck className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "EPFO ECR File", desc: "Ready-to-upload text file for EPFO portal", btn: "Generate ECR" },
          { title: "ESIC Excel", desc: "Salary-based ESIC contribution sheet", btn: "Export ESIC Excel" },
          { title: "TDS Return", desc: "TDS calculation & Form 24Q/26Q export", btn: "Generate TDS" },
        ].map((c) => (
          <Card key={c.title} className="p-6">
            <h3 className="font-display text-lg font-bold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <Button className="mt-4 w-full bg-gradient-hero text-white"><FileDown className="mr-2 h-4 w-4" />{c.btn}</Button>
          </Card>
        ))}
      </div>
    </ModulePage>
  ),
});
