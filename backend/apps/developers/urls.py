from django.urls import path
from .views import DeveloperProfileManageView, PublicStorefrontView

urlpatterns = [
    path('profile/', DeveloperProfileManageView.as_view(), name='developer-profile-manage'),
    path('store/<slug:slug>/', PublicStorefrontView.as_view(), name='public-storefront'),
]
