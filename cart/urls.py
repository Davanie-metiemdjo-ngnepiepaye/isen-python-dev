from django.urls import path
from . import views

urlpatterns = [
    
    path('view/', views.view_cart, name='view_cart'),  
    path('clear/', views.clear_cart, name='clear_cart'),  
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add-to-cart'),
    
]
