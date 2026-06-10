from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from visitors.models import Visit

User = get_user_model()

class VisitAPITests(APITestCase):

    def setUp(self):
        """
        Create initial data before each test.
        """
        # 1. Create a dummy host (employee)
        self.host_user = User.objects.create_user(
            username="johndoe",
            email="john.doe@company.com",
            password="securepassword123",
            first_name="John",
            last_name="Doe"
        )
        
        # 2. Create a dummy pending visit
        self.visit = Visit.objects.create(
            visitor_full_name="Alice Smith",
            visitor_email="alice.smith@client.com",
            visitor_company="Acme Corp",
            host=self.host_user,
            planned_arrival=timezone.now() + timezone.timedelta(days=1),
            purpose_of_visit="Project Review"
        )
        
        # 3. Generate URLs for the endpoints
        self.list_url = reverse('visit-list')
        self.check_in_url = reverse('visit-check-in', kwargs={'pk': self.visit.id})
        self.check_out_url = reverse('visit-check-out', kwargs={'pk': self.visit.id})

    def test_get_visits_list(self):
        """
        Ensure we can fetch the list of visits.
        """
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['visitor_full_name'], "Alice Smith")

    def test_successful_check_in(self):
        """
        Ensure a visitor can successfully check in.
        """
        response = self.client.post(self.check_in_url)
        
        # Check HTTP status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check database update
        self.visit.refresh_from_db()
        self.assertEqual(self.visit.status, Visit.VisitStatus.CHECKED_IN)
        self.assertIsNotNone(self.visit.check_in_time)

    def test_cannot_check_in_twice(self):
        """
        Ensure we cannot check in a visitor who is already checked in.
        """
        # First check-in
        self.client.post(self.check_in_url)
        
        # Second check-in (should fail)
        response = self.client.post(self.check_in_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Visitor is already checked in.")

    def test_successful_check_out(self):
        """
        Ensure a visitor can successfully check out after checking in.
        """
        # Visitor must be checked in first
        self.visit.mark_as_arrived()
        
        response = self.client.post(self.check_out_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.visit.refresh_from_db()
        self.assertEqual(self.visit.status, Visit.VisitStatus.CHECKED_OUT)
        self.assertIsNotNone(self.visit.check_out_time)