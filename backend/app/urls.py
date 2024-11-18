from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import (delete_summary, generate_summary_document,
                    generate_summary_text, get_summaries, get_summary)

urlpatterns = [
    path("text/", generate_summary_text, name='generate_summary_text'),
    path("summaries/", get_summaries, name='get_summaries'),
    path("document/", generate_summary_document,
         name='generate_summary_document'),
    path("delete-summary/<str:id>/", delete_summary, name="delete_summary"),
    path("summaries/<str:id>/", get_summary, name="get_summary")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
