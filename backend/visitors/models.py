from django.db import models

# Case 1: Success (complete and correct model definition)
class Visitor(models.Model):
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  email =  models.EmailField()
  company = models.CharField(max_length=100, blank=True, null= True)
  check_in_time = models.DateTimeField(auto_now_add=True)
  is_still_on_site = models.BooleanField(default=True)

  def __str__(self):
    return f"{self.first_name} {self.last_name}"