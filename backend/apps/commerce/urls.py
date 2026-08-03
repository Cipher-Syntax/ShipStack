from django.urls import path
from .views import CreateCheckoutSessionView, PaymongoWebhookView, DownloadSoftwareView, GenerateDownloadTokenView

urlpatterns = [
    path('checkout/session/', CreateCheckoutSessionView.as_view(), name='checkout-session'),
    path('webhook/paymongo/', PaymongoWebhookView.as_view(), name='paymongo-webhook'),
    path('download-token/<int:listing_id>/', GenerateDownloadTokenView.as_view(), name='generate-download-token'),
    path('download/<int:listing_id>/', DownloadSoftwareView.as_view(), name='download-software'),
]
