from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from apps.accounts.models import CustomUser, VerificationApplication
from apps.listings.models import Listing
from .serializers import AdminUserSerializer, AdminVerificationSerializer, AdminListingSerializer
from .services import ban_user, unban_user, change_user_role, approve_listing, reject_listing, approve_verification, reject_verification, get_dashboard_metrics

from rest_framework.pagination import PageNumberPagination

class AdminPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = AdminPagination
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    search_fields = ['username', 'email']
    filterset_fields = ['is_active', 'is_staff', 'is_verified_developer']

    @action(detail=True, methods=['post'])
    def ban(self, request, pk=None):
        user = ban_user(pk)
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def unban(self, request, pk=None):
        user = unban_user(pk)
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def role(self, request, pk=None):
        is_staff = request.data.get('is_staff', False)
        is_superuser = request.data.get('is_superuser', False)
        user = change_user_role(pk, is_staff, is_superuser)
        return Response(AdminUserSerializer(user).data)

class AdminVerificationViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = AdminPagination
    queryset = VerificationApplication.objects.all().select_related('user').order_by('-created_at')
    serializer_class = AdminVerificationSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        app = approve_verification(pk)
        return Response(AdminVerificationSerializer(app).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        app = reject_verification(pk)
        return Response(AdminVerificationSerializer(app).data)

class AdminListingViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = AdminPagination
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = AdminListingSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status']
    search_fields = ['title', 'slug']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        listing = approve_listing(pk)
        return Response(AdminListingSerializer(listing).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        reason = request.data.get('reason', '')
        listing = reject_listing(pk, reason)
        return Response(AdminListingSerializer(listing).data)

from rest_framework.views import APIView

class AdminReportsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        metrics = get_dashboard_metrics()
        return Response({
            'success': True,
            'message': 'Metrics retrieved successfully.',
            'data': metrics
        })
