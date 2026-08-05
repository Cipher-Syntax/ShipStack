from rest_framework import serializers
from .models import Conversation, Message
from apps.accounts.serializers import ProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class BasicUserSerializer(serializers.ModelSerializer):
    store_slug = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'store_slug']
        read_only_fields = fields
        
    def get_store_slug(self, obj):
        if hasattr(obj, 'developer_profile'):
            return obj.developer_profile.slug
        return None

class MessageSerializer(serializers.ModelSerializer):
    sender = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender', 'created_at', 'is_read']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at', 'updated_at', 'last_message', 'unread_count']

    def get_participants(self, obj):
        request = self.context.get('request')
        users = obj.participants.all()
        # Optionally filter out the current user if you only want the "other" person
        # but returning all is fine.
        return BasicUserSerializer(users, many=True).data

    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        if last_message:
            return {
                'id': last_message.id,
                'content': last_message.content,
                'created_at': last_message.created_at,
                'sender_id': last_message.sender_id,
            }
        return None
        
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.messages.exclude(sender=request.user).filter(is_read=False).count()
