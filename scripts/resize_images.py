#!/usr/bin/env python3
"""
Resize `assets/hero.jpg` into multiple widths for responsive `srcset`.
Usage: python3 scripts/resize_images.py
Requires: Pillow (pip install pillow)
"""
from PIL import Image
from pathlib import Path

def resize_image(src_path, widths=(480, 768, 1200), quality=85):
    src = Path(src_path)
    if not src.exists():
        raise SystemExit(f"Source image not found: {src}")
    img = Image.open(src)
    for w in widths:
        h = int(w * img.height / img.width)
        out = src.parent / f"{src.stem}-{w}{src.suffix}"
        img.resize((w, h), Image.LANCZOS).save(out, optimize=True, quality=quality)
        print(f"Wrote: {out} ({w}x{h})")

if __name__ == '__main__':
    resize_image('assets/hero.jpg')
