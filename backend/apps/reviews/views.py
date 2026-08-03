from rest_framework import viewsets, generics, permissions, status
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.listings.models import Listing
from apps.commerce.models import Purchase

class PublicReviewListView(generics.ListAPIView):
    """Read-only view to fetch paginated reviews for a listing."""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        listing_id = self.kwargs.get('listing_id')
        queryset = Review.objects.filter(listing_id=listing_id)
        
        rating = self.request.query_params.get('rating')
        if rating:
            queryset = queryset.filter(rating=rating)
            
        sort = self.request.query_params.get('sort', '-created_at')
        if sort == 'highest':
            queryset = queryset.order_by('-rating', '-created_at')
        elif sort == 'lowest':
            queryset = queryset.order_by('rating', '-created_at')
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset

class BuyerReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for authenticated buyers to manage their own reviews."""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        listing_id = self.request.data.get('listing')
        if not listing_id:
            raise ValidationError({"listing": "Listing ID is required."})

        # Ensure the user has a completed purchase for this listing
        if not Purchase.objects.filter(buyer=self.request.user, listing_id=listing_id).exists():
            raise ValidationError({"non_field_errors": "You must purchase this software before reviewing it."})

        # Ensure they haven't already reviewed it
        if Review.objects.filter(user=self.request.user, listing_id=listing_id).exists():
            raise ValidationError({"non_field_errors": "You have already reviewed this listing."})

        serializer.save(user=self.request.user)
