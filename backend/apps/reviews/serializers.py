from rest_framework import serializers
from .models import Review
from apps.listings.models import Listing

class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'listing', 'user', 'user_username', 'user_avatar',
            'rating', 'title', 'body', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_username', 'user_avatar', 'created_at', 'updated_at']

    def get_user_avatar(self, obj):
        # We can extract the profile avatar if it exists
        if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.profile.avatar.url)
            return obj.user.profile.avatar.url
        return None
