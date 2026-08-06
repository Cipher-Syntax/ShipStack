from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SoftwareRequestViewSet, RequestProposalViewSet

router = DefaultRouter()
router.register(r'', SoftwareRequestViewSet, basename='software-request')

urlpatterns = [
    # Accept endpoint for proposal
    path('proposals/<int:pk>/accept/', RequestProposalViewSet.as_view({'post': 'accept'}), name='proposal-accept'),
    
    # List and Create proposals for a specific request
    path('<int:request_id>/proposals/', RequestProposalViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='request-proposals'),
    
    path('', include(router.urls)),
]
