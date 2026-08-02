import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings

class OTPService:
    @staticmethod
    def generate_otp(email):
        otp = str(random.randint(100000, 999999))
        cache.set(f"otp_{email}", otp, timeout=300) # 5 minutes TTL
        return otp

    @staticmethod
    def verify_otp(email, otp):
        cached_otp = cache.get(f"otp_{email}")
        if cached_otp and cached_otp == str(otp):
            cache.delete(f"otp_{email}")
            return True
        return False

class EmailService:
    @staticmethod
    def send_otp(email, otp):
        subject = 'ShipStack Verification Code'
        message = f'Your verification code is: {otp}\n\nThis code will expire in 5 minutes.'
        from_email = settings.DEFAULT_FROM_EMAIL
        
        try:
            send_mail(
                subject,
                message,
                from_email,
                [email],
                fail_silently=False,
            )
            print(f"OTP successfully sent to {email}")
        except Exception as e:
            print(f"Failed to send email to {email}: {str(e)}")
