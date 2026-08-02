from django.contrib import admin
from .models import Listing

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'price', 'created_at')
    list_filter = ('status', 'category')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')
    autocomplete_fields = ('authors', 'category', 'technologies', 'tags')

from .models import ListingMedia, SoftwarePackage

@admin.register(ListingMedia)
class ListingMediaAdmin(admin.ModelAdmin):
    list_display = ('listing', 'media_type', 'order', 'created_at')
    list_filter = ('media_type',)

@admin.register(SoftwarePackage)
class SoftwarePackageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'scan_status', 'uploaded_at')
    list_filter = ('scan_status',)
