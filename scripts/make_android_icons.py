"""Generate the source images @capacitor/assets needs for Android adaptive icons
+ splash, matching the desktop archive-folder icon. Outputs into assets/:
  icon-only.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png
Artwork lives in icon_design.py (shared with the desktop icon generator).
Run make_icon.py first — this reuses build/icon.png for icon-only + splash."""
import os, sys, shutil
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icon_design import gradient_bg, draw_archive

S = 1024
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

# --- icon-background.png: full-bleed gradient (the adaptive background layer) ---
gradient_bg(S).save(os.path.join(OUT, "icon-background.png"))

# --- icon-foreground.png: just the folder mark, centred in the adaptive safe zone ---
motif = draw_archive(S, transparent=True)
bbox = motif.getbbox()
cropped = motif.crop(bbox)
target = int(S * 0.62)  # keep within the ~66% adaptive safe zone
scale = target / max(cropped.width, cropped.height)
cropped = cropped.resize((int(cropped.width * scale), int(cropped.height * scale)), Image.LANCZOS)
fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
fg.paste(cropped, ((S - cropped.width) // 2, (S - cropped.height) // 2), cropped)
fg.save(os.path.join(OUT, "icon-foreground.png"))

# --- icon-only.png: the full rounded desktop icon (legacy launchers) ---
shutil.copyfile(os.path.join(ROOT, "build", "icon.png"), os.path.join(OUT, "icon-only.png"))

# --- splash.png / splash-dark.png: blue-purple field with the full icon centred ---
SP = 2732
for name in ("splash.png", "splash-dark.png"):
    canvas = gradient_bg(SP)
    logo = Image.open(os.path.join(ROOT, "build", "icon.png")).convert("RGBA")
    L = 820
    logo = logo.resize((L, L), Image.LANCZOS)
    canvas.paste(logo, ((SP - L) // 2, (SP - L) // 2), logo)
    canvas.convert("RGB").save(os.path.join(OUT, name))

print("wrote assets/: icon-only, icon-foreground, icon-background, splash, splash-dark")
