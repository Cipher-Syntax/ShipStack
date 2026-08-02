from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Listing, ListingMedia, SoftwarePackage
from .serializers import ListingSerializer, ListingMediaSerializer, SoftwarePackageSerializer, PublicListingSerializer
from .tasks import scan_package_for_malware
from rest_framework.parsers import MultiPartParser, FormParser

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import ListingFilter

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class PublicListingListView(generics.ListAPIView):
    serializer_class = PublicListingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ListingFilter
    search_fields = ['title', 'short_description', 'full_description']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Listing.objects.filter(status=Listing.StatusChoices.PUBLISHED)
        author_slug = self.request.query_params.get('author')
        if author_slug:
            queryset = queryset.filter(authors__developer_profile__slug=author_slug)
        return queryset

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

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def media(self, request, pk=None):
        listing = self.get_object()
        
        media_type = request.data.get('media_type')
        if media_type == 'COVER':
            ListingMedia.objects.filter(listing=listing, media_type='COVER').delete()

        serializer = ListingMediaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(listing=listing)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def packages(self, request, pk=None):
        listing = self.get_object()
        serializer = SoftwarePackageSerializer(data=request.data)
        if serializer.is_valid():
            package = serializer.save(listing=listing)
            
            # Trigger background scan
            scan_package_for_malware.delay(package.id)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
