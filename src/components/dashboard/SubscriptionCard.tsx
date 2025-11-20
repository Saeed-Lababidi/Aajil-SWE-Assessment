import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types/subscription";
import { Pencil, Trash2, Calendar, DollarSign } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: number) => void;
}

export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const renewalDate = parseISO(subscription.renewal_date);
  const daysUntilRenewal = differenceInDays(renewalDate, new Date());
  const isUpcomingRenewal = daysUntilRenewal >= 0 && daysUntilRenewal <= 7;

  const cost = Number(subscription.cost);
  const monthlyCost =
    subscription.billing_cycle === "monthly" ? cost : cost / 12;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isUpcomingRenewal && "border-warning border-2 bg-warning/5"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{subscription.name}</h3>
              {isUpcomingRenewal && (
                <Badge
                  variant="outline"
                  className="border-warning text-warning"
                >
                  Renewing Soon
                </Badge>
              )}
            </div>
            {subscription.category && (
              <Badge variant="secondary" className="mt-1">
                {subscription.category}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(subscription)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(subscription.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Cost</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">
              ${cost.toFixed(2)}/
              {subscription.billing_cycle === "monthly" ? "mo" : "yr"}
            </div>
            {subscription.billing_cycle === "yearly" && (
              <div className="text-xs text-muted-foreground">
                ${monthlyCost.toFixed(2)}/mo
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next Renewal</span>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {format(renewalDate, "MMM d, yyyy")}
            </div>
            <div
              className={cn(
                "text-xs",
                isUpcomingRenewal
                  ? "text-warning font-medium"
                  : "text-muted-foreground"
              )}
            >
              {daysUntilRenewal === 0
                ? "Today"
                : daysUntilRenewal === 1
                ? "Tomorrow"
                : daysUntilRenewal > 0
                ? `In ${daysUntilRenewal} days`
                : "Past due"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
