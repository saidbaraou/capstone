from rest_framwork.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import Visitor


class VisitorAPITest(APITestCase):

  def test_get_visitors_list(self):

    url = reverse('visitor-list')

    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    self.assertIsInstance(response.data, list)

    def test_get_visitor(self):
        url = reverse('visitor-list')

        Visitor.objects.create(
           first_name="John",
            last_name="Doe",
            email="johndoe@example.com"
        )