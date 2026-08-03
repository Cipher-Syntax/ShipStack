from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicReviewListView, BuyerReviewViewSet

router = DefaultRouter()
router.register(r'my-reviews', BuyerReviewViewSet, basename='my-reviews')

urlpatterns = [
    path('listings/<int:listing_id>/reviews/', PublicReviewListView.as_view(), name='public-listing-reviews'),
    path('', include(router.urls)),
]
