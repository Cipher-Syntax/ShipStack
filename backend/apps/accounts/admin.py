from django.contrib import admin
from .models import CustomUser, VerificationApplication

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_active', 'is_verified_developer')
    list_filter = ('is_active', 'is_verified_developer')
    search_fields = ('email', 'username')

@admin.register(VerificationApplication)
class VerificationApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__username')
    actions = ['approve_applications', 'reject_applications']

    def approve_applications(self, request, queryset):
        for application in queryset:
            application.status = 'APPROVED'
            application.save()
            application.user.is_verified_developer = True
            application.user.save()
        self.message_user(request, "Selected applications approved.")
    approve_applications.short_description = "Approve selected applications"

    def reject_applications(self, request, queryset):
        for application in queryset:
            application.status = 'REJECTED'
            application.save()
            application.user.is_verified_developer = False
            application.user.save()
        self.message_user(request, "Selected applications rejected.")
    reject_applications.short_description = "Reject selected applications"
