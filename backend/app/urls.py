from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import (generate_summary_document, generate_summary_text,
                    get_summaries)

urlpatterns = [
    path("text/", generate_summary_text, name='generate_summary_text'),
    path("summaries/", get_summaries, name='get_summaries'),
    path("document/", generate_summary_document,
         name='generate_summary_document')

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
