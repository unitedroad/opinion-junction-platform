import os
from PIL import Image, ImageOps

FRONT_PAGE_IMAGE_LOCATION = '/newsoftheworld/newsoftheworldmedia/ojfrontpageimages'

for i in os.listdir(FRONT_PAGE_IMAGE_LOCATION):
    if i.startswith('header_'):
        print i
        image = Image.open(os.path.join(FRONT_PAGE_IMAGE_LOCATION,i))
        image = ImageOps.fit(image, (1280,400))
        image.save(os.path.join(FRONT_PAGE_IMAGE_LOCATION,i))
