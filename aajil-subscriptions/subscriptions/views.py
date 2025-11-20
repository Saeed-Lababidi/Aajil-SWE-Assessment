from datetime import timedelta

from django.utils import timezone
from django.db.models import Sum, F, Case, When, DecimalField
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    A ViewSet that provides CRUD operations for subscriptions.
    - GET /api/subscriptions/
    - POST /api/subscriptions/
    - GET /api/subscriptions/{id}/
    - PUT/PATCH /api/subscriptions/{id}/
    - DELETE /api/subscriptions/{id}/
    """
    
    # To match "Get all active subscriptions" user story
    queryset = Subscription.objects.filter(is_active=True)
    serializer_class = SubscriptionSerializer

    def perform_destroy(self, instance):
        """
        Instead of hard-deleting, mark the subscription as inactive.
        This satisfies the "cancel subscriptions" user story.
        """
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=["get"], url_path="stats") # detail=False means it’s on the collection, not a single item.
    def stats(self, request):
        """
        GET /api/subscriptions/stats/
        Returns cost analytics and upcoming renewals.
        """
        today = timezone.localdate()
        upcoming_limit = today + timedelta(days=7)

        qs = Subscription.objects.filter(is_active=True)

        # Total monthly cost: convert yearly to monthly by dividing by 12
        monthly_annotated = qs.annotate(
            monthly_cost=Case(
                When(billing_cycle="monthly", then=F("cost")),
                When(billing_cycle="yearly", then=F("cost") / 12),
                default=0,
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        )
        total_monthly = monthly_annotated.aggregate(total=Sum("monthly_cost"))["total"] or 0

        # Total yearly cost: convert monthly to yearly by multiplying by 12
        yearly_annotated = qs.annotate(
            yearly_cost=Case(
                When(billing_cycle="yearly", then=F("cost")),
                When(billing_cycle="monthly", then=F("cost") * 12),
                default=0,
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        )
        total_yearly = yearly_annotated.aggregate(total=Sum("yearly_cost"))["total"] or 0

        # Subscriptions renewing in the next 7 days
        upcoming = qs.filter(renewal_date__range=[today, upcoming_limit])
        upcoming_count = upcoming.count()

        upcoming_serialized = SubscriptionSerializer(upcoming, many=True).data

        # Count of active subscriptions
        active_count = qs.count()

        data = {
            "total_monthly_cost": total_monthly,
            "total_yearly_cost": total_yearly,
            "active_subscriptions_count": active_count,
            "upcoming_renewals_count": upcoming_count,
            "upcoming_renewals": upcoming_serialized,
        }

        return Response(data)
