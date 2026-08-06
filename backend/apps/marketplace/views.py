from rest_framework import generics, permissions
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Category, Technology, Tag
from .serializers import CategorySerializer, TechnologySerializer, TagSerializer

@method_decorator(cache_page(60 * 15), name='dispatch')
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

@method_decorator(cache_page(60 * 15), name='dispatch')
class TechnologyListView(generics.ListAPIView):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [permissions.AllowAny]

@method_decorator(cache_page(60 * 15), name='dispatch')
class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
