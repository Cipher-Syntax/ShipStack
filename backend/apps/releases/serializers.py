from rest_framework import serializers
from .models import Release
from apps.listings.models import Listing

class ReleaseSerializer(serializers.ModelSerializer):
    listing_id = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all(), source='listing'
    )

    class Meta:
        model = Release
        fields = [
            'id', 'listing_id', 'package', 'version_number', 
            'changelog', 'is_published', 'created_at', 'published_at'
        ]
        read_only_fields = ['id', 'created_at', 'published_at']

    def validate(self, attrs):
        # Enforce ownership: request.user must be an author of the listing
        listing = attrs.get('listing')
        request = self.context.get('request')
        
        if listing and request:
            if not listing.authors.filter(id=request.user.id).exists():
                raise serializers.ValidationError({"listing_id": "You do not have permission to add a release to this listing."})
                
        # If package is provided, ensure it belongs to the same listing
        package = attrs.get('package')
        if package and package.listing != listing:
            raise serializers.ValidationError({"package": "This package belongs to a different listing."})
            
        return attrs

class PublicReleaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Release
        fields = ['id', 'version_number', 'changelog', 'published_at']
        read_only_fields = ['id', 'version_number', 'changelog', 'published_at']
