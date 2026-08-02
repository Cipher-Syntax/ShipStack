from django.db import models
from django.conf import settings
from cloudinary_storage.storage import RawMediaCloudinaryStorage
from apps.marketplace.models import Category, Technology, Tag

class Listing(models.Model):
    class StatusChoices(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_REVIEW = 'PENDING_REVIEW', 'Pending Review'
        PUBLISHED = 'PUBLISHED', 'Published'
        REJECTED = 'REJECTED', 'Rejected'
        ARCHIVED = 'ARCHIVED', 'Archived'

    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=200, blank=True)
    full_description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.DRAFT)
    
    authors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='listings')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='listings')
    technologies = models.ManyToManyField(Technology, blank=True, related_name='listings')
    tags = models.ManyToManyField(Tag, blank=True, related_name='listings')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ListingMedia(models.Model):
    class MediaTypeChoices(models.TextChoices):
        COVER = 'COVER', 'Cover Image'
        SCREENSHOT = 'SCREENSHOT', 'Screenshot'
        DOCUMENTATION = 'DOCUMENTATION', 'Documentation'

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='listings/media/')
    media_type = models.CharField(max_length=20, choices=MediaTypeChoices.choices)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.listing.title} - {self.media_type}"

class SoftwarePackage(models.Model):
    class ScanStatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PASSED = 'PASSED', 'Passed'
        FAILED = 'FAILED', 'Failed'

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='packages')
    file = models.FileField(upload_to='listings/packages/', storage=RawMediaCloudinaryStorage())
    scan_status = models.CharField(max_length=20, choices=ScanStatusChoices.choices, default=ScanStatusChoices.PENDING)
    scan_results = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Package for {self.listing.title} ({self.scan_status})"
