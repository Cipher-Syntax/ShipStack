from rest_framework import serializers
from .models import DeveloperProfile

class DeveloperProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeveloperProfile
        fields = ['id', 'store_name', 'slug', 'logo', 'banner', 'biography', 'github_url', 'website_url', 'twitter_url', 'linkedin_url']
