from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    VerifyEmailView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView, 
    ProfileView,
    VerificationApplicationView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('verification/', VerificationApplicationView.as_view(), name='verification'),
]
