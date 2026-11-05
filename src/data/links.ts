// =====================================================================
//  Short links: thesajidkamal.me/<slug> sends people on to the site,
//  tagged so analytics shows which business card, slide, profile or
//  printout brought them. Add your own: { slug, to, note }.
// =====================================================================
import { site } from '../site.config';
import { whatsappHref } from '../lib/util';

const tagged = (source: string, medium: string, campaign: string, path = '/') =>
  `${path}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;

export const shortLinks = [
  { slug: 'card', to: tagged('business-card', 'print', 'card'), note: 'Business card (print this address or its QR code)' },
  { slug: 'r', to: tagged('resume', 'print', 'resume-qr'), note: 'QR code on the printed résumé' },
  { slug: 'op', to: tagged('one-pager', 'print', 'one-pager-qr'), note: 'QR code on the one-pager' },
  { slug: 'li', to: tagged('linkedin', 'social', 'profile'), note: 'Website link on your LinkedIn profile' },
  { slug: 'fb', to: tagged('facebook', 'social', 'profile'), note: 'Website link on Facebook' },
  { slug: 'sig', to: tagged('email-signature', 'email', 'signature'), note: 'Your email signature' },
  { slug: 'talk', to: tagged('talk', 'offline', 'slides'), note: 'Last slide of a talk or class' },
  { slug: 'bangla', to: tagged('short-link', 'referral', 'bangla', '/bn/'), note: 'The Bangla home page' },
  { slug: 'cv', to: site.cv, note: 'Straight to the CV (PDF)' },
  ...(site.whatsapp.number ? [{ slug: 'wa', to: whatsappHref('en', ''), note: 'Opens a WhatsApp chat with you' }] : []),
];
