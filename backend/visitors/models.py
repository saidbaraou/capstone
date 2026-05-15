import uuid
from django.db import models
from django.conf import settings

class Visitor(models.Model):
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  email =  models.EmailField()
  company = models.CharField(max_length=100, blank=True, null= True)
  check_in_time = models.DateTimeField(auto_now_add=True)
  is_still_on_site = models.BooleanField(default=True)

  def __str__(self):
    return f"{self.first_name} {self.last_name}"
  

class Visit(models.Model):
    class VisitorStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CHECKED_IN = 'CHECKED_IN', 'Checked In'
        CHECKED_OUT = 'CHECKED_OUT', 'Checked Out'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    # Unique identifier for the QR Code (secure and unguessable)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Visitor Information
    visitor_full_name = models.CharField(max_length=150)
    visitor_email = models.EmailField()
    visitor_company = models.CharField(max_length=150, blank=True)
    
    # Host (The employee being visited)
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='visits'
    )

    # Timing
    planned_arrival = models.DateTimeField()
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    
    # Business Logic
    status = models.CharField(
        max_length=20, 
        choices=VisitorStatus.choices, 
        default=VisitorStatus.PENDING
    )
    purpose_of_visit = models.TextField(blank=True)
    
    # Compliance & Safety (Critical for industrial sites)
    safety_instructions_signed = models.BooleanField(default=False)
    nda_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.visitor_full_name} ({self.status})"

    class Meta:
        ordering = ['-planned_arrival']

    