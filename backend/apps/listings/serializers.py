from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description', 
            'price', 'status', 'authors', 'category', 'technologies', 'tags',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'authors', 'created_at', 'updated_at']
