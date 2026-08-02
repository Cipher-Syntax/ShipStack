import random
from django.core.cache import cache

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
        # Mocking email sending for development
        print(f"\n--- EMAIL SENT ---")
        print(f"To: {email}")
        print(f"Subject: Your Verification Code")
        print(f"Code: {otp}")
        print(f"------------------\n")
