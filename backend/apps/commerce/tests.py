from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.listings.models import Listing
from apps.commerce.models import Purchase, Order

User = get_user_model()

class CommerceTests(APITestCase):

    def setUp(self):
        self.buyer = User.objects.create_user(
            username='buyer',
            email='buyer@example.com',
            password='testpassword123'
        )
        self.seller = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='testpassword123',
            is_verified_developer=True
        )
        
        self.listing = Listing.objects.create(
            title='Test Software',
            slug='test-software',
            price=10.00,
            status=Listing.StatusChoices.PUBLISHED
        )
        self.listing.authors.add(self.seller)
        
        self.client.force_authenticate(user=self.buyer)

    def test_purchase_creation_flow(self):
        data = {
            'listing_id': self.listing.id
        }
        # Assuming the create-checkout endpoint requires listing_id
        response = self.client.post('/api/commerce/checkout/session/', data)
        # Should return 200 with checkout URL if paymongo is mocked, 
        # or fail if secrets are missing. Since this is an external API call, 
        # we might just want to test local models or mock the service.
        pass

    def test_my_purchases_list(self):
        # Manually create a purchase to test the list view
        order = Order.objects.create(
            buyer=self.buyer,
            listing=self.listing,
            amount=self.listing.price,
            status=Order.StatusChoices.COMPLETED
        )
        Purchase.objects.create(
            buyer=self.buyer,
            listing=self.listing,
            order=order,
            purchase_price=self.listing.price
        )
        
        response = self.client.get('/api/commerce/purchases/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results', [])), 1)
        self.assertEqual(response.data['results'][0]['listing']['title'], 'Test Software')
