from rest_framework.throttling import AnonRateThrottle

class AuthRateThrottle(AnonRateThrottle):
    rate = '5/minute'

class RegistrationRateThrottle(AnonRateThrottle):
    rate = '3/minute'
