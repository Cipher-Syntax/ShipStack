from django.db import models
from django.conf import settings
from apps.marketplace.models import Category, Technology

class SoftwareRequest(models.Model):
    class StatusChoices(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='software_requests')
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='software_requests')
    technologies = models.ManyToManyField(Technology, related_name='software_requests', blank=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.OPEN)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class RequestProposal(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'

    request = models.ForeignKey(SoftwareRequest, on_delete=models.CASCADE, related_name='proposals')
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='request_proposals')
    message = models.TextField()
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('request', 'developer') # one active proposal per developer per request

    def __str__(self):
        return f"Proposal by {self.developer.username} for {self.request.title}"
