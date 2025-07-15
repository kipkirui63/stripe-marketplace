from django.contrib import admin
from .models import UserProfile, Tool, Subscription, Payment


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'tool', 'plan', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'plan', 'start_date', 'end_date']
    search_fields = ['user__username', 'tool__name']
    
    def is_active(self, obj):
        return obj.is_active()
    is_active.boolean = True


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'subscription', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['user__username', 'subscription__tool__name']