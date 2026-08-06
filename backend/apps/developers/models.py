from django.db import models
from django.conf import settings
from apps.common.validators import validate_image_extension, validate_file_size

class DeveloperProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='developer_profile')
    store_name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    logo = models.ImageField(upload_to='developer_logos/', blank=True, null=True, validators=[validate_image_extension, validate_file_size])
    banner = models.ImageField(upload_to='developer_banners/', blank=True, null=True, validators=[validate_image_extension, validate_file_size])
    biography = models.TextField(blank=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name
