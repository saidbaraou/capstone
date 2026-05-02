from django.test import TestCase
from visitors.serializers import VisitorSerializer


# Case 1: Success (valid data)
class VisitorSerializerTestCase(TestCase):
    def test_visitor_serialization(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            "company": "Example Inc.",
        }
        serializer = VisitorSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['first_name'], "John")

    #case 2: Optional data (Company is blank=True)
    def test_visitor_without_company(self):
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            # missing 'company' on purpose
        }
        serializer = VisitorSerializer(data=payload)
        self.assertTrue(serializer.is_valid()) #must be valid cause null=True/blank=True

    def test_invalid_email_visitor(self):
        payload = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "not-an-email",
        }
        serializer = VisitorSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)