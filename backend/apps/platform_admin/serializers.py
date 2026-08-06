from rest_framework import serializers
from apps.accounts.models import CustomUser, VerificationApplication
from apps.listings.models import Listing

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser', 'is_verified_developer', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class AdminVerificationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = VerificationApplication
        fields = ['id', 'user', 'username', 'email', 'github_url', 'portfolio_url', 'statement', 'status', 'created_at']

class AdminListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'title', 'slug', 'status', 'price', 'created_at']
