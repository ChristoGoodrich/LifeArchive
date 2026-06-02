"""Shared icon artwork for Life Archive.

The brand mark is a filed **archive folder** — a tabbed folder holding a few
record lines — rendered in the app's light blue->purple gradient on a bright
blue->purple field. Used by both make_icon.py (Windows .ico) and
make_android_icons.py (Android adaptive icons + splash) so every platform's
icon stays identical. Pure-PIL, no SVG, so it rasterizes cleanly at any size.
"""
from PIL import Image, ImageDraw

# bright background gradient (top -> bottom)
BG_TOP = (76, 135, 255)    # #4c87ff
BG_BOT = (115, 84, 238)    # #7354ee
# light gradient that fills the folder (diagonal)
ACCENT = (182, 221, 255)   # #b6ddff
ACCENT2 = (206, 191, 255)  # #cebfff
# deep navy used for the folder edge + record lines (so it reads on the bg)
SEP = (44, 70, 165)        # #2c46a5


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_bg(size):
    """Full-bleed vertical blue->purple background."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        c = lerp(BG_TOP, BG_BOT, y / size)
        for x in range(size):
            px[x, y] = c
    return img.convert("RGBA")


def diagonal_grad(size):
    """Light diagonal gradient used to fill the folder."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            px[x, y] = lerp(ACCENT, ACCENT2, (x + y) / (2 * size))
    return img.convert("RGBA")


def draw_archive(size, transparent=False):
    """Draw the archive-folder mark.

    transparent=True  -> just the mark on a clear canvas (Android adaptive foreground)
    transparent=False -> the mark over the bright blue->purple background
    """
    S = size
    base = Image.new("RGBA", (S, S), (0, 0, 0, 0)) if transparent else gradient_bg(S)
    grad = diagonal_grad(S)

    # folder geometry: a tab on the upper-left, the body below (classic folder)
    body = [int(.17 * S), int(.40 * S), int(.83 * S), int(.79 * S)]
    # tab bottom runs well into the body so their left edges merge (no seam notch)
    tab = [int(.17 * S), int(.305 * S), int(.49 * S), int(.50 * S)]
    rb, rt = int(.058 * S), int(.042 * S)
    pad = int(.020 * S)

    # navy edge (the folder silhouette, slightly dilated) so it pops on the bg
    d = ImageDraw.Draw(base)
    d.rounded_rectangle([tab[0] - pad, tab[1] - pad, tab[2] + pad, tab[3] + pad], radius=rt + pad, fill=SEP)
    d.rounded_rectangle([body[0] - pad, body[1] - pad, body[2] + pad, body[3] + pad], radius=rb + pad, fill=SEP)

    # the folder itself: tab + body merged, filled with the diagonal gradient
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle(tab, radius=rt, fill=255)
    md.rounded_rectangle(body, radius=rb, fill=255)
    base = Image.alpha_composite(base, Image.composite(grad, Image.new("RGBA", (S, S), (0, 0, 0, 0)), mask))

    # filed record lines on the folder (decreasing width + fading = many entries)
    d = ImageDraw.Draw(base)
    lx = int(.30 * S)
    lh = int(.05 * S)
    for w, yy, a in ((int(.40 * S), int(.535 * S), 225),
                     (int(.31 * S), int(.625 * S), 170),
                     (int(.22 * S), int(.715 * S), 120)):
        d.rounded_rectangle([lx, yy, lx + w, yy + lh], radius=lh // 2, fill=(SEP[0], SEP[1], SEP[2], a))
    return base
