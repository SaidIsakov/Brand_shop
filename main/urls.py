from django.urls import path
from .views import*

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('catalog/', CatalogView.as_view(), name='catalog'),
    path('product/<slug:slug>/', ProductDetailView.as_view(),name='product_detail')
]
