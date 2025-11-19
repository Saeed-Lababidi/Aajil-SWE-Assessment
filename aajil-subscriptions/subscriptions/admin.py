from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'billing_cycle', 'start_date', 'renewal_date', 'is_active', 'category')
    list_filter = ('billing_cycle', 'is_active', 'category')
    search_fields = ('name', 'category')
