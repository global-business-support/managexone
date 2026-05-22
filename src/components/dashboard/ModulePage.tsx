import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Lock, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
  /** If true, this module is premium-only (requires approved member or admin). */
  premium?: boolean;
}

export function ModulePage({ title, description, icon, children, premium }: Props) {
  const { isAdmin, isApproved, role, trialExpired, profile } = useAuth();
  const locked = premium && !isAdmin && !isApproved;
  const expired = trialExpired && !isAdmin;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 border-b pb-5">
        <div className="flex items-start gap-3">
          {icon && <div className="rounded-lg bg-gradient-hero p-2.5 text-white">{icon}</div>}
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-deep">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {role === "trial" && profile && (
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5" /> Trial
            </div>
            <div className="text-muted-foreground">
              Expires {new Date(profile.trial_expires_at).toLocaleString()}
            </div>
          </div>
        )}
      </header>

      {expired ? (
        <Card className="p-8 text-center">
          <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="font-display text-xl font-bold">Your trial has ended</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade to continue using ManageXOne with full features.
          </p>
          <Link to="/" className="mt-4 inline-block">
            <Button className="bg-gradient-gold text-gold-foreground">View Plans</Button>
          </Link>
        </Card>
      ) : locked ? (
        <Card className="relative overflow-hidden p-8 text-center">
          <Lock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="font-display text-xl font-bold">Awaiting admin approval</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Trial accounts get limited access. An administrator must approve your account to unlock this module.
          </p>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
