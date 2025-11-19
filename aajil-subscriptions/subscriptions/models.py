from django.db import models

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
    renewal_date = models.DateField()
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name} ({self.billing_cycle})"