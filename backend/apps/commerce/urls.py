from django.urls import path
from .views import CreateCheckoutSessionView, PaymongoWebhookView, DownloadSoftwareView

urlpatterns = [
    path('checkout/session/', CreateCheckoutSessionView.as_view(), name='checkout-session'),
    path('webhook/paymongo/', PaymongoWebhookView.as_view(), name='paymongo-webhook'),
    path('download/<int:listing_id>/', DownloadSoftwareView.as_view(), name='download-software'),
]
