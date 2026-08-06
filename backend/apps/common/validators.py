import os
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if ext not in valid_extensions:
        raise ValidationError(_('Unsupported file extension. Allowed extensions are: .jpg, .jpeg, .png, .gif, .webp.'))

def validate_file_size(value):
    # Max size 100MB
    filesize = value.size
    if filesize > 104857600:
        raise ValidationError(_("The maximum file size that can be uploaded is 100MB"))

def validate_package_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.zip', '.tar', '.gz', '.tgz', '.rar', '.7z']
    if ext not in valid_extensions:
        raise ValidationError(_('Unsupported package format. Allowed extensions are: .zip, .tar, .gz, .tgz, .rar, .7z.'))
