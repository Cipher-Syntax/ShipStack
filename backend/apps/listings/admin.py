from django.contrib import admin
from .models import Listing

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'price', 'created_at')
    list_filter = ('status', 'category')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')
    autocomplete_fields = ('authors', 'category', 'technologies', 'tags')
