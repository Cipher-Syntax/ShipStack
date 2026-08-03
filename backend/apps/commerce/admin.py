from django.contrib import admin
from .models import Order, Purchase

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'listing', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('buyer__username', 'listing__title', 'paymongo_session_id')

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'listing', 'purchase_price', 'purchased_at')
    list_filter = ('purchased_at',)
    search_fields = ('buyer__username', 'listing__title')
