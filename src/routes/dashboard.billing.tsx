import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, FileText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState("18");
  const sub = parseFloat(amount) || 0;
  const tax = (sub * (parseFloat(gst) || 0)) / 100;
  const total = sub + tax;

  return (
    <ModulePage
      title="Billing & GST"
      description="Create GST-compliant invoices and auto-fill tax amounts."
      icon={<Receipt className="h-5 w-5" />}
    >
      <Card className="p-6">
        <h3 className="font-display text-lg font-bold">Quick GST Invoice Calculator</h3>
        <p className="text-sm text-muted-foreground">Enter party amount — GST and total fill automatically.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Taxable Amount (₹)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" />
          </div>
          <div className="space-y-2">
            <Label>GST %</Label>
            <Input type="number" value={gst} onChange={(e) => setGst(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Total Payable</Label>
            <Input value={`₹${total.toFixed(2)}`} readOnly className="font-semibold" />
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md bg-muted px-3 py-2">Subtotal: <b>₹{sub.toFixed(2)}</b></div>
          <div className="rounded-md bg-muted px-3 py-2">GST: <b>₹{tax.toFixed(2)}</b></div>
          <div className="rounded-md bg-gradient-gold px-3 py-2 text-gold-foreground">Total: <b>₹{total.toFixed(2)}</b></div>
        </div>
        <Button className="mt-5 bg-gradient-hero text-white"><FileText className="mr-2 h-4 w-4" />Generate Invoice</Button>
      </Card>
    </ModulePage>
  );
}
