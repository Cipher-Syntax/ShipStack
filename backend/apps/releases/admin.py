from django.contrib import admin
from .models import Release

@admin.register(Release)
class ReleaseAdmin(admin.ModelAdmin):
    list_display = ('listing', 'version_number', 'is_published', 'published_at', 'created_at')
    list_filter = ('is_published', 'published_at')
    search_fields = ('listing__title', 'version_number')
