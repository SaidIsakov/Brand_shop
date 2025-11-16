from django import template
from cart.models import Cart

register = template.Library()
def user_carts(request):
  return Cart.objects.filter(user=request.user)
