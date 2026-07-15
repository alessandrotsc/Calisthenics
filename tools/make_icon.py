#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
App-Icon Generator fuer den Calisthenics-Tracker.

Design-Familie Syncrate (wie Instrumente/Sprachen-App):
- Dunkles Marineblau als weicher radialer Verlauf
- Akzent Tuerkis/Cyan als Verlauf, glossy, weiche Schatten und Glow

Motiv: minimalistische Front-Lever-Silhouette an einer Stange.
Ein Athlet haengt waagerecht (Koerper gerade nach links), Arme zur Stange oben.
"""

import math
from PIL import Image, ImageDraw, ImageFilter, ImageChops

SS = 4
BASE = 1024
R = BASE * SS
OUT_DIR = "/Users/alessandro/Desktop/Privat/Calisthenics/assets"

NAVY_OUT = (8, 31, 52)
NAVY_MID = (18, 64, 99)
NAVY_DEEP = (5, 20, 34)
CYAN = (46, 203, 224)
CYAN_LIGHT = (127, 227, 238)
CYAN_DARK = (18, 176, 205)
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(len(a)))


def make_background(size):
    cx, cy = size * 0.5, size * 0.42
    small = max(256, size // 6)
    tmp = Image.new("RGB", (small, small))
    tp = tmp.load()
    scx, scy = small * 0.5, small * 0.42
    smaxd = math.hypot(small * 0.62, small * 0.62)
    for y in range(small):
        for x in range(small):
            d = min(1.0, math.hypot(x - scx, y - scy) / smaxd)
            if d < 0.75:
                c = lerp(NAVY_MID, NAVY_OUT, d / 0.75)
            else:
                c = lerp(NAVY_OUT, NAVY_DEEP, (d - 0.75) / 0.25)
            tp[x, y] = c
    bg = tmp.resize((size, size), Image.LANCZOS)

    rings = Image.new("L", (size, size), 0)
    rd = ImageDraw.Draw(rings)
    for i, rr in enumerate([0.30, 0.46, 0.62]):
        rad = size * rr
        rd.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=int(70 - i * 16), width=int(size * 0.010))
    rings = rings.filter(ImageFilter.GaussianBlur(size * 0.02))
    glowcol = Image.new("RGB", (size, size), lerp(NAVY_MID, CYAN_DARK, 0.15))
    bg = Image.composite(glowcol, bg, rings.point(lambda v: int(v * 0.55)))
    return bg.convert("RGBA")


def vertical_gradient(size, top, bottom):
    grad = Image.new("RGB", (1, size))
    gp = grad.load()
    for y in range(size):
        gp[0, y] = lerp(top, bottom, y / max(1, size - 1))
    return grad.resize((size, size), Image.NEAREST).convert("RGBA")


def cap_line(draw, p0, p1, w, fill=255):
    """Linie mit runden Enden."""
    draw.line([p0, p1], fill=fill, width=int(w))
    r = w / 2
    for p in (p0, p1):
        draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=fill)


def build_motif_mask(size):
    s = size
    m = Image.new("L", (s, s), 0)
    d = ImageDraw.Draw(m)

    # Stange (Bar) oben, waagerecht
    bar_y = s * 0.290
    bar_h = s * 0.050
    d.rounded_rectangle([s * 0.255, bar_y - bar_h / 2, s * 0.760, bar_y + bar_h / 2],
                        radius=bar_h * 0.5, fill=255)

    # Griffpunkte an der Stange
    grip1 = (s * 0.610, bar_y + bar_h * 0.2)
    grip2 = (s * 0.685, bar_y + bar_h * 0.2)
    # Schulter
    shoulder = (s * 0.615, s * 0.560)
    # Arme (Stange -> Schulter)
    cap_line(d, grip1, shoulder, s * 0.052)
    cap_line(d, grip2, shoulder, s * 0.052)

    # Koerper waagerecht nach links (Rumpf)
    body_top = s * 0.520
    body_bot = s * 0.610
    d.rounded_rectangle([s * 0.235, body_top, s * 0.625, body_bot],
                        radius=(body_bot - body_top) * 0.5, fill=255)

    # Beine (leicht schmaler, weiter nach links, minimale Neigung)
    hip = (s * 0.300, s * 0.565)
    foot = (s * 0.150, s * 0.545)
    cap_line(d, hip, foot, s * 0.070)

    # Kopf (rechts, nahe Schulter)
    hr = s * 0.070
    hx, hy = s * 0.690, s * 0.560
    d.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=255)

    return m


def render_motif(size):
    mask = build_motif_mask(size)

    glow_mask = mask.filter(ImageFilter.GaussianBlur(size * 0.045))
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow.paste(Image.new("RGBA", (size, size), CYAN + (255,)), (0, 0), glow_mask.point(lambda v: int(v * 0.85)))

    shadow_mask = mask.filter(ImageFilter.GaussianBlur(size * 0.02))
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    off = int(size * 0.012)
    tmp = Image.new("L", (size, size), 0)
    tmp.paste(shadow_mask, (off, off))
    shadow.paste(Image.new("RGBA", (size, size), (2, 12, 22, 255)), (0, 0), tmp.point(lambda v: int(v * 0.55)))

    grad = vertical_gradient(size, CYAN_LIGHT, CYAN_DARK)
    body = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    body.paste(grad, (0, 0), mask)

    topfade = Image.new("L", (size, size))
    tp = topfade.load()
    for y in range(size):
        v = max(0, 255 - int((y / size) * 420))
        for x in range(size):
            tp[x, y] = v
    gloss_alpha = ImageChops.multiply(mask, topfade)
    gloss = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gloss.paste(Image.new("RGBA", (size, size), WHITE + (255,)), (0, 0), gloss_alpha.point(lambda v: int(v * 0.28)))

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    for layer in (glow, shadow, body, gloss):
        out = Image.alpha_composite(out, layer)
    return out


def render_master(maskable=False):
    size = R
    bg = make_background(size)
    motif = render_motif(size)
    if maskable:
        scale = 0.80
        ms = int(size * scale)
        motif_small = motif.resize((ms, ms), Image.LANCZOS)
        off = (size - ms) // 2
        bg.alpha_composite(motif_small, (off, off))
        return bg
    return Image.alpha_composite(bg, motif)


def rounded(img, radius_frac=0.225):
    size = img.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius_frac), fill=255)
    out = img.copy()
    out.putalpha(mask)
    return out


def main():
    print("Rendere Master ...")
    master = render_master(False)
    for name, target, round_it in [("icon-512.png", 512, True), ("icon-192.png", 192, True), ("icon-180.png", 180, True)]:
        img = master.resize((target, target), Image.LANCZOS)
        if round_it:
            img = rounded(img)
        img.save(f"{OUT_DIR}/{name}")
        print("  gespeichert:", name)
    print("Rendere Maskable ...")
    render_master(True).resize((512, 512), Image.LANCZOS).convert("RGBA").save(f"{OUT_DIR}/icon-512-maskable.png")
    print("Fertig.")


if __name__ == "__main__":
    main()
