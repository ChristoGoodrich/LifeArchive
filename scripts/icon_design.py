"""Shared icon artwork for Life Archive.

The brand mark is the SAME glyph the app shows on its splash screen and in the
top bar (index.html `.splash-logo` / `.logo`): three rounded cards stacked with a
small down-left fan, filled with the blue->violet brand gradient (#4f8bff ->
#8a63ff) at rising opacity (back .30 / mid .58 / front 1.0), sitting on a light
frosted-glass tile. Keeping the launcher icon identical to the splash mark means
the icon the user taps and the frame they see on open read as one thing.

Used by both make_icon.py (Windows .ico/.png) and make_android_icons.py (Android
adaptive icons + splash). Pure PIL, so it rasterizes cleanly at any size.
"""
import math
from PIL import Image, ImageDraw, ImageFilter

# --- brand gradient for the cards (matches the splash SVG linearGradient) ---
CARD_A = (79, 139, 255)     # #4f8bff brand blue   (gradient top-left of each card)
CARD_B = (138, 99, 255)     # #8a63ff brand violet (gradient bottom-right of each card)
# --- light frosted tile the cards sit on (matches the splash `.splash-logo` tile) ---
FIELD_TOP = (246, 248, 255)  # cool near-white, top
FIELD_BOT = (231, 235, 251)  # faint lavender, bottom
GLOW = (96, 124, 255)        # subtle brand glow behind the mark (echoes the splash radial)
SHADOW = (42, 52, 120)       # soft indigo used for the cards' drop shadows

# How wide the glyph's bounding box is relative to the icon (the rest is tile margin).
GLYPH_FRAC = 0.52

# The splash SVG cards, in its 0..24 viewBox: (x, y, w, h, opacity).
# Fans down-left toward the front; the front card is lower-left and a touch taller.
_CARDS = [
    (7.0, 4.0, 13.0, 8.5, 0.30),
    (5.5, 6.4, 13.0, 8.5, 0.58),
    (4.0, 8.8, 13.0, 10.6, 1.00),
]
_RX = 2.7          # card corner radius in viewBox units
_GLYPH_W = 16.0    # glyph bbox width  in viewBox units (x 4..20)
_GLYPH_H = 15.4    # glyph bbox height in viewBox units (y 4..19.4)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def _vgrad(size, top, bot):
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        c = lerp(top, bot, y / size)
        for x in range(size):
            px[x, y] = c
    return img.convert("RGBA")


def _radial(size, cx, cy, radius, color, peak, falloff=2.0):
    """A soft radial overlay (alpha peak at center -> 0 at `radius`)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    cx, cy, radius = cx * size, cy * size, radius * size
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - cx, y - cy) / radius
            if d < 1:
                a = int(peak * (1 - d) ** falloff)
                if a > 0:
                    px[x, y] = color + (a,)
    return img


def _diag_tile(w, h, c0, c1):
    """A diagonal (top-left -> bottom-right) gradient rectangle, opaque RGBA."""
    img = Image.new("RGB", (w, h))
    px = img.load()
    dw, dh = max(1, w - 1), max(1, h - 1)
    for y in range(h):
        ty = y / dh
        for x in range(w):
            px[x, y] = lerp(c0, c1, (x / dw + ty) / 2)
    return img.convert("RGBA")


def gradient_bg(size):
    """The light frosted-glass field the cards sit on (also the Android adaptive
    background layer + splash background, so every surface matches the splash tile)."""
    base = _vgrad(size, FIELD_TOP, FIELD_BOT)
    glow = _radial(size, 0.5, 0.40, 0.70, GLOW, peak=22, falloff=2.1)
    return Image.alpha_composite(base, glow)


def diagonal_grad(size):
    """Light diagonal sheen (kept for backwards compatibility)."""
    return _diag_tile(size, size, FIELD_TOP, FIELD_BOT)


def draw_archive(size, transparent=False):
    """Draw the splash card-stack mark.

    transparent=True  -> just the cards on a clear canvas (Android adaptive foreground)
    transparent=False -> the cards over the light frosted tile (Windows / legacy icon)
    """
    S = size
    base = Image.new("RGBA", (S, S), (0, 0, 0, 0)) if transparent else gradient_bg(S)
    u = GLYPH_FRAC * S / _GLYPH_W          # viewBox unit -> px
    R = max(2, int(round(_RX * u)))
    # center the glyph's bounding box (x 4..20, y 4..19.4) in the icon
    offx = (S - _GLYPH_W * u) / 2.0 - 4.0 * u
    offy = (S - _GLYPH_H * u) / 2.0 - 4.0 * u
    drop = int(round(0.016 * S))
    blur = int(round(0.014 * S))
    rim_w = max(2, int(round(0.0045 * S)))
    for (vx, vy, vw, vh, op) in _CARDS:
        x0 = int(round(vx * u + offx)); y0 = int(round(vy * u + offy))
        w = int(round(vw * u)); h = int(round(vh * u))
        x1, y1 = x0 + w, y0 + h
        # soft drop shadow beneath (depth / floating), fainter for the back cards
        sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle(
            [x0, y0 + drop, x1, y1 + drop], radius=R, fill=SHADOW + (int(85 * op),))
        base = Image.alpha_composite(base, sh.filter(ImageFilter.GaussianBlur(blur)))
        # the card: blue->violet gradient, made translucent by this card's opacity so
        # the cards behind show through (the layered-glass read of the splash mark)
        tile = _diag_tile(w, h, CARD_A, CARD_B)
        m = Image.new("L", (w, h), 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=R, fill=int(round(255 * op)))
        tile.putalpha(m)
        card = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        card.paste(tile, (x0, y0))
        base = Image.alpha_composite(base, card)
        # faint white top/edge rim (light refraction), also scaled by opacity
        rim = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        ImageDraw.Draw(rim).rounded_rectangle(
            [x0, y0, x1 - 1, y1 - 1], radius=R, outline=(255, 255, 255, int(round(150 * op))), width=rim_w)
        base = Image.alpha_composite(base, rim)
    return base
