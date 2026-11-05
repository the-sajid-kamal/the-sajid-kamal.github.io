// Link-preview images: /og/<page>.png, one for every page, drawn at build time.
// Bangla pages use the image of their English twin.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard, type Card } from '../../lib/og';
import { site } from '../../site.config';

export const getStaticPaths = (async () => {
  const pages: [string, Card][] = [
    ['home', { kicker: `${site.roles.join(' · ')}`, title: 'I build brands people *reach for*.' }],
    ['about', { kicker: 'About', title: 'Hello, I’m Sajid. I build brands people *reach for*.' }],
    ['work', { kicker: 'Selected work', title: 'Brands, launches and *one startup*.', value: '6', label: 'years of FMCG work in Bangladesh' }],
    ['writing', { kicker: 'Writing', title: 'Notes from *the shelf*.' }],
    ['services', { kicker: 'Services', title: 'Practical help for brands that want to *grow*.' }],
    ['contact', { kicker: 'Contact', title: 'Let’s *talk*.' }],
    ['resume', { kicker: 'Résumé', title: `${site.fullName}: ${site.role}, FMCG brand strategist`, value: '3', label: 'brands built from scratch' }],
    ['one-pager', { kicker: 'One-pager', title: 'Sajid Kamal *at a glance*.', value: '140%', label: 'annual sales growth at Ghorer Bazar' }],
    ['404', { kicker: 'Error 404', title: 'This page isn’t *on the shelf*.' }],
  ];
  for (const p of await getCollection('work')) {
    pages.push([`work-${p.id}`, { kicker: p.data.category, title: p.data.title, value: p.data.art.value, label: p.data.art.label }]);
  }
  for (const p of await getCollection('writing', (post) => !post.data.draft)) {
    pages.push([`writing-${p.id}`, { kicker: `Essay · ${p.data.topic}`, title: p.data.title }]);
  }
  return pages.map(([slug, card]) => ({ params: { slug }, props: card }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props as Card)), { headers: { 'Content-Type': 'image/png' } });
