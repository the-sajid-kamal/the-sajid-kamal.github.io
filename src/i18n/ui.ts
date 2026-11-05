// =====================================================================
//  Words used around the site (menus, buttons, footer, form) in English
//  and Bangla. Bangla page text lives in src/pages/bn/ and src/data/bn.ts.
//  The Bangla is a DRAFT TRANSLATION: read it through and adjust it.
// =====================================================================

export type Lang = 'en' | 'bn';

export const locales: Record<Lang, string> = { en: 'en-GB', bn: 'bn-BD' };

/** English pages that also have a Bangla version at /bn/… */
export const translatedPaths = ['/', '/about/', '/services/', '/contact/'];

const isBnPath = (path: string) => /^\/bn(\/|$)/.test(path);
export const getLang = (url: URL): Lang => (isBnPath(url.pathname) ? 'bn' : 'en');

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

/** The same page in the other language, or null when the page exists in one language only. */
export function counterpart(pathname: string): { lang: Lang; href: string } | null {
  const path = withSlash(pathname);
  if (isBnPath(path)) return { lang: 'en', href: path.replace(/^\/bn/, '') || '/' };
  return translatedPaths.includes(path) ? { lang: 'bn', href: `/bn${path}` } : null;
}

/** A site link in the given language. Pages without a Bangla version stay in English. */
export function localHref(lang: Lang, href: string): string {
  if (lang !== 'bn' || !href.startsWith('/')) return href;
  const [, path = '/', rest = ''] = href.match(/^([^?#]*)(.*)$/) ?? [];
  return translatedPaths.includes(withSlash(path)) ? `/bn${withSlash(path)}${rest}` : href;
}

/** 2024 → ২০২৪ on Bangla pages */
export const digits = (lang: Lang, value: string | number) =>
  lang === 'bn' ? String(value).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]) : String(value);

export const ui = {
  en: {
    skip: 'Skip to content',
    nav: { work: 'Work', writing: 'Writing', about: 'About', services: 'Services', contact: 'Contact', home: 'Home' },
    workWithMe: 'Work with me',
    menu: 'Menu',
    mainNav: 'Main',
    themeToggle: 'Switch between light and dark theme',
    langSwitch: { label: 'বাংলা', aria: 'বাংলা: এই সাইট বাংলায় পড়ুন (read in Bangla)' },
    cta: {
      eyebrow: 'Let’s talk',
      title: 'Let’s build something people <em>reach for</em>.',
      text: 'Hiring for a brand role, launching a product, backing a founder or planning an event? Tell me what you’re working on.',
      book: 'Book a 30-minute call',
      linkedin: 'Connect on LinkedIn',
      whatsapp: 'Message on WhatsApp',
      cv: 'Download CV',
    },
    footer: {
      about: (role: string, company: string) => `${role} at ${company}. Building food and beauty brands in Bangladesh, and writing about what it takes.`,
      explore: 'Explore',
      elsewhere: 'Elsewhere',
      contact: 'Contact',
      rss: 'RSS feed',
      cv: 'Download CV (PDF)',
      onePager: 'One-pager (PDF)',
      resume: 'Printable résumé',
      clock: 'in Dhaka right now',
      rights: 'All rights reserved.',
      made: 'Made in Dhaka.',
      top: 'Back to top',
      privacy: (tools: string, clarity: boolean) =>
        `This site uses ${tools} to understand how visitors use it.` +
        (clarity ? ' Clarity records clicks, scrolling and session replays. By using this site, you agree that Microsoft and I can collect and use this data. See the <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener">Microsoft Privacy Statement</a>.' : ''),
    },
    form: {
      name: 'Name',
      email: 'Email',
      topic: 'What is it about?',
      organisation: 'Organisation',
      optional: '(optional)',
      message: 'Message',
      send: 'Send message',
      topics: { hiring: 'A role or hiring', consulting: 'Consulting or advisory', venture: 'Investment or a venture', speaking: 'Speaking or media', other: 'Something else' },
    },
    share: { label: 'Share', native: 'Share…', copy: 'Copy link', email: 'Email' },
    whatsapp: { label: 'Message me on WhatsApp', short: 'WhatsApp' },
    video: { play: 'Play video', placeholder: 'Intro video placeholder · add a YouTube ID in site.config.ts' },
    englishOnly: 'in English',
  },
  bn: {
    skip: 'মূল অংশে যান',
    nav: { work: 'কাজ', writing: 'লেখা', about: 'পরিচয়', services: 'সেবা', contact: 'যোগাযোগ', home: 'প্রথম পাতা' },
    workWithMe: 'যোগাযোগ',
    menu: 'মেনু',
    mainNav: 'প্রধান',
    themeToggle: 'লাইট ও ডার্ক থিম বদলান',
    langSwitch: { label: 'EN', aria: 'EN: read in English (ইংরেজিতে পড়ুন)' },
    cta: {
      eyebrow: 'চলুন কথা বলি',
      title: 'চলুন এমন কিছু গড়ি, যা মানুষ <em>বেছে নেয়</em>।',
      text: 'ব্র্যান্ডের জন্য লোক খুঁজছেন, নতুন পণ্য আনছেন, কোনো উদ্যোক্তার পাশে দাঁড়াতে চান, বা ইভেন্টের পরিকল্পনা করছেন? কী নিয়ে কাজ করছেন, জানান।',
      book: '৩০ মিনিটের কল বুক করুন',
      linkedin: 'লিংকডইনে যুক্ত হোন',
      whatsapp: 'হোয়াটসঅ্যাপে মেসেজ দিন',
      cv: 'সিভি ডাউনলোড',
    },
    footer: {
      about: () => 'ঘরের বাজারের ব্র্যান্ড ম্যানেজার। বাংলাদেশে খাদ্য ও সৌন্দর্য পণ্যের ব্র্যান্ড গড়ি, আর লিখি সেই পথের কথা।',
      explore: 'ঘুরে দেখুন',
      elsewhere: 'অন্যান্য জায়গায়',
      contact: 'যোগাযোগ',
      rss: 'RSS ফিড',
      cv: 'সিভি ডাউনলোড (PDF)',
      onePager: 'এক পাতায় পরিচিতি (PDF)',
      resume: 'প্রিন্টযোগ্য রেজিউমে',
      clock: 'ঢাকায় এখন',
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
      made: 'ঢাকায় তৈরি।',
      top: 'ওপরে যান',
      privacy: (tools: string, clarity: boolean) =>
        `ভিজিটররা সাইটটি কীভাবে ব্যবহার করেন, তা বুঝতে এখানে ${tools} ব্যবহার করা হয়।` +
        (clarity ? ' Clarity ক্লিক, স্ক্রল ও সেশন রিপ্লে রেকর্ড করে। এই সাইট ব্যবহার করে আপনি Microsoft ও আমাকে এই ডেটা সংগ্রহ ও ব্যবহারের সম্মতি দিচ্ছেন। বিস্তারিত: <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener">Microsoft Privacy Statement</a>।' : ''),
    },
    form: {
      name: 'নাম',
      email: 'ইমেইল',
      topic: 'বিষয় কী?',
      organisation: 'প্রতিষ্ঠান',
      optional: '(ঐচ্ছিক)',
      message: 'বার্তা',
      send: 'বার্তা পাঠান',
      topics: { hiring: 'চাকরি বা নিয়োগ', consulting: 'কনসাল্টিং বা অ্যাডভাইজরি', venture: 'বিনিয়োগ বা নতুন উদ্যোগ', speaking: 'বক্তৃতা বা গণমাধ্যম', other: 'অন্য কোনো বিষয়' },
    },
    share: { label: 'শেয়ার করুন', native: 'শেয়ার…', copy: 'লিংক কপি করুন', email: 'ইমেইল' },
    whatsapp: { label: 'হোয়াটসঅ্যাপে মেসেজ দিন', short: 'হোয়াটসঅ্যাপ' },
    video: { play: 'ভিডিও চালান', placeholder: 'পরিচিতি ভিডিওর জায়গা · site.config.ts-এ YouTube ID দিন' },
    englishOnly: 'ইংরেজিতে',
  },
};

export const t = (lang: Lang) => ui[lang];
