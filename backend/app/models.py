import uuid

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models

CustomUser = get_user_model()


def validate_file_extension(file):
    valid_extensions = ['.pdf', '.docx']
    file_extension = file.name.split('.')[-1]

    if f'.{file_extension}' not in valid_extensions:
        raise ValidationError("Only PDF and Word files are allowed.")


class Summary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="summaries"
    )

    summary_text = models.TextField(null=True)
    summary_title = models.TextField(null=True)

    summary_date = models.DateTimeField(auto_now_add=True)

    pdf_or_word_file = models.FileField(
        upload_to='summaries/', blank=True, null=True, validators=[validate_file_extension])

    text_source = models.TextField()
