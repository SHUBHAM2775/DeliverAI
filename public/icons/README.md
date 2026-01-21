# PWA Icons

This directory contains the PWA icons for the DeliverAI application.

## Icon Sizes Needed

The following icon sizes are required for a complete PWA implementation:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## How to Generate Icons

You can use one of these methods to generate the icons:

### Option 1: Using Online Tools
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 source image
3. Download all generated sizes

### Option 2: Using ImageMagick (Command Line)
```bash
# If you have a source icon (e.g., icon-source.png)
magick icon-source.png -resize 72x72 icon-72x72.png
magick icon-source.png -resize 96x96 icon-96x96.png
magick icon-source.png -resize 128x128 icon-128x128.png
magick icon-source.png -resize 144x144 icon-144x144.png
magick icon-source.png -resize 152x152 icon-152x152.png
magick icon-source.png -resize 192x192 icon-192x192.png
magick icon-source.png -resize 384x384 icon-384x384.png
magick icon-source.png -resize 512x512 icon-512x512.png
```

### Option 3: Using SVG (Temporary Placeholder)
A basic SVG icon (`icon.svg`) has been provided as a placeholder. To convert it to PNG:
```bash
# Using Inkscape
inkscape icon.svg --export-filename=icon-512x512.png --export-width=512 --export-height=512
```

## Current Status

⚠️ **Action Required**: A placeholder SVG icon has been created. Please replace it with your actual app icon/logo and generate all required PNG sizes listed above.

The PWA will still work with the placeholder, but you should add proper branded icons for a professional appearance.
