from django.conf.urls import url, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from views import index

urlpatterns = [
    url(r'^$', index),
    url(r'^caffe/', include('caffe_app.urls')),
    url(r'^keras/', include('keras_app.urls')),
    url(r'^tensorflow/', include('tensorflow_app.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^djga/', include('google_analytics.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
