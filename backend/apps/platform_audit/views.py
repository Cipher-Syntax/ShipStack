from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import AuditLog
from .serializers import AuditLogSerializer

from apps.common.pagination import AdminPagination

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = AdminPagination
    queryset = AuditLog.objects.all().select_related('actor')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['action', 'target_model']
    search_fields = ['target_id', 'actor__email']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
