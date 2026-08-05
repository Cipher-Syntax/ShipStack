from .models import Notification

def create_notification(user, title, message, notification_type='SYSTEM', link=None):
    """
    Creates a new notification for a user.
    """
    if not user:
        return None
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        link=link
    )
