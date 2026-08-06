from rest_framework import serializers
from .models import Listing, ListingMedia, SoftwarePackage
from apps.common.utils import optimize_image_url

class ListingMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingMedia
        fields = ['id', 'file', 'media_type', 'order', 'created_at']
        read_only_fields = ['created_at']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get('file'):
            ret['file'] = optimize_image_url(ret['file'])
        return ret

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

from django.contrib.auth import get_user_model
from apps.marketplace.serializers import CategorySerializer

class PublicAuthorSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='developer_profile.store_name', read_only=True)
    store_slug = serializers.CharField(source='developer_profile.slug', read_only=True)
    logo = serializers.ImageField(source='developer_profile.logo', read_only=True)
    
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'store_name', 'store_slug', 'logo']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get('logo'):
            ret['logo'] = optimize_image_url(ret['logo'])
        return ret

class PublicListingSerializer(serializers.ModelSerializer):
    authors = PublicAuthorSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()

    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'short_description', 
            'price', 'category', 'authors', 'cover_image_url',
            'average_rating', 'total_reviews'
        ]

    def get_cover_image_url(self, obj):
        cover = obj.media.filter(media_type=ListingMedia.MediaTypeChoices.COVER).first()
        if cover and cover.file:
            request = self.context.get('request')
            url = cover.file.url
            if request:
                url = request.build_absolute_uri(url)
            return optimize_image_url(url)
        return None

from apps.marketplace.serializers import TechnologySerializer, TagSerializer

from apps.commerce.models import Purchase

from apps.releases.serializers import PublicReleaseSerializer

class PublicListingDetailSerializer(serializers.ModelSerializer):
    authors = PublicAuthorSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    media = ListingMediaSerializer(many=True, read_only=True)
    is_owned = serializers.SerializerMethodField()
    releases = serializers.SerializerMethodField()

    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description',
            'price', 'category', 'authors', 'technologies', 'tags', 'media', 
            'created_at', 'is_owned', 'releases', 'average_rating', 'total_reviews'
        ]

    def get_releases(self, obj):
        releases = obj.releases.filter(is_published=True).order_by('-published_at')
        return PublicReleaseSerializer(releases, many=True, context=self.context).data

    def get_is_owned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Purchase.objects.filter(buyer=request.user, listing=obj).exists()
        return False
