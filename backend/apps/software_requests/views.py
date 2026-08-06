from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import SoftwareRequest, RequestProposal
from .serializers import SoftwareRequestSerializer, RequestProposalSerializer
from .services import accept_proposal

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.buyer == request.user

class IsVerifiedDeveloper(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'is_verified_developer', False))

class SoftwareRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SoftwareRequestSerializer

    def get_queryset(self):
        if self.action == 'me':
            return SoftwareRequest.objects.filter(buyer=self.request.user)
        # Public list only shows OPEN requests
        if self.action == 'list':
            return SoftwareRequest.objects.filter(status=SoftwareRequest.StatusChoices.OPEN)
        return SoftwareRequest.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'me']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        # list, retrieve
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
        
    def perform_destroy(self, instance):
        if instance.status != SoftwareRequest.StatusChoices.OPEN:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Only open requests can be deleted/cancelled.")
        instance.status = SoftwareRequest.StatusChoices.CANCELLED
        instance.save(update_fields=['status', 'updated_at'])

    @action(detail=False, methods=['get'])
    def me(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RequestProposalViewSet(viewsets.ModelViewSet):
    serializer_class = RequestProposalSerializer

    def get_queryset(self):
        # We only ever access proposals in the context of a request, except for accept.
        return RequestProposal.objects.all()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsVerifiedDeveloper()]
        elif self.action == 'accept':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        request_id = self.kwargs.get('request_id')
        software_request = get_object_or_404(SoftwareRequest, id=request_id)
        
        if software_request.buyer != request.user:
            return Response({"detail": "Only the request owner can view proposals."}, status=status.HTTP_403_FORBIDDEN)
            
        queryset = RequestProposal.objects.filter(request=software_request)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        request_id = self.kwargs.get('request_id')
        software_request = get_object_or_404(SoftwareRequest, id=request_id)
        
        if software_request.status != SoftwareRequest.StatusChoices.OPEN:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Can only submit proposals to open requests.")
            
        if RequestProposal.objects.filter(request=software_request, developer=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You have already submitted a proposal for this request.")
            
        serializer.save(developer=self.request.user, request=software_request)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None, **kwargs):
        proposal = self.get_object()
        try:
            accept_proposal(proposal, request.user)
            return Response({"detail": "Proposal accepted successfully."}, status=status.HTTP_200_OK)
        except DjangoValidationError as e:
            return Response({"detail": str(e.message)}, status=status.HTTP_400_BAD_REQUEST)
