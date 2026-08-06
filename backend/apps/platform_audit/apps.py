from django.apps import AppConfig


class PlatformAuditConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.platform_audit'

    def ready(self):
        import apps.platform_audit.signals
