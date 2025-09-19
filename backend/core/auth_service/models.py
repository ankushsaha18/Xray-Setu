from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    # Default fields (username, password, email, etc.) are inherited
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    # Add any additional fields you need
    phone_number = models.CharField(max_length=15, blank=True)
    
    # Role field for distinguishing between patient and nurse
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('nurse', 'Nurse'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    
    def __str__(self):
        return self.username

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"