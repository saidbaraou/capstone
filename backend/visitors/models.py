from django.db import models

# Create your models here.
class Visitor(models.Model):
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  email =  models.EmailField()
  company = models.CharField(max_length=100, blank=True, null= True)
  check_in_time = models.DateTimeField(auto_now_add=True)
  is_stil_on_site = models.BooleanField(default=True)

  def __str__(self):
    return f"{self.first_name} {self.last_name}"