from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, PublicListingListView

router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = [
    path('public/', PublicListingListView.as_view(), name='public-listings'),
    path('', include(router.urls)),
]
