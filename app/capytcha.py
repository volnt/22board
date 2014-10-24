from PIL import Image, ImageDraw, ImageFont

class Capytcha(object):
    def __init__(self, string):
        self.string = string
    
    def save(self, output, position=(0, 0), size=(100, 25), 
             background=(255, 255, 255), font=None, fill=(0, 0, 0)):
        font = ImageFont.load_default() if font is None else ImageFont.truetype(**font)
        image = Image.new('RGB', size, background)
        text = ImageDraw.Draw(image)
        text.text(position, self.string, font=font, fill=fill)
        image.save(output)
