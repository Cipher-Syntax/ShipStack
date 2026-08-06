from rest_framework import serializers
from .models import SoftwareRequest, RequestProposal
from apps.marketplace.serializers import CategorySerializer, TechnologySerializer
from apps.marketplace.models import Category, Technology
from django.contrib.auth import get_user_model

User = get_user_model()

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class SoftwareRequestSerializer(serializers.ModelSerializer):
    buyer = PublicUserSerializer(read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    technologies_detail = TechnologySerializer(source='technologies', many=True, read_only=True)
    
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True)
    technologies = serializers.PrimaryKeyRelatedField(queryset=Technology.objects.all(), many=True, write_only=True, required=False)

    class Meta:
        model = SoftwareRequest
        fields = [
            'id', 'buyer', 'title', 'description', 'budget_min', 'budget_max', 
            'deadline', 'category', 'category_detail', 'technologies', 'technologies_detail', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class RequestProposalSerializer(serializers.ModelSerializer):
    developer = PublicUserSerializer(read_only=True)

    class Meta:
        model = RequestProposal
        fields = [
            'id', 'request', 'developer', 'message', 'proposed_price', 
            'estimated_days', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'request', 'status', 'created_at', 'updated_at']
