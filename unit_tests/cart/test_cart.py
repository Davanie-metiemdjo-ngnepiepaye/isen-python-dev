from django.test import TestCase
from django.urls import reverse
from products.models import Product

class CartTestCase(TestCase):
    def setUp(self):
        # Crée un produit de test
        self.product = Product.objects.create(
            name='Test Product',
            image='product_img/test.jpg',
            description='Test description',
            price=10.00
        )

    def test_add_product_to_cart(self):
        # Envoie une requête GET pour ajouter le produit au panier
        response = self.client.get(reverse('add-to-cart', args=[self.product.id]))
        
        # Vérifie que l'utilisateur est bien redirigé
        self.assertEqual(response.status_code, 302)

        # Vérifie que le produit est dans la session panier
        cart = self.client.session.get('cart', {})
        self.assertIn(str(self.product.id), cart)
        self.assertEqual(cart[str(self.product.id)], 1)  # La quantité doit être 1
