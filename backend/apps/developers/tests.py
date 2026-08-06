from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.accounts.models import VerificationApplication

User = get_user_model()

class DeveloperVerificationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='devuser',
            email='devuser@example.com',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)
        self.application_url = '/api/accounts/verification/' # This is in accounts app

    def test_submit_verification_application(self):
        data = {
            'github_url': 'https://github.com/devuser',
            'statement': 'I want to build software.'
        }
        response = self.client.post(self.application_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VerificationApplication.objects.count(), 1)
        self.assertEqual(VerificationApplication.objects.first().status, 'PENDING')

    def test_duplicate_verification_application(self):
        VerificationApplication.objects.create(
            user=self.user,
            github_url='https://github.com/devuser',
            statement='First application'
        )
        
        data = {
            'github_url': 'https://github.com/devuser2',
            'statement': 'Second application'
        }
        response = self.client.post(self.application_url, data)
        # Should return 400 because user already has an application
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
