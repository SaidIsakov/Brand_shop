from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, ListView
from .models import*
from .models import Product
from django.template.response import TemplateResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q



class IndexView(TemplateView):
  template_name = 'main/index.html'

  def get_context_data(self, **kwargs):
      context = super().get_context_data(**kwargs)
      title = 'BRAND'
      products = Product.objects.all()
      context.update({
        'title':title,
        'products':products
      })
      return context

  def get(self, request, *args, **kwargs):
      context = self.get_context_data(**kwargs)
      if request.headers.get('HX-Request'):
        return TemplateResponse(request, 'main/components/partials/index_partials.html', context)
      return TemplateResponse(request, self.template_name, context)


class CatalogView(TemplateView):
  template_name = 'main/catalog.html'
  def get_context_data(self, **kwargs):
      context = super().get_context_data(**kwargs)
      context["products"] = Product.objects.all()
      context["categories"] = Category.objects.all()
      return context


  def get(self, request, *args, **kwargs):
    context = self.get_context_data(**kwargs)
    if request.headers.get('HX-Request'):
      return TemplateResponse(request, 'main/components/partials/catalog_partials.html', context)
    return TemplateResponse(request, self.template_name, context)


class ProductDetailView(DetailView):
  model = Product
  template_name = 'main/product_detail.html'
  slug_field = 'slug'
  slug_url_kwarg = 'slug'
  def get_context_data(self, **kwargs):
      context = super().get_context_data(**kwargs)
      product = self.get_object()
      context['categories'] = Category.objects.all()
      context['related_products'] = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
      context['current_category'] = product.category.slug
      return context

  def get(self, request, *args, **kwargs):
    self.object = self.get_object()
    context = self.get_context_data(**kwargs)
    if request.headers.get('HX-Request'):
      return TemplateResponse(request, 'main/components/partials/product_detail_partials.html', context)
    return TemplateResponse(request, self.template_name, context)
