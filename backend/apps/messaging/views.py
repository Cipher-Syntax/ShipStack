from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from .services import get_or_create_conversation, send_message

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by('-updated_at')
        
    def create(self, request, *args, **kwargs):
        # Post request to create or get conversation with a target user
        target_username = request.data.get('username')
        if not target_username:
            return Response({"error": "username is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        target_user = get_object_or_404(User, username=target_username)
        
        try:
            conversation = get_or_create_conversation(request.user, target_user)
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        
        if request.method == 'GET':
            messages = conversation.messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
            
        if request.method == 'POST':
            content = request.data.get('content')
            if not content:
                return Response({"error": "content is required."}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                message = send_message(conversation, request.user, content)
                serializer = MessageSerializer(message)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        conversation = self.get_object()
        # Mark all messages sent by OTHERS in this conversation as read
        unread_messages = conversation.messages.exclude(sender=request.user).filter(is_read=False)
        updated_count = unread_messages.update(is_read=True)
        return Response({"status": "success", "marked_read": updated_count}, status=status.HTTP_200_OK)
