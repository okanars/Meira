#!/usr/bin/env python3
"""
Esans koku piramidi görsellerini siteye hazırlar (isteğe bağlı bakım aracı; Pillow gerekir: pip install pillow).

Kaynak: koku_piramitleri/<KOD> <AD>.jpeg (müşteriden gelen ham görseller, git'e girmez)
Çıktı:  site/images/essences/<kod>.jpg       en uzun kenar 1200 px
        site/images/essences/<kod>.webp      aynı boyut
        site/images/essences/w640/<kod>.webp en uzun kenar 640 px
Ayrıca her görselin renk paletini yazdırır (products.js ESSENCES palette alanı için).

Yapılanlar: belge ekran görüntüsü olan görsellerde çerçeve ve silinmiş başlık kırpılır (CROPS), krem zemin
beyaza dengelenir, beyaz kenar boşlukları kırpılıp eşit pay bırakılır, kenarlar beyaza yumuşatılır
(sayfada görsel, renkli zeminle "çarpma" karışımıyla kaynaşır; renkli zeminli görsellerde sert kenar kalmaz).

Kullanım: python3 tools/esans-gorselleri.py
Aynı görseli kullanan esanslar (müşteri aynı dosyayı göndermiş) products.js'te aynı img anahtarını kullanır.
"""
import colorsys
import glob
import os
import re
import sys
import unicodedata

from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'koku_piramitleri')
OUT = os.path.join(ROOT, 'site', 'images', 'essences')

# Belge ekran görüntüleri: (sol, üst, sağ, alt) piksel; çerçeve çizgileri ve bulanıklaştırılmış başlık dışarıda kalır
CROPS = {
    'non007': (8, 48, 592, 416),
    'non023': (10, 36, 600, 402),
    'non026': (16, 71, 604, 428),
}
# Birebir aynı dosyalar: yalnızca ilki işlenir
SAME_AS = {'non018': 'non014', 'ntr001': 'non014', 'ntr005': 'non014', 'non024': 'non008'}

MAX = 1200
SMALL = 640


def key_of(filename):
    # macOS dosya adları ayrışık Unicode olabilir ("İ" = I + birleşik nokta): aksanlar atılır
    base = os.path.splitext(os.path.basename(filename))[0].replace('ı', 'i')
    base = ''.join(c for c in unicodedata.normalize('NFKD', base) if not unicodedata.combining(c))
    m = re.match(r'([A-Za-z]+)\s*-?\s*(\d+)', base)
    return f'{m.group(1).lower()}{m.group(2)}' if m else None


def white_balance(im):
    """Krem zemini beyaza çeker: kenar piksellerinin ortancası referans alınır."""
    w, h = im.size
    px = im.load()
    border = [px[x, y] for x in range(0, w, 3) for y in (2, h - 3)] + [px[x, y] for y in range(0, h, 3) for x in (2, w - 3)]
    ref = [sorted(c[i] for c in border)[len(border) // 2] for i in range(3)]
    if min(ref) > 246:
        return im
    lut = []
    for i in range(3):
        g = 255.0 / max(ref[i], 1)
        lut += [min(255, round(v * g)) for v in range(256)]
    return im.point(lut)


def trim(im, thresh=238, pad_ratio=0.035):
    """Beyaz kenar boşluğunu kırpar ve her yana eşit beyaz pay bırakır."""
    gray = im.convert('L')
    # Neredeyse beyaz olmayan pikseller; tekil gürültü küçük bir medyan süzgeciyle atılır
    mask = gray.point(lambda v: 255 if v < thresh else 0).filter(ImageFilter.MedianFilter(5))
    box = mask.getbbox()
    if not box:
        return im
    im = im.crop(box)
    w, h = im.size
    pad = round(max(w, h) * pad_ratio)
    out = Image.new('RGB', (w + 2 * pad, h + 2 * pad), (255, 255, 255))
    out.paste(im, (pad, pad))
    return out


def feather(im, ratio=0.045):
    """Kenarları beyaza yumuşatır (renkli zeminli görsellerde sert dikdörtgen kalmasın)."""
    w, h = im.size
    band = max(4, round(min(w, h) * ratio))
    alpha = Image.new('L', (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        dy = min(y, h - 1 - y)
        for x in range(w):
            d = min(dy, x, w - 1 - x)
            if d < band:
                t = d / band
                ap[x, y] = round(255 * (t * t * (3 - 2 * t)))
    white = Image.new('RGB', (w, h), (255, 255, 255))
    return Image.composite(im, white, alpha)


def fit(im, size):
    w, h = im.size
    k = min(1.0, size / max(w, h))
    return im.resize((round(w * k), round(h * k)), Image.LANCZOS) if k < 1 else im


def palette(im, n=4):
    """Beyaz ve gri olmayan piksellerden baskın renkler (doygunluk ağırlıklı)."""
    small = fit(im, 160)
    raw = small.tobytes()
    px = [p for p in zip(raw[0::3], raw[1::3], raw[2::3]) if min(p) < 225]
    if not px:
        return []
    q = Image.new('RGB', (len(px), 1))
    q.putdata(px)
    q = q.quantize(colors=10, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    counts = sorted(q.getcolors(), reverse=True)
    cols = []
    for count, idx in counts:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        cols.append((count * (0.25 + ss), (r, g, b), round(hh * 360), round(ss * 100), round(ll * 100)))
    cols.sort(reverse=True)
    return cols[:n]


def main():
    os.makedirs(os.path.join(OUT, 'w640'), exist_ok=True)
    files = sorted(glob.glob(os.path.join(SRC, '*.jp*g')))
    if not files:
        sys.exit(f'Kaynak görsel yok: {SRC}')
    done = set()
    for f in files:
        key = key_of(f)
        if not key or key in SAME_AS or key in done:
            continue
        done.add(key)
        im = Image.open(f).convert('RGB')
        if key in CROPS:
            im = im.crop(CROPS[key])
        im = white_balance(im)
        im = trim(im)
        im = feather(im)
        big = fit(im, MAX)
        big.save(os.path.join(OUT, f'{key}.jpg'), quality=84, optimize=True, progressive=True)
        big.save(os.path.join(OUT, f'{key}.webp'), quality=80, method=6)
        fit(im, SMALL).save(os.path.join(OUT, 'w640', f'{key}.webp'), quality=80, method=6)
        cols = palette(big)
        hexes = ['#%02X%02X%02X' % c[1] for c in cols]
        hues = [f'{c[2]}°/{c[3]}%/{c[4]}%' for c in cols]
        print(f'{key:7} {big.size[0]}x{big.size[1]}  {" ".join(hexes)}  ({", ".join(hues)})')


if __name__ == '__main__':
    main()
