from django.urls import path
from .views import CategoryListView, TechnologyListView, TagListView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('technologies/', TechnologyListView.as_view(), name='technology-list'),
    path('tags/', TagListView.as_view(), name='tag-list'),
]
