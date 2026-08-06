import json
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from .models import AuditLog, AuditActionChoices
from .middleware import get_current_request

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_tracked_models():
    tracked = []
    app_names = ['accounts', 'developers', 'marketplace', 'listings', 'purchases', 'licenses', 'releases', 'software_requests', 'reviews', 'messaging', 'notifications']
    for app_name in app_names:
        try:
            app_config = apps.get_app_config(app_name)
            tracked.extend(app_config.get_models())
        except LookupError:
            pass
    return tracked

def serialize_model(instance):
    try:
        data = model_to_dict(instance)
        # Convert non-serializable fields (like UUIDs, Datetime) to strings
        return json.loads(json.dumps(data, cls=DjangoJSONEncoder))
    except Exception:
        return {}

def log_audit(instance, action):
    request = get_current_request()
    
    actor = None
    ip_address = None
    if request:
        if hasattr(request, 'user') and request.user.is_authenticated:
            actor = request.user
        ip_address = get_client_ip(request)

    details = serialize_model(instance)
    
    target_model = instance._meta.object_name
    target_id = str(instance.pk)

    AuditLog.objects.create(
        actor=actor,
        action=action,
        target_model=target_model,
        target_id=target_id,
        ip_address=ip_address,
        details=details
    )

@receiver(post_save)
def audit_post_save(sender, instance, created, **kwargs):
    if sender in get_tracked_models():
        action = AuditActionChoices.CREATE if created else AuditActionChoices.UPDATE
        log_audit(instance, action)

@receiver(post_delete)
def audit_post_delete(sender, instance, **kwargs):
    if sender in get_tracked_models():
        log_audit(instance, AuditActionChoices.DELETE)
