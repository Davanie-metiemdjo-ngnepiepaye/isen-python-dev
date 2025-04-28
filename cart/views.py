from django.shortcuts import render, redirect, get_object_or_404
from products.models import Product  # Assure-toi que le chemin est bon

# ➕ Ajouter un produit au panier
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    # Récupération du panier depuis la session (dictionnaire {id: quantité})
    cart = request.session.get('cart', {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + 1

    # Mise à jour de la session
    request.session['cart'] = cart

    return redirect('home')  # Redirection vers l'accueil

# 👁️ Afficher le contenu du panier
def view_cart(request):
    cart = request.session.get('cart', {})  # panier = {product_id: quantité}
    product_ids = cart.keys()
    products = Product.objects.filter(id__in=product_ids)

    # Ajouter la quantité à chaque objet produit
    for product in products:
        product.quantity = cart.get(str(product.id), 0)

    return render(request, 'cart/view_cart.html', {'products': products})

# 🧹 Vider le panier
def clear_cart(request):
    request.session['cart'] = {}  # Réinitialiser le panier
    return redirect('view_cart')
