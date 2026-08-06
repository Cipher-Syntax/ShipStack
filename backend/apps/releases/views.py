from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Release
from .serializers import ReleaseSerializer

class DeveloperReleaseViewSet(viewsets.ModelViewSet):
    serializer_class = ReleaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return releases for listings the user authors
        return Release.objects.filter(listing__authors=self.request.user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        release = self.get_object()
        
        if not release.package:
            return Response(
                {"error": "Cannot publish a release without an attached SoftwarePackage."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if release.package.scan_status != 'PASSED':
            return Response(
                {"error": "Cannot publish a release. The attached package must pass malware scanning first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not release.is_published:
            release.is_published = True
            release.published_at = timezone.now()
            release.save()

            from apps.commerce.models import Purchase
            from apps.notifications.services import create_notification
            buyers = [p.buyer for p in Purchase.objects.filter(listing=release.listing)]
            for buyer in set(buyers):
                create_notification(
                    user=buyer,
                    title='New Update Available',
                    message=f"A new version ({release.version}) of {release.listing.title} is now available.",
                    notification_type='UPDATE',
                    link=f"/marketplace/{release.listing.slug}"
                )

        serializer = self.get_serializer(release)
        return Response(serializer.data)
