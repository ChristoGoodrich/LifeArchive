"""Generate Life Archive's desktop app icon: a filed archive folder in the app's
blue->purple gradient on a bright rounded square. Outputs build/icon.ico
(multi-size) + build/icon.png. Artwork lives in icon_design.py (shared with the
Android icon generator)."""
import os, sys
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icon_design import draw_archive

S = 1024  # master resolution
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "build")
os.makedirs(OUT_DIR, exist_ok=True)

icon = draw_archive(S, transparent=False)

# round the outer corners (transparent) for the desktop/legacy icon
corner = Image.new("L", (S, S), 0)
ImageDraw.Draw(corner).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
icon.putalpha(corner)

icon.save(os.path.join(OUT_DIR, "icon.png"))
icon.save(os.path.join(OUT_DIR, "icon.ico"),
          sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
print("wrote build/icon.png and build/icon.ico")
