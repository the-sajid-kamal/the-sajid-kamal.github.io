"""
Makes a tiny font file holding only the letters of your Bangla name, so the
signature looks right everywhere without downloading a ~200 KB Bengali font.

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
subsetter.populate(text=name)
subsetter.subset(font)
font.flavor = 'woff2'
font.save(target)
print(f'{target.relative_to(root)}: {target.stat().st_size:,} bytes for "{name}"')
