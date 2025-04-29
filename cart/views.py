from django.shortcuts import render, redirect, get_object_or_404
from products.models import Product  # Assure-toi que le chemin est correct

# ➕ Ajouter un produit au panier
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    cart = request.session.get('cart', {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + 1

    request.session['cart'] = cart

    return redirect('home')

# 👁️ Afficher le contenu du panier
def view_cart(request):
    cart = request.session.get('cart', {})
    product_ids = cart.keys()
    products = Product.objects.filter(id__in=product_ids)

    cart_items = []
    total_price = 0

    for product in products:
        quantity = cart.get(str(product.id), 0)
        subtotal = quantity * product.price
        total_price += subtotal

        cart_items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': subtotal
        })

    return render(request, 'cart/view_cart.html', {
        'cart_items': cart_items,
        'total_price': total_price
    })

# 🧹 Vider le panier ✅
def clear_cart(request):
    request.session['cart'] = {}
    return redirect('view_cart')