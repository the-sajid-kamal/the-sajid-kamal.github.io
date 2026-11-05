// Link-preview images (1200 × 630) drawn at build time with Satori, in the site's own
// fonts and colours. One per page; see src/pages/og/[slug].png.ts for the list.
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../site.config';

export interface Card {
  kicker: string;
  title: string; // wrap words in *asterisks* for the accent italic
  value?: string; // big figure in the arch (defaults to the monogram)
  label?: string;
}

const palettes = {
  terracotta: { bg: '#F6F1E9', ink: '#1F1B16', muted: '#6B6257', line: '#DDD3C3', accent: '#A3402A', soft: '#F0DCD1' },
  bottle: { bg: '#F3F2EC', ink: '#15211C', muted: '#5C6862', line: '#D6D9CD', accent: '#1E5A43', soft: '#DCE8E0' },
  indigo: { bg: '#F4F4F0', ink: '#131A2B', muted: '#5B6377', line: '#D8DBE3', accent: '#3140A6', soft: '#E0E3F4' },
};

const file = (pkg: string, name: string) => readFileSync(join(process.cwd(), 'node_modules', pkg, 'files', name));
let fonts: any[] | undefined;
const loadFonts = () =>
  (fonts ??= [
    { name: 'Newsreader', data: file('@fontsource/newsreader', 'newsreader-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Newsreader', data: file('@fontsource/newsreader', 'newsreader-latin-400-italic.woff'), weight: 400, style: 'italic' },
    { name: 'Newsreader', data: file('@fontsource/newsreader', 'newsreader-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Inter', data: file('@fontsource/inter', 'inter-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Inter', data: file('@fontsource/inter', 'inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
  ]);

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (style: Record<string, unknown>, children?: unknown): Node => ({ type: 'div', props: { style: { display: 'flex', boxSizing: 'border-box', ...style }, children } });

export async function renderCard({ kicker, title, value, label }: Card): Promise<Buffer> {
  const c = palettes[site.palette] ?? palettes.terracotta;
  const plain = title.replace(/\*/g, '');
  const size = plain.length > 78 ? 52 : plain.length > 56 ? 60 : plain.length > 36 ? 70 : 84;

  // One flex item per word, so accent words can be italic and coloured
  let em = false;
  const words = title.split(/\s+/).map((word) => {
    const starts = word.startsWith('*');
    const ends = word.replace(/[.,!?’”]+$/, '').endsWith('*');
    if (starts) em = true;
    const node = el({ marginRight: size * 0.24, fontStyle: em ? 'italic' : 'normal', color: em ? c.accent : c.ink }, word.replace(/\*/g, ''));
    if (ends) em = false;
    return node;
  });

  const monogram = !value;
  const big = value ?? 'SK';
  const bigSize = monogram ? 150 : big.length > 5 ? 74 : big.length > 3 ? 96 : 122;

  const tree = el({ width: 1200, height: 630, position: 'relative', background: c.bg, fontFamily: 'Inter', color: c.ink }, [
    // Arch, with its offset outline
    el({ position: 'absolute', right: 96, top: 92, width: 318, height: 446, border: `2px solid ${c.accent}`, opacity: 0.5, borderRadius: '159px 159px 14px 14px' }),
    el({ position: 'absolute', right: 74, top: 70, width: 318, height: 446, background: c.soft, borderRadius: '159px 159px 14px 14px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px' }, [
      el({ fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: bigSize, lineHeight: 1, letterSpacing: -2, color: c.accent }, big),
      ...(label ? [el({ marginTop: 18, fontSize: 21, lineHeight: 1.35, color: c.muted, textAlign: 'center', justifyContent: 'center' }, label)] : []),
    ]),
    // Words
    el({ position: 'absolute', left: 76, top: 70, width: 660, height: 490, flexDirection: 'column', justifyContent: 'space-between' }, [
      el({ flexDirection: 'column' }, [
        el({ alignItems: 'center', fontSize: 20, fontWeight: 600, letterSpacing: 3.2, textTransform: 'uppercase', color: c.muted }, [
          el({ width: 34, height: 2, background: c.accent, marginRight: 16 }),
          kicker,
        ]),
        el({ flexWrap: 'wrap', marginTop: 34, fontFamily: 'Newsreader', fontSize: size, lineHeight: 1.06, letterSpacing: -1.2 }, words),
      ]),
      el({ alignItems: 'baseline', paddingTop: 22, borderTop: `1px solid ${c.line}` }, [
        el({ fontFamily: 'Newsreader', fontWeight: 500, fontSize: 34 }, [site.name, el({ color: c.accent }, '.')]),
        el({ marginLeft: 22, fontSize: 19, fontWeight: 500, color: c.muted }, site.url.replace(/^https?:\/\//, '')),
      ]),
    ]),
  ]);

  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 92 }).toBuffer();
}
