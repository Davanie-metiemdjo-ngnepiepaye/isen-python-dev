"""django-test URL Configuration

Le fichier `urls.py` définit les routes principales de l'application.
Il redirige chaque préfixe d'URL vers le fichier `urls.py` de chaque application.

Documentation : https://docs.djangoproject.com/en/3.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),                          # Interface admin Django
    path('', include('home.urls')),                           # App accueil
    path('favourite/', include('favourites.urls')),           # App favoris
    path('user/', include('users.urls')),                     # App utilisateurs
    path('cart/', include('cart.urls')),                      # ✅ App panier (ajouté)
    
    # Routes pour accéder aux fichiers médias et statiques pendant le développement
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
