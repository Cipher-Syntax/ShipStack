from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source='actor.email', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'actor', 'actor_email', 'action', 'target_model', 'target_id', 'timestamp', 'ip_address', 'details']
