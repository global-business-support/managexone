import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/dashboard/documents")({
  component: () => (
    <ModulePage
      title="Documents"
      description="Centralised document vault — contracts, ID proofs, certificates."
      icon={<FileText className="h-5 w-5" />}
      premium
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Files</h3>
          <Button className="bg-gradient-hero text-white"><Upload className="mr-2 h-4 w-4" />Upload</Button>
        </div>
        <div className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No documents uploaded.
        </div>
      </Card>
    </ModulePage>
  ),
});
