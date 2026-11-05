"""
Makes a tiny font file holding only the letters of your Bangla name (and the
"বাংলা" language switch), so they look right on English pages without
downloading a ~200 KB Bengali font. Bangla pages load full fonts instead.

It also makes a lighter copy of Tiro Bangla (the Bangla heading font) with the
screen "hinting" removed: every Bangla letter is kept, the file is a third smaller.

Run it again if you change nameBangla in src/site.config.ts:
    pip install fonttools brotli
    python3 scripts/subset-bangla.py
"""
import pathlib, re
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

root = pathlib.Path(__file__).resolve().parent.parent
config = (root / 'src/site.config.ts').read_text(encoding='utf-8')
name = re.search(r"nameBangla:\s*'([^']*)'", config).group(1)
if not name:
    raise SystemExit('nameBangla is empty; nothing to do.')

source = root / 'node_modules/@fontsource-variable/noto-serif-bengali/files/noto-serif-bengali-bengali-wght-normal.woff2'
target = root / 'public/fonts/bangla-name.woff2'

font = TTFont(source)
font = instancer.instantiateVariableFont(font, {'wght': 400})   # one weight is enough
options = subset.Options()
options.layout_features = ['*']      # keep Bengali shaping (conjuncts, vowel signs)
options.flavor = 'woff2'
options.name_IDs = ['*']
subsetter = subset.Subsetter(options)
subsetter.populate(text=name + ' বাংলা')
subsetter.subset(font)
font.flavor = 'woff2'
font.save(target)
print(f'{target.relative_to(root)}: {target.stat().st_size:,} bytes for "{name}" and "বাংলা"')

# Tiro Bangla for Bangla pages: all Bengali letters and shaping kept, hinting removed (82 KB -> 53 KB)
tiro_source = root / 'node_modules/@fontsource/tiro-bangla/files/tiro-bangla-bengali-400-normal.woff2'
tiro_target = root / 'src/assets/fonts/tiro-bangla-bengali.woff2'
tiro = TTFont(tiro_source)
options = subset.Options()
options.layout_features = ['*']
options.flavor = 'woff2'
options.hinting = False
options.name_IDs = ['*']
options.notdef_outline = True
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=tiro.getBestCmap().keys())
subsetter.subset(tiro)
tiro.flavor = 'woff2'
tiro_target.parent.mkdir(parents=True, exist_ok=True)
tiro.save(tiro_target)
print(f'{tiro_target.relative_to(root)}: {tiro_target.stat().st_size:,} bytes')
