// "Save contact": a contact card (vCard) that phones add to their address book in one tap.
// Built from src/site.config.ts, so it is always up to date.
import type { APIRoute } from 'astro';
import { site } from '../site.config';

const esc = (value: string) => value.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1');

export const GET: APIRoute = () => {
  const [given, family] = [site.fullName.replace(/\s+\S+$/, ''), site.fullName.split(/\s+/).pop() ?? ''];
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(site.fullName)}`,
    `ORG:${esc(site.company)}`,
    `TITLE:${esc(site.role)}`,
    `EMAIL;TYPE=INTERNET,PREF:${site.email}`,
    site.phone && `TEL;TYPE=CELL,VOICE:${site.phone.replace(/[^+\d]/g, '')}`,
    `URL:${site.url}`,
    site.profiles.linkedin && `X-SOCIALPROFILE;TYPE=linkedin:${site.profiles.linkedin}`,
    'ADR;TYPE=WORK:;;;Dhaka;;;Bangladesh',
    `NOTE:${esc(`${site.roles.join(' · ')}. ${site.url.replace(/^https?:\/\//, '')}`)}`,
    'END:VCARD',
  ].filter(Boolean);
  return new Response(lines.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } });
};
