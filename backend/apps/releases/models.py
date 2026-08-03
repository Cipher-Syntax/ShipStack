from django.db import models
from apps.listings.models import Listing, SoftwarePackage

class Release(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='releases')
    package = models.ForeignKey(SoftwarePackage, on_delete=models.SET_NULL, null=True, blank=True)
    version_number = models.CharField(max_length=50)
    changelog = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return f"{self.listing.title} - v{self.version_number}"
