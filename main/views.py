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
        return TemplateResponse(request, 'main/index.html', context)
      return TemplateResponse(request, self.template_name, context)


class CatalogView(TemplateView):
  template_name = 'main/catalog.html'

  FILTER_MAPPING = {
    'color': lambda queryset, value: queryset.filter(color__iexact=value),
    'min_price': lambda queryset, value: queryset.filter(price__gte=value),
    'max-price': lambda queryset, value: queryset.filter(price_lte=value),
    'size': lambda queryset, value: queryset.filter(product_size__size__name=value),
  }

  def get_context_data(self, **kwargs):
      context = super().get_context_data(**kwargs)
      category_slug = kwargs.get('category_slug')
      categories = Category.objects.all()
      products = Product.objects.all().order_by('-created_at')
      current_category = None #!Сортировки по категориям по умоданию нет

      if category_slug:
        current_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=current_category)

      query = self.request.GET.get('q')
      if query:
        products = products.filter(
          Q(name__icontains=query) | Q(description__icontains=query)
        )
      filter_params = {}
      for param, filter_func in self.FILTER_MAPPING.items():
        value = self.request.GET.get(param)
        if value:
          products = filter_func(products.value)
          filter_params[param] = value
        else:
          filter_params[param] = ''
      filter_params['q'] = query or ''

      context.update({
        'categories': categories,
        'products': products,
        'current_category': category_slug,
        'filter_params': filter_params,
        'sizes': Size.objects.all(),
        'search_quary': query or ''
        })

      return context
  def get(self, request, *args, **kwargs):
    context = self.get_context_data(**kwargs)
    if request.headers.get('HX-Request'):
      return TemplateResponse(request, 'main/catalog.html', context)
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
      return TemplateResponse(request, 'main/product_detail.html', context)
    return TemplateResponse(request, self.template_name, context)
