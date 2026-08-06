from rest_framework import serializers
from .models import DeveloperProfile
from apps.common.utils import optimize_image_url

class DeveloperProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DeveloperProfile
        fields = ['id', 'store_name', 'slug', 'logo', 'banner', 'biography', 'github_url', 'website_url', 'twitter_url', 'linkedin_url', 'username']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get('logo'):
            ret['logo'] = optimize_image_url(ret['logo'])
        if ret.get('banner'):
            ret['banner'] = optimize_image_url(ret['banner'])
        return ret
