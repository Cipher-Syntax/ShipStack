from rest_framework import serializers
from .models import DeveloperProfile

class DeveloperProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DeveloperProfile
        fields = ['id', 'store_name', 'slug', 'logo', 'banner', 'biography', 'github_url', 'website_url', 'twitter_url', 'linkedin_url', 'username']
