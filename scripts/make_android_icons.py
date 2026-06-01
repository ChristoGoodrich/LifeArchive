"""Generate the source images @capacitor/assets needs for Android adaptive icons
+ splash, matching the desktop card-stack archive icon. Outputs into assets/:
  icon-only.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png
"""
import os, shutil
from PIL import Image, ImageDraw

S = 1024
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

ACCENT = (110, 168, 254); ACCENT2 = (157, 123, 255)
BG_TOP = (18, 24, 38); BG_BOT = (8, 11, 18); SEP = (9, 12, 20)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def navy_bg(size):
    img = Image.new("RGB", (size, size)); px = img.load()
    for y in range(size):
        c = lerp(BG_TOP, BG_BOT, y / size)
        for x in range(size):
            px[x, y] = c
    return img.convert("RGBA")

def diagonal_grad(size):
    img = Image.new("RGB", (size, size)); px = img.load()
    for y in range(size):
        for x in range(size):
            px[x, y] = lerp(ACCENT, ACCENT2, (x + y) / (2 * size))
    return img.convert("RGBA")

def card_stack(size, transparent):
    """The fanned 3-card stack. transparent=True -> no navy background (for the
    adaptive foreground layer); False -> composited over navy (full icon)."""
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0)) if transparent else navy_bg(size)
    grad = diagonal_grad(size)
    CW, CH, R = 430, 300, 46
    cards = [((size // 2 - CW // 2 + 70, 250), 90),
             ((size // 2 - CW // 2 + 35, 320), 165),
             ((size // 2 - CW // 2,      390), 255)]
    for (x0, y0), alpha in cards:
        x1, y1 = x0 + CW, y0 + CH
        d = ImageDraw.Draw(base)
        d.rounded_rectangle([x0 - 12, y0 - 12, x1 + 12, y1 + 12], radius=R + 10, fill=SEP)
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([x0, y0, x1, y1], radius=R, fill=alpha)
        base = Image.alpha_composite(base, Image.composite(grad, Image.new("RGBA", (size, size), (0, 0, 0, 0)), mask))
    fx0, fy0 = cards[2][0]
    d = ImageDraw.Draw(base)
    for i, w in enumerate((150, 96)):
        yy = fy0 + 200 + i * 40
        d.rounded_rectangle([fx0 + 48, yy, fx0 + 48 + w, yy + 20], radius=10, fill=(11, 15, 26, 200))
    return base

# --- icon-background.png: full-bleed navy (the adaptive background layer) ---
navy_bg(S).save(os.path.join(OUT, "icon-background.png"))

# --- icon-foreground.png: just the stack, centred in the adaptive safe zone ---
stack = card_stack(S, transparent=True)
bbox = stack.getbbox()
cropped = stack.crop(bbox)
target = int(S * 0.62)  # keep within the ~66% adaptive safe zone
scale = target / max(cropped.width, cropped.height)
cropped = cropped.resize((int(cropped.width * scale), int(cropped.height * scale)), Image.LANCZOS)
fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
fg.paste(cropped, ((S - cropped.width) // 2, (S - cropped.height) // 2), cropped)
fg.save(os.path.join(OUT, "icon-foreground.png"))

# --- icon-only.png: the full rounded desktop icon (legacy launchers) ---
shutil.copyfile(os.path.join(ROOT, "build", "icon.png"), os.path.join(OUT, "icon-only.png"))

# --- splash.png / splash-dark.png: navy field with the full icon centred ---
SP = 2732
for name in ("splash.png", "splash-dark.png"):
    canvas = navy_bg(SP)
    logo = Image.open(os.path.join(ROOT, "build", "icon.png")).convert("RGBA")
    L = 820
    logo = logo.resize((L, L), Image.LANCZOS)
    canvas.paste(logo, ((SP - L) // 2, (SP - L) // 2), logo)
    canvas.convert("RGB").save(os.path.join(OUT, name))

print("wrote assets/: icon-only, icon-foreground, icon-background, splash, splash-dark")
