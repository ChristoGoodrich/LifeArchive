"""Shared icon artwork for Life Archive.

The brand mark is a fanned stack of saved-state cards (the "archive" — layered
snapshots of life), drawn as translucent frosted-glass cards with a glossy
"liquid glass" sheen, soft depth shadows and bright refraction edges, over a
luminous blue->purple field. Used by both make_icon.py (Windows .ico/.png) and
make_android_icons.py (Android adaptive icons + splash) so every platform's icon
matches. Pure PIL, so it rasterizes cleanly at any size.
"""
import math
from PIL import Image, ImageDraw, ImageFilter

# Premium background: a clean, refined blue->violet read on the diagonal, lit by a
# soft top-left highlight and grounded by a gentle bottom-right vignette (so the field
# has depth instead of a flat wash). Pulled toward the brand's blue->purple identity
# (less cyan / less navy-black than before) for a simpler, higher-end feel.
BG_TL = (88, 156, 255)      # bright brand blue, top-left light source
BG_BR = (98, 52, 196)       # rich royal violet, bottom-right
# Flat backdrop: one clean blue->violet brand color (≈ the average of the two stops above),
# used instead of a busy diagonal gradient + radial gloss + vignette. Flatter & cleaner; the
# glass card stack keeps its frosted look on top.
BG_FLAT = (108, 119, 226)
# frosted-glass card gradient (top -> bottom)
CARD_TOP = (242, 247, 255)  # clean near-white
CARD_BOT = (210, 216, 255)  # soft lavender
SHADOW = (22, 26, 74)       # deep indigo used for the soft drop shadows + vignette


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


def gradient_bg(size):
    """Flat, clean brand-color field. (Was a diagonal blue->violet gradient with a radial
    top-left gloss + bottom-right vignette — flattened per the 'logo 底色更扁平干净' ask.)"""
    return Image.new("RGBA", (size, size), BG_FLAT + (255,))


def diagonal_grad(size):
    """Light diagonal sheen (kept for backwards compatibility)."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            px[x, y] = lerp(CARD_TOP, CARD_BOT, (x + y) / (2 * size))
    return img.convert("RGBA")


def _white_sheen(S, x0, y0, x1, y1, peak=145):
    """A white vertical gradient (alpha peak->0 over y0..y1) — the glassy gloss."""
    img = Image.new("RGBA", (S, S), (255, 255, 255, 0))
    px = img.load()
    h = max(1, y1 - y0)
    for y in range(max(0, y0), min(S, y1)):
        a = int(peak * (1 - (y - y0) / h))
        if a <= 0:
            continue
        for x in range(max(0, x0), min(S, x1)):
            px[x, y] = (255, 255, 255, a)
    return img


def draw_archive(size, transparent=False):
    """Draw the liquid-glass card-stack mark.

    transparent=True  -> just the cards on a clear canvas (Android adaptive foreground)
    transparent=False -> the cards over the luminous blue->purple background
    """
    S = size
    base = Image.new("RGBA", (S, S), (0, 0, 0, 0)) if transparent else gradient_bg(S)
    clear = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cardgrad = _vgrad(S, CARD_TOP, CARD_BOT)
    R = int(.052 * S)
    CW, CH = int(.455 * S), int(.30 * S)
    cx = S // 2
    # 3 fanned cards, back (up-right, faint) -> front (down-left, near-solid).
    # alpha < 255 keeps them translucent so the card behind shows through = glass.
    cards = [
        (cx - CW // 2 + int(.070 * S), int(.235 * S), 150),
        (cx - CW // 2 + int(.033 * S), int(.305 * S), 202),
        (cx - CW // 2 - int(.005 * S), int(.375 * S), 242),
    ]
    rim_w = max(2, int(.0035 * S))
    for (x0, y0, alpha) in cards:
        x1, y1 = x0 + CW, y0 + CH
        box = [x0, y0, x1, y1]
        # soft drop shadow beneath (depth / floating)
        sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle(
            [x0, y0 + int(.018 * S), x1, y1 + int(.018 * S)], radius=R, fill=SHADOW + (135,))
        sh = sh.filter(ImageFilter.GaussianBlur(int(.014 * S)))
        base = Image.alpha_composite(base, sh)
        # translucent frosted-glass fill
        mask = Image.new("L", (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle(box, radius=R, fill=alpha)
        base = Image.alpha_composite(base, Image.composite(cardgrad, clear, mask))
        # restrained gloss over the top ~50%, clipped to the card shape (calmer than a
        # full liquid-glass sheen for a cleaner, more premium read)
        sheen = _white_sheen(S, x0, y0, x1, y0 + int(CH * 0.50), peak=104)
        base = Image.alpha_composite(base, Image.composite(sheen, clear, mask))
        # subtle bright top/edge rim (light refraction)
        ImageDraw.Draw(base).rounded_rectangle(box, radius=R, outline=(255, 255, 255, 92), width=rim_w)
    return base
