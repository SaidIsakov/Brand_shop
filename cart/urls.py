from django.urls import path
from .views import*

urlpatterns = [
  path('', CartModalView.as_view(), name='cart_modal'),
  path('add/<slug:slug>/', AddToCartView.as_view(), name='add_to_cart'),
  path('update/<int:item_id>/', UpdateCartItemView.as_view(), name='update_cart'),
  path('remove/<int:item_id>/', RemoveCartItemView.as_view(), name='remove_cart'),
  path('count/', ClearCartView.as_view(), name='cart_count'),
  path('clear/',ClearCartView.as_view(), name='clear_cart'),
  path('summary/', CartSummaryView.as_view(), name='cart_summary')
]

