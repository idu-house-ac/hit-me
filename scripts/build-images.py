#!/usr/bin/env python3
"""Build responsive images for the HIT ME pitch page.

Usage:
  python3 scripts/build-images.py              # from originals in images/src/
  python3 scripts/build-images.py --placeholders  # flat stand-ins when originals are missing

Originals go in images/src/ as apartment.jpg, office.jpg, kitchen.jpg, casings.jpg, alley.jpg
(1792 x 1024). Output lands in images/ as <name>-<width>.jpg and .webp at the widths listed in
index.html, plus images/og.jpg (1200 x 630, from alley.jpg) for link previews.
Requires Pillow: pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "src"
OUT = ROOT / "images"
NAMES = ["apartment", "office", "kitchen", "casings", "alley"]
WIDTHS = [640, 1024, 1536, 1792]
JPG_Q, WEBP_Q = 82, 78
PANEL = (17, 27, 29)  # #111B1D


def write_sizes(name: str, img: Image.Image) -> None:
    img = img.convert("RGB")
    for w in WIDTHS:
        h = round(img.height * w / img.width)
        r = img.resize((w, h), Image.LANCZOS) if w < img.width else img.copy()
        r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=JPG_Q, optimize=True, progressive=True)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=WEBP_Q, method=6)
        print(f"  {name}-{w}: jpg {(OUT / f'{name}-{w}.jpg').stat().st_size // 1024} KB, "
              f"webp {(OUT / f'{name}-{w}.webp').stat().st_size // 1024} KB")


def write_og(img: Image.Image) -> None:
    img = img.convert("RGB")
    target = 1200 / 630
    w, h = img.size
    if w / h > target:
        nw = round(h * target); box = ((w - nw) // 2, 0, (w - nw) // 2 + nw, h)
    else:
        nh = round(w / target); box = (0, (h - nh) // 2, w, (h - nh) // 2 + nh)
    img.crop(box).resize((1200, 630), Image.LANCZOS).save(OUT / "og.jpg", "JPEG", quality=82, optimize=True)
    print("  og.jpg written")


def main() -> int:
    OUT.mkdir(exist_ok=True)
    placeholders = "--placeholders" in sys.argv
    missing = [n for n in NAMES if not (SRC / f"{n}.jpg").exists()]
    if missing and not placeholders:
        print("Missing originals in images/src/: " + ", ".join(f"{n}.jpg" for n in missing))
        print("Add them, or run with --placeholders for flat stand-ins.")
        return 1
    for n in NAMES:
        src = SRC / f"{n}.jpg"
        if src.exists():
            print(f"{n}: from {src.relative_to(ROOT)}")
            img = Image.open(src)
        else:
            print(f"{n}: PLACEHOLDER (flat panel color)")
            img = Image.new("RGB", (1792, 1024), PANEL)
            ImageDraw.Draw(img).rectangle((0, 0, 1791, 1023), outline=(36, 56, 58), width=4)
        write_sizes(n, img)
        if n == "alley":
            write_og(img)
    return 0


if __name__ == "__main__":
    sys.exit(main())
