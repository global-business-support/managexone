import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Hotel, Dumbbell, Stethoscope, Building2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/industries")({
  component: () => (
    <ModulePage
      title="Industry Workflows"
      description="Pre-built workflows for Hotels, Gyms, Hospitals and Companies."
      icon={<Building2 className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Hotels", desc: "Bookings, room billing, F&B, housekeeping", icon: Hotel },
          { title: "Gyms", desc: "Memberships, plans, trainer schedules, renewals", icon: Dumbbell },
          { title: "Hospitals", desc: "OPD, IPD, pharmacy, doctor schedules, billing", icon: Stethoscope },
          { title: "Companies", desc: "Standard HR + Accounting + Sales workflow", icon: Building2 },
        ].map((m) => (
          <Card key={m.title} className="p-5">
            <m.icon className="h-6 w-6 text-navy" />
            <h3 className="mt-3 font-display text-lg font-bold">{m.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
          </Card>
        ))}
      </div>
    </ModulePage>
  ),
});
