import { site } from '../site.config';
import { localHref, locales, type Lang } from '../i18n/ui';

/** Text written as "[Placeholder ...]" or "[...]" is a stand-in for you to replace. */
export const isPlaceholder = (text?: string | null) => !!text && text.trim().startsWith('[');

/** Turns the shortcuts used in data files into real links (in the page's language). */
export function resolveHref(href: string, lang: Lang = 'en'): string {
  if (href === 'cv') return site.cv;
  if (href === 'booking') return site.bookingUrl || localHref(lang, '/contact/?topic=consulting#message');
  if (href === 'email') return `mailto:${site.email}`;
  if (href === 'whatsapp') return whatsappHref(lang);
  return localHref(lang, href);
}

/** WhatsApp chat link with the greeting from site.config.ts already typed in */
export function whatsappHref(lang: Lang = 'en', text = site.whatsapp.message[lang]) {
  return `https://wa.me/${site.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);

export function formatDate(date: Date, style: 'long' | 'short' = 'long', lang: Lang = 'en') {
  return date.toLocaleDateString(locales[lang], {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
}

export function readingTime(markdown = '') {
  const words = markdown.replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/** Canonical address of a page, e.g. https://thesajidkamal.me/work/sui-chokri/ */
export const absolute = (path: string) => new URL(path, site.url).href;

/** Link-preview image made for each page at build time (src/pages/og/[slug].png.ts) */
export function shareImageFor(pathname: string) {
  const path = pathname.replace(/^\/bn(?=\/|$)/, '') || '/';
  const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
  return `/og/${slug}.png`;
}
