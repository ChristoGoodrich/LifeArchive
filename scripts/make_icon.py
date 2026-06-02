"""Generate Life Archive's app icon: a fanned stack of snapshot cards (the
"life archive" — layered saved states) in the app's blue->purple gradient on a
bright rounded square. Outputs build/icon.ico (multi-size) + icon.png."""
import os
from PIL import Image, ImageDraw

S = 1024  # master resolution
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "build")
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = (172, 215, 255)   # #acd7ff
ACCENT2 = (201, 184, 255)  # #c9b8ff
BG_TOP = (76, 135, 255)    # #4c87ff
BG_BOT = (115, 84, 238)    # #7354ee
SEP = (47, 74, 180)        # blue gap between cards

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# 1) bright vertical-gradient background
bg = Image.new("RGB", (S, S))
bpx = bg.load()
for y in range(S):
    c = lerp(BG_TOP, BG_BOT, y / S)
    for x in range(S):
        bpx[x, y] = c
icon = bg.convert("RGBA")

# 2) diagonal blue->purple gradient used to fill the cards
grad = Image.new("RGB", (S, S))
gpx = grad.load()
for y in range(S):
    for x in range(S):
        gpx[x, y] = lerp(ACCENT, ACCENT2, (x + y) / (2 * S))
grad = grad.convert("RGBA")

# 3) fanned stack of cards, back -> front. Each: (box, fill-alpha)
CW, CH, R = 430, 300, 46
cards = [
    ((512 - CW // 2 + 70, 250), 90),   # back  (dim, shifted up-right)
    ((512 - CW // 2 + 35, 320), 165),  # mid
    ((512 - CW // 2,      390), 255),  # front (full gradient)
]
d_bg = ImageDraw.Draw(icon)
for (x0, y0), alpha in cards:
    x1, y1 = x0 + CW, y0 + CH
    # deeper blue gap so the card behind reads as separate
    d_bg.rounded_rectangle([x0 - 12, y0 - 12, x1 + 12, y1 + 12], radius=R + 10, fill=SEP)
    # gradient card via an alpha mask (lower alpha = dimmer back cards)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([x0, y0, x1, y1], radius=R, fill=alpha)
    icon = Image.alpha_composite(icon, Image.composite(grad, Image.new("RGBA", (S, S), (0, 0, 0, 0)), mask))
    d_bg = ImageDraw.Draw(icon)

# front-card detail: a small "snapshot" notch (two rounded lines) for texture
fx0, fy0 = cards[2][0]
d = ImageDraw.Draw(icon)
for i, w in enumerate((150, 96)):
    yy = fy0 + 200 + i * 40
    d.rounded_rectangle([fx0 + 48, yy, fx0 + 48 + w, yy + 20], radius=10, fill=(58, 80, 178, 170))

# 4) round the outer corners (transparent)
corner = Image.new("L", (S, S), 0)
ImageDraw.Draw(corner).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
icon.putalpha(corner)

# 5) export
icon.save(os.path.join(OUT_DIR, "icon.png"))
icon.save(os.path.join(OUT_DIR, "icon.ico"),
          sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
print("wrote build/icon.png and build/icon.ico")
