from rest_framework import serializers
from .models import Listing, ListingMedia, SoftwarePackage

class ListingMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingMedia
        fields = ['id', 'file', 'media_type', 'order', 'created_at']
        read_only_fields = ['created_at']

class SoftwarePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwarePackage
        fields = ['id', 'file', 'scan_status', 'scan_results', 'uploaded_at']
        read_only_fields = ['scan_status', 'scan_results', 'uploaded_at']

class ListingSerializer(serializers.ModelSerializer):
    media = ListingMediaSerializer(many=True, read_only=True)
    packages = SoftwarePackageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description', 
            'price', 'status', 'authors', 'category', 'technologies', 'tags',
            'media', 'packages', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'authors', 'created_at', 'updated_at']


