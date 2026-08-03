from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeveloperReleaseViewSet

router = DefaultRouter()
router.register(r'developer', DeveloperReleaseViewSet, basename='developer-releases')

urlpatterns = [
    path('', include(router.urls)),
]
