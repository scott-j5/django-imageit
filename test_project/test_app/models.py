from django.db import models

from imageit.models import ScaleItImageField, CropItImageField
from imageit.widgets import ScaleItImageWidget, CropItImageWidget

class PhotoModel(models.Model):
    scale_photo = ScaleItImageField()
    crop_it_photo = CropItImageField()
