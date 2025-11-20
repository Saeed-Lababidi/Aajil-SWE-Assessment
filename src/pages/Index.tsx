import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "@/lib/api";
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { SubscriptionForm } from "@/components/dashboard/SubscriptionForm";
import { CostBreakdownChart } from "@/components/dashboard/CostBreakdownChart";
import { SavingsCalculator } from "@/components/dashboard/SavingsCalculator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Plus,
  Loader2,
} from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  // Fetch subscriptions
  const { data: subscriptions = [], isLoading: subsLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: subscriptionApi.getAll,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: subscriptionApi.getStats,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: subscriptionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<SubscriptionFormData>;
    }) => subscriptionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsDialogOpen(false);
      setEditingSubscription(null);
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: subscriptionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: SubscriptionFormData) => {
    if (editingSubscription) {
      updateMutation.mutate({ id: editingSubscription.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingSubscription(null);
    setIsDialogOpen(true);
  };

  const upcomingRenewals = subscriptions.filter((sub) => {
    if (!sub.is_active) return false;
    const daysUntil = differenceInDays(parseISO(sub.renewal_date), new Date());
    return daysUntil >= 0 && daysUntil <= 7;
  });

  if (subsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Subscription Manager</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your recurring expenses
              </p>
            </div>
            <Button onClick={handleAddNew} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Cost"
            value={`$${stats?.total_monthly_cost.toFixed(2) || "0.00"}`}
            subtitle="Total monthly expenses"
            icon={DollarSign}
            variant="default"
          />
          <StatsCard
            title="Yearly Projection"
            value={`$${stats?.total_yearly_cost.toFixed(2) || "0.00"}`}
            subtitle="Projected annual cost"
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Active Subscriptions"
            value={`${stats?.active_subscriptions_count || 0}`}
            subtitle="Currently active"
            icon={CreditCard}
            variant="default"
          />
          <StatsCard
            title="Upcoming Renewals"
            value={`${upcomingRenewals.length}`}
            subtitle="Next 7 days"
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Charts and Savings */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CostBreakdownChart subscriptions={subscriptions} />
          <SavingsCalculator subscriptions={subscriptions} />
        </div>

        {/* Subscriptions List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Subscriptions</h2>
            <p className="text-sm text-muted-foreground">
              {stats?.active_subscriptions_count || subscriptions.length} active
            </p>
          </div>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No subscriptions yet</p>
              <Button onClick={handleAddNew} variant="outline">
                Add your first subscription
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions
                .filter((sub) => sub.is_active)
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubscription
                ? "Edit Subscription"
                : "Add New Subscription"}
            </DialogTitle>
          </DialogHeader>
          <SubscriptionForm
            defaultValues={editingSubscription || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingSubscription(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
