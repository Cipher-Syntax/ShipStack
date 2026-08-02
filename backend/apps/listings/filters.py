import django_filters
from .models import Listing

class ListingFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr='iexact')
    technologies = django_filters.CharFilter(method='filter_technologies')

    class Meta:
        model = Listing
        fields = ['category', 'technologies', 'min_price', 'max_price']
        
    def filter_technologies(self, queryset, name, value):
        # Allow comma separated slugs
        tech_slugs = [slug.strip() for slug in value.split(',') if slug.strip()]
        if tech_slugs:
            for slug in tech_slugs:
                queryset = queryset.filter(technologies__slug=slug)
        return queryset
