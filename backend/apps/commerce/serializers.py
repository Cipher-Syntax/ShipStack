from rest_framework import serializers
from .models import Purchase
from apps.listings.models import Listing

class PurchaseListingSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['id', 'title', 'slug', 'short_description', 'cover_image']

    def get_cover_image(self, obj):
        cover = obj.media.filter(media_type='COVER').first()
        if cover and cover.file:
            return cover.file.url
        return None

class MyPurchaseSerializer(serializers.ModelSerializer):
    listing = PurchaseListingSerializer(read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'listing', 'purchase_price', 'purchased_at']
