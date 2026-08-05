from django.db.models import Count
from .models import Conversation, Message

def get_or_create_conversation(user1, user2):
    if user1 == user2:
        raise ValueError("Cannot create a conversation with yourself.")
        
    conversation = Conversation.objects.annotate(
        participant_count=Count('participants')
    ).filter(
        participants=user1
    ).filter(
        participants=user2
    ).filter(
        participant_count=2
    ).first()

    if conversation:
        return conversation

    conversation = Conversation.objects.create()
    conversation.participants.add(user1, user2)
    return conversation

def send_message(conversation, sender, content):
    if not conversation.participants.filter(id=sender.id).exists():
        raise ValueError("Sender is not a participant in this conversation.")
    
    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content
    )
    # Updating updated_at
    conversation.save(update_fields=['updated_at'])
    
    from apps.notifications.services import create_notification
    recipient = conversation.participants.exclude(id=sender.id).first()
    if recipient:
        create_notification(
            user=recipient,
            title='New Message',
            message=f"{sender.username} sent you a message.",
            notification_type='MESSAGE',
            link=f"/messages?conversation={conversation.id}"
        )
    return message
