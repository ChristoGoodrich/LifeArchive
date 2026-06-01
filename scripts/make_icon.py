"""Generate RealityGit's app icon: a git-branch graph in the app's blue->purple
gradient on a dark rounded square. Outputs build/icon.ico (multi-size) + icon.png."""
import os
from PIL import Image, ImageDraw

S = 1024  # master resolution
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "build")
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = (110, 168, 254)   # #6ea8fe
ACCENT2 = (157, 123, 255)  # #9d7bff
BG_TOP = (18, 24, 38)      # #121826
BG_BOT = (8, 11, 18)       # #080b12

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# 1) dark vertical-gradient background
bg = Image.new("RGB", (S, S))
px = bg.load()
for y in range(S):
    c = lerp(BG_TOP, BG_BOT, y / S)
    for x in range(S):
        px[x, y] = c

# 2) diagonal blue->purple gradient (for filling the graph via mask)
grad = Image.new("RGB", (S, S))
gpx = grad.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S)
        gpx[x, y] = lerp(ACCENT, ACCENT2, t)

# 3) mask: draw the git graph in white
mask = Image.new("L", (S, S), 0)
d = ImageDraw.Draw(mask)
lw = 70  # line width

def line(p0, p1, w=lw):
    d.line([p0, p1], fill=255, width=w)
    for p in (p0, p1):  # round the joints
        d.ellipse([p[0]-w//2, p[1]-w//2, p[0]+w//2, p[1]+w//2], fill=255)

def node(cx, cy, r=95):
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=255)          # solid node
    d.ellipse([cx-r+34, cy-r+34, cx+r-34, cy+r-34], fill=0)  # punch a ring hole

# main branch (vertical) with two commit nodes
mx = 360
top, bot = 250, 774
line((mx, top), (mx, bot))
# feature branch curving off to the right with its own node
fork_y = 512
bx, by = 690, 360
d.line([(mx, fork_y), (bx, by)], fill=255, width=lw)
d.ellipse([mx-lw//2, fork_y-lw//2, mx+lw//2, fork_y+lw//2], fill=255)
d.ellipse([bx-lw//2, by-lw//2, bx+lw//2, by+lw//2], fill=255)
node(mx, top)
node(mx, bot)
node(bx, by)

# 4) composite gradient graph onto bg
icon = bg.convert("RGBA")
grad_rgba = grad.convert("RGBA")
icon.paste(grad_rgba, (0, 0), mask)

# 5) round the outer corners (transparent)
corner = Image.new("L", (S, S), 0)
ImageDraw.Draw(corner).rounded_rectangle([0, 0, S-1, S-1], radius=int(S*0.22), fill=255)
icon.putalpha(corner)

# 6) export
png_path = os.path.join(OUT_DIR, "icon.png")
ico_path = os.path.join(OUT_DIR, "icon.ico")
icon.save(png_path)
icon.save(ico_path, sizes=[(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)])
print("wrote", png_path)
print("wrote", ico_path)
