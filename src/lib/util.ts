import { site } from '../site.config';

/** Text written as "[Placeholder ...]" or "[...]" is a stand-in for you to replace. */
export const isPlaceholder = (text?: string | null) => !!text && text.trim().startsWith('[');

/** Turns the shortcuts used in data files into real links. */
export function resolveHref(href: string): string {
  if (href === 'cv') return site.cv;
  if (href === 'booking') return site.bookingUrl || '/contact/?topic=consulting#message';
  if (href === 'email') return `mailto:${site.email}`;
  return href;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);

export function formatDate(date: Date, style: 'long' | 'short' = 'long') {
  return date.toLocaleDateString('en-GB', {
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
