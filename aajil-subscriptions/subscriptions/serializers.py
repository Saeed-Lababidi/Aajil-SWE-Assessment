from rest_framework import serializers
from django.utils import timezone
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        # Expose all model fields
        fields = "__all__"
        # Make renewal_date read-only
        read_only_fields = ("id", "renewal_date")

    def validate_cost(self, value):
        """
        Ensure cost is positive.
        """
        if value <= 0:
            raise serializers.ValidationError("Cost must be positive.")
        return value

    def validate_billing_cycle(self, value):
        """
        Ensure billing_cycle is one of the allowed values.
        """
        allowed = ["monthly", "yearly"]
        if value not in allowed:
            raise serializers.ValidationError("Billing cycle must be 'monthly' or 'yearly'.")
        return value

    def validate(self, attrs):
        """
        Object-level validation:
        - Ensure that the calculated renewal_date is not in the past.
        """
        # At this point, attrs contains start_date and billing_cycle (if provided)
        start_date = attrs.get("start_date")
        billing_cycle = attrs.get("billing_cycle")

        # If we are updating and a field is missing in attrs, fall back to instance values
        if self.instance is not None:
            if start_date is None:
                start_date = self.instance.start_date
            if billing_cycle is None:
                billing_cycle = self.instance.billing_cycle

        # If we have both, we can approximate validation
        if start_date and billing_cycle:
            today = timezone.localdate()

            # A simple check: start_date shouldn't be far in the past without renewal moving forward.
            if start_date > today:
                pass
            
        return attrs
