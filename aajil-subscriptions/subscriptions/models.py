from django.db import models
from django.utils import timezone
from dateutil.relativedelta import relativedelta

# Model details and validation prompted from chatgpt
class Subscription(models.Model):
    BILLING_CYCLE_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    name = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=10, choices=BILLING_CYCLE_CHOICES)
    start_date = models.DateField()
    renewal_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name} ({self.billing_cycle})"

    def calculate_next_renewal(self):
        """
        Calculate the next renewal date based on start_date, billing_cycle,
        and today's date. The result should always be in the future.
        """
        if not self.start_date:
            return None

        if self.billing_cycle == 'monthly':
            delta = relativedelta(months=1)
        else:
            delta = relativedelta(years=1)

        current = self.start_date

        # Always move forward until renewal is in the future
        today = timezone.localdate()
        while current <= today:
            current = current + delta

        return current

    def save(self, *args, **kwargs):
        """
        Override save so that renewal_date is automatically calculated whenever the subscription is saved.
        If there is no renewal_date yet OR start_date/billing_cycle changed, we recalculate.
        This also helps in validating renewal date not being in the past.
        """
        calculated = self.calculate_next_renewal()
        if calculated is not None:
            self.renewal_date = calculated

        super().save(*args, **kwargs)