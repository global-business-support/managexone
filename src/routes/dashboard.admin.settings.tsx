import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard/admin/settings")({
  component: () => {
    const { isAdmin } = useAuth();
    if (!isAdmin) return null;
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-3 border-b pb-5">
          <div className="rounded-lg bg-gradient-hero p-2.5 text-white">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-deep">System Settings</h1>
            <p className="text-sm text-muted-foreground">Configure tax rates, branding, notifications and integrations.</p>
          </div>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Tax & GST", desc: "Default GST rates, HSN/SAC codes, tax slabs" },
            { title: "Branding", desc: "Company logo, invoice templates, colours" },
            { title: "Integrations", desc: "PhonePe payments, email/SMS, WhatsApp" },
            { title: "Backup & Export", desc: "Periodic backups and data exports" },
          ].map((c) => (
            <Card key={c.title} className="p-5">
              <h3 className="font-display text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  },
});
