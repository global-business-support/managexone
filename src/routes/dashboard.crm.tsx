import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/crm")({
  component: () => (
    <ModulePage
      title="Multi-Company CRM"
      description="Manage multiple companies, leads, and customer pipelines in one place."
      icon={<FolderKanban className="h-5 w-5" />}
      premium
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Companies</h3>
          <Button className="bg-gradient-hero text-white"><Plus className="mr-2 h-4 w-4" />Add Company</Button>
        </div>
        <div className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No companies yet. Add a company to begin managing leads, contacts and deals.
        </div>
      </Card>
    </ModulePage>
  ),
});
