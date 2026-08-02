from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Listing
from .serializers import ListingSerializer

class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(authors=self.request.user)

    def perform_create(self, serializer):
        listing = serializer.save()
        listing.authors.add(self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        listing = self.get_object()
        
        if listing.status != Listing.StatusChoices.DRAFT:
            return Response({"detail": "Only drafts can be submitted."}, status=status.HTTP_400_BAD_REQUEST)
            
        errors = {}
        
        if not listing.title or len(listing.title) < 5:
            errors['title'] = "Title must be at least 5 characters."
            
        if not listing.short_description or len(listing.short_description) < 10:
            errors['short_description'] = "Short description must be at least 10 characters."
            
        if not listing.full_description or len(listing.full_description) < 100:
            errors['full_description'] = "Full description must be at least 100 characters."
            
        if listing.price is None or listing.price <= 0:
            errors['price'] = "Price must be strictly greater than 0."
            
        if not listing.category:
            errors['category'] = "Category must be selected."
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
        listing.status = Listing.StatusChoices.PENDING_REVIEW
        listing.save()
        return Response({"detail": "Listing submitted for review.", "status": listing.status})
