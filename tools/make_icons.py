"""Generate Zucchinator app icons (PWA + Apple touch) with PIL.

Draws a friendly 'terminator zucchini': a green zucchini on a dark rounded
background with a single glowing red robot eye. Pure PIL, no external assets.
"""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def vgrad(size, top, bottom):
    base = Image.new("RGB", (size, size), top)
    d = ImageDraw.Draw(base)
    for y in range(size):
        t = y / (size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        d.line([(0, y), (size, y)], fill=(r, g, b))
    return base


def draw_icon(size):
    S = size * 4  # supersample
    img = vgrad(S, (18, 32, 26), (10, 18, 16))
    d = ImageDraw.Draw(img, "RGBA")

    # zucchini body: a fat rounded diagonal capsule
    cx, cy = S * 0.5, S * 0.54
    length = S * 0.62
    width = S * 0.30
    angle = math.radians(-35)
    dx, dy = math.cos(angle), math.sin(angle)
    ax, ay = cx - dx * length / 2, cy - dy * length / 2
    bx, by = cx + dx * length / 2, cy + dy * length / 2

    def capsule(draw, x1, y1, x2, y2, w, fill):
        draw.line([(x1, y1), (x2, y2)], fill=fill, width=int(w))
        r = w / 2
        draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=fill)
        draw.ellipse([x2 - r, y2 - r, x2 + r, y2 + r], fill=fill)

    # shadow
    capsule(d, ax + S * 0.01, ay + S * 0.02, bx + S * 0.01, by + S * 0.02, width * 1.06, (0, 0, 0, 90))
    # body
    capsule(d, ax, ay, bx, by, width, (86, 168, 74, 255))
    # highlight streak
    hx, hy = -dy, dx  # perpendicular
    off = width * 0.22
    capsule(d, ax + hx * off, ay + hy * off, bx + hx * off, by + hy * off, width * 0.30, (150, 214, 120, 200))

    # stem at top-left end
    sx, sy = ax - dx * width * 0.15, ay - dy * width * 0.15
    capsule(d, sx, sy, sx - dx * S * 0.06 + hx * S * 0.02, sy - dy * S * 0.06 + hy * S * 0.02,
            width * 0.22, (74, 122, 60, 255))

    # glowing red robot eye near the top end
    ex, ey = ax + dx * width * 0.55 + hx * width * 0.05, ay + dy * width * 0.55 + hy * width * 0.05
    er = width * 0.20
    for gr, alpha in [(er * 2.2, 60), (er * 1.5, 110)]:
        d.ellipse([ex - gr, ey - gr, ex + gr, ey + gr], fill=(255, 60, 40, alpha))
    d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=(255, 70, 50, 255))
    d.ellipse([ex - er * 0.4, ey - er * 0.4, ex + er * 0.2, ey + er * 0.2], fill=(255, 200, 180, 255))

    img = img.resize((size, size), Image.LANCZOS)
    return img


def save(size, name, rounded=True, radius_frac=0.22):
    icon = draw_icon(size)
    if rounded:
        mask = rounded_mask(size, int(size * radius_frac))
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(icon, (0, 0), mask)
    else:
        out = icon.convert("RGBA")
    out.save(os.path.join(OUT, name))
    print("wrote", name)


save(512, "icon-512.png", rounded=True)
save(192, "icon-192.png", rounded=True)
# iOS applies its own mask, so keep the touch icon square (no transparency)
save(180, "apple-touch-icon.png", rounded=False)
# maskable-friendly (safe area): same art, iOS ignores, Android uses
save(512, "maskable-512.png", rounded=False)
print("done")
