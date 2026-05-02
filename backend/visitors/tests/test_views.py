from rest_framwork.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import Visitor


class VisitorAPITest(APITestCase):
  
  def test_get_projects_list(self):

    url = reverse('visitor-list')

    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    self.assertIsInstance(response.data, list)