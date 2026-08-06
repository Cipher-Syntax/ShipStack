from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminVerificationViewSet, AdminListingViewSet, AdminReportsView

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'verifications', AdminVerificationViewSet, basename='admin-verifications')
router.register(r'listings', AdminListingViewSet, basename='admin-listings')

urlpatterns = [
    path('reports/', AdminReportsView.as_view(), name='admin-reports'),
    path('', include(router.urls)),
]
