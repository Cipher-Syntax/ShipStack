from django.core.cache import cache
from django.db.models import Sum, Count
from apps.accounts.models import CustomUser, VerificationApplication
from apps.listings.models import Listing
from apps.commerce.models import Purchase
from apps.notifications.services import create_notification

def ban_user(user_id):
    user = CustomUser.objects.get(id=user_id)
    user.is_active = False
    user.save()
    return user

def unban_user(user_id):
    user = CustomUser.objects.get(id=user_id)
    user.is_active = True
    user.save()
    return user

def change_user_role(user_id, is_staff, is_superuser):
    user = CustomUser.objects.get(id=user_id)
    user.is_staff = is_staff
    user.is_superuser = is_superuser
    user.save()
    return user

def approve_listing(listing_id):
    listing = Listing.objects.get(id=listing_id)
    listing.status = Listing.StatusChoices.PUBLISHED
    listing.save()
    for author in listing.authors.all():
        create_notification(
            user=author,
            title="Listing Approved",
            message=f"Your listing '{listing.title}' has been approved and is now published.",
            notification_type='SYSTEM',
            link=f"/listings/{listing.slug}"
        )
    return listing

def reject_listing(listing_id, reason=""):
    listing = Listing.objects.get(id=listing_id)
    listing.status = Listing.StatusChoices.REJECTED
    listing.save()
    message = f"Your listing '{listing.title}' has been rejected."
    if reason:
        message += f" Reason: {reason}"
    for author in listing.authors.all():
        create_notification(
            user=author,
            title="Listing Rejected",
            message=message,
            notification_type='SYSTEM',
            link="/dashboard/listings"
        )
    return listing

def approve_verification(app_id):
    app = VerificationApplication.objects.get(id=app_id)
    app.status = 'APPROVED'
    app.save()
    app.user.is_verified_developer = True
    app.user.save()
    create_notification(
        user=app.user,
        title="Verification Approved",
        message="Your developer verification application has been approved.",
        notification_type='SYSTEM',
        link="/dashboard"
    )
    return app

def reject_verification(app_id):
    app = VerificationApplication.objects.get(id=app_id)
    app.status = 'REJECTED'
    app.save()
    create_notification(
        user=app.user,
        title="Verification Rejected",
        message="Your developer verification application has been rejected.",
        notification_type='SYSTEM',
        link="/dashboard"
    )
    return app

def get_dashboard_metrics():
    metrics = cache.get('admin_dashboard_metrics')
    if metrics is None:
        total_users = CustomUser.objects.count()
        verified_developers = CustomUser.objects.filter(is_verified_developer=True).count()
        total_listings = Listing.objects.filter(status=Listing.StatusChoices.PUBLISHED).count()
        pending_listings = Listing.objects.filter(status=Listing.StatusChoices.PENDING_REVIEW).count()
        pending_verifications = VerificationApplication.objects.filter(status='PENDING').count()
        revenue_data = Purchase.objects.aggregate(total=Sum('purchase_price'))
        total_revenue = revenue_data['total'] or 0.00
        
        metrics = {
            'total_users': total_users,
            'verified_developers': verified_developers,
            'total_listings': total_listings,
            'pending_listings': pending_listings,
            'pending_verifications': pending_verifications,
            'total_revenue': float(total_revenue)
        }
        cache.set('admin_dashboard_metrics', metrics, timeout=300) # Cache for 5 minutes
    return metrics
