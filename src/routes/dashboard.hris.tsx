import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Calendar, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/dashboard/hris")({
  component: () => (
    <ModulePage
      title="HRIS & Payroll"
      description="Manage employees, attendance, salary structures and run payroll."
      icon={<Users className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Employees", value: "0", icon: Users },
          { label: "Present today", value: "0", icon: Calendar },
          { label: "Monthly payout", value: "₹0", icon: IndianRupee },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div className="mt-2 text-2xl font-bold text-navy-deep">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Employees</h3>
            <p className="text-sm text-muted-foreground">Add staff, define salary structures, mark attendance.</p>
          </div>
          <Button className="bg-gradient-hero text-white"><UserPlus className="mr-2 h-4 w-4" />Add Employee</Button>
        </div>
        <div className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No employees yet. Add your first employee to get started.
        </div>
      </Card>
    </ModulePage>
  ),
});
