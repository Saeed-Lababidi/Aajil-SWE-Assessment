import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types/subscription";
import { TrendingUp, ArrowRight } from "lucide-react";

interface SavingsCalculatorProps {
  subscriptions: Subscription[];
}

export function SavingsCalculator({ subscriptions }: SavingsCalculatorProps) {
  const monthlySubs = subscriptions.filter(
    (sub) => sub.is_active && sub.billing_cycle === "monthly"
  );

  const savingsOpportunities = monthlySubs
    .map((sub) => {
      const cost = Number(sub.cost);
      const currentYearlyCost = cost * 12;
      const typicalYearlyCost = cost * 12 * 0.8; // Assume 20% yearly discount
      const potentialSavings = currentYearlyCost - typicalYearlyCost;

      return {
        name: sub.name,
        currentMonthlyCost: cost,
        potentialSavings,
      };
    })
    .filter((opp) => opp.potentialSavings > 0);

  if (savingsOpportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Savings Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You're already optimized! No monthly subscriptions to convert.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPotentialSavings = savingsOpportunities.reduce(
    (sum, opp) => sum + opp.potentialSavings,
    0
  );

  return (
    <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          Savings Opportunities
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Switch to yearly billing and save up to{" "}
          <span className="font-semibold text-success">
            ${totalPotentialSavings.toFixed(2)}/year
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {savingsOpportunities.slice(0, 3).map((opp, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-card border"
          >
            <div className="flex-1">
              <p className="font-medium">{opp.name}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>${opp.currentMonthlyCost.toFixed(2)}/mo</span>
                <ArrowRight className="h-3 w-3" />
                <span>
                  ${(opp.currentMonthlyCost * 12 * 0.8).toFixed(2)}/yr
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-success text-success">
              Save ${opp.potentialSavings.toFixed(2)}
            </Badge>
          </div>
        ))}
        {savingsOpportunities.length > 3 && (
          <p className="text-xs text-center text-muted-foreground">
            +{savingsOpportunities.length - 3} more opportunities
          </p>
        )}
      </CardContent>
    </Card>
  );
}
