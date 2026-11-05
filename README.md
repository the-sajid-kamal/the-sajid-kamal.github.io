# thesajidkamal.me

Personal site of **Sajid Kamal**: brand builder, operator and founder in Dhaka.

Built with [Astro](https://astro.build) and designed to run on **Cloudflare Pages**, which is free, fast
and runs the contact form. It also still works on GitHub Pages.

- **What to replace before going live:** [CONTENT-GUIDE.md](CONTENT-GUIDE.md) lists every
  placeholder, plus colour palette and copy suggestions.
- **Placeholders are visible on purpose.** Text in [square brackets], the "SK" portrait, striped
  photo boxes and placeholder articles all show (in a muted colour) so you can see what is left to
  replace. Go live only once they are replaced; `?preview` outlines every one of them.
- **Where to put photos:** [src/assets/photos/README.md](src/assets/photos/README.md). Drop a file in with the right name; no code needed.
- **What has been built, and ideas for later:** [ROADMAP.md](ROADMAP.md).

---

## What's on the site

| Address | Page | Content comes from |
| --- | --- | --- |
| `/` | Home: hero, products band, "How I can help" tabs, work, numbers, story, principles, writing, testimonials | `src/pages/index.astro`, `src/data/home.ts`, `src/data/story.ts` |
| `/work/` | Project showcase with filters | every file in `src/content/work/` |
| `/work/<name>/` | Case study | `src/content/work/<name>.md` |
| `/writing/` | Essays, newest first | every file in `src/content/writing/` |
| `/writing/<name>/` | One essay | `src/content/writing/<name>.md` |
| `/about/` | Bio, story, experience, education, press kit | `src/pages/about.astro`, `src/data/career.ts`, `src/data/story.ts` |
| `/services/` | Consulting, advisory and speaking | `src/data/services.ts` (hide with `showServices: false`) |
| `/contact/` | Contact form with topics | `src/pages/contact.astro` |
| `/writing/feed.xml` | RSS feed | automatic |
| `/bn/`, `/bn/about/`, `/bn/services/`, `/bn/contact/` | Bangla version (the **বাংলা / EN** button switches) | `src/pages/bn/`, `src/data/bn.ts`, `src/i18n/ui.ts` |
| `/resume/` | Printable résumé (A4, "Print or save as PDF") | `src/data/career.ts` |
| `/one-pager/` | One-page summary, with a PDF download | `src/pages/one-pager.astro` → `npm run pdf` |
| `/card`, `/li`, `/r`… | Tracked short links (see below) | `src/data/links.ts` |
| `/sajid-kamal.vcf` | "Save contact" card for phones | `src/site.config.ts` |

Also automatic: a link-preview image for every page (`/og/<page>.png`), a Google profile tag
(Person), `sitemap-index.xml` with English/Bangla pairs, dark mode, smooth page transitions,
the floating WhatsApp button, share buttons and reduced-motion support.

## Where things live

```
src/site.config.ts        ← names, email, links, palette, WhatsApp, switches, analytics: start here
src/data/                 ← lists: story chapters, experience, services, numbers, testimonials
src/data/bn.ts            ← the Bangla versions of those lists
src/data/links.ts         ← tracked short links (/card, /li…)
src/i18n/ui.ts            ← menu, button and footer words in English and Bangla
src/content/work/         ← one Markdown file per project
src/content/writing/      ← one Markdown file per article
src/assets/photos/        ← your photos (picked up by file name)
src/components/           ← building blocks (header, cards, tabs...)
src/pages/                ← one file per page (src/pages/bn/ for Bangla)
src/styles/global.css     ← all styling, including the colour palettes
src/scripts/site.ts       ← menu, tabs, animations, contact form, share, dark mode
src/scripts/analytics.ts  ← event tracking and "where visitors came from"
src/lib/og.ts             ← draws the link-preview images
functions/api/contact.js  ← the contact form's email sender (Cloudflare)
public/                   ← files served as they are: CV, one-pager PDF, favicon, _redirects, _headers
scripts/                  ← tests, the one-pager PDF maker and the Bangla font tool
```

---

## Everyday tasks

### Publish an article

Create `src/content/writing/my-article.md` (the file name becomes `/writing/my-article/`):

```markdown
---
title: "What shoppers want from a honey brand"
dek: "One line under the title."
excerpt: "One or two sentences shown in lists and link previews."
date: 2026-12-01
topic: Brand building
---

Your first paragraph.

## A subheading

More text with **bold**, *italic* and [links](https://example.com).

> A line worth quoting.

![What the photo shows](../../assets/photos/writing/honey-shelf.jpg)
```

It appears on the Writing page, on the home page and in the RSS feed. Add `draft: true` to keep it
hidden while you work on it. For a cover photo, save `src/assets/photos/writing/my-article.jpg`.

### Add or change a project

Copy any file in `src/content/work/`, rename it and change the text. The top block controls the
card and the page header: `title`, `summary`, `client`, `role`, `year`, `category` (used by the
filter buttons), `art` (the big number on the card until it has a photo), `metrics`, `gallery`
and `quote`. `featured: true` puts it on the home page (the first four, by `order`).

Photos: `src/assets/photos/work/<file name>.jpg` for the cover, and `<file name>-1.jpg`, `-2.jpg`
for the gallery.

### Other quick changes

| To change | Edit |
| --- | --- |
| Name, email, phone, links, booking link, palette | `src/site.config.ts` |
| Hide the Services page | `showServices: false` in `src/site.config.ts` |
| Story chapters (home and About) | `src/data/story.ts` |
| Career timeline, education, certifications, skills | `src/data/career.ts` |
| "How I can help" tabs, numbers, principles, testimonials, product band | `src/data/home.ts` |
| Services, formats, prices, FAQ | `src/data/services.ts` |
| CV | replace `public/MD-Sajid-Kamal-CV.pdf` (same name) |
| Link-preview image | replace `public/og/share-card.png` (1200 × 630) |
| Bangla name | `nameBangla` in `src/site.config.ts`, then run `npm run fonts:bangla` (needs `pip install fonttools brotli`) to rebuild the 2 KB font that draws it |
| WhatsApp number or greeting | `whatsapp` in `src/site.config.ts` (`floating: false` removes the corner button) |
| Show the newsletter box | `showNewsletter: true` in `src/site.config.ts` (and `newsletterUrl`) |
| Show the intro video | `video.show: true` and `video.youtubeId` in `src/site.config.ts` |

### The Bangla version

The **বাংলা** button in the header opens the same page in Bangla (and **EN** goes back). Home,
About, Services and Contact are translated; case studies and essays stay in English, and the
Bangla pages say so. Search engines get both versions, linked to each other (`hreflang`).

- Page text: `src/pages/bn/*.astro`. Lists (story, experience, services, FAQ…): `src/data/bn.ts`.
  Menu, buttons, footer and form words: `src/i18n/ui.ts`.
- The Bangla is a **draft translation**: read it through and adjust it in your own voice.
- When you change a fact in English (a number, a job), change it in `src/data/bn.ts` too.
- Visitors whose phone or browser is set to Bangla see a one-time hint offering the Bangla page.
- Bangla pages use their own fonts (Tiro Bangla for headings, Noto Sans Bengali for text), which
  load only on Bangla pages, so English pages stay as light as before.

### The one-pager and the printable résumé

`/resume/` is your CV as a web page, laid out for A4: visitors press **Print or save as PDF**.
It is built from `src/data/career.ts`, so it is always in step with the About page. Your own
designed CV (`public/MD-Sajid-Kamal-CV.pdf`) stays as the main download.

`/one-pager/` puts everything important on one page. Its **Download PDF** button serves
`public/Sajid-Kamal-One-Pager.pdf`. After changing the page (or your photo or numbers), make a
fresh PDF:

```sh
npm run build && npm run pdf     # needs Playwright once: npx playwright install chromium
```

(Or open `/one-pager/` in Chrome, press Print, choose *Save as PDF* and replace the file.)
Both pages carry a QR code that leads back to the site, tagged so you can see visits from paper.

### Short links and QR codes

`thesajidkamal.me/<short>` forwards to the site with tracking tags, so analytics shows exactly
what brought each visit. Put them on business cards, slides, your email signature and profiles:

| Link | Use it on | Shows up in analytics as |
| --- | --- | --- |
| `/card` | business card (or its QR code) | source `business-card` |
| `/li` | the website field on LinkedIn | source `linkedin`, campaign `profile` |
| `/fb` | Facebook | source `facebook` |
| `/sig` | email signature | source `email-signature` |
| `/talk` | the last slide of a talk or class | source `talk` |
| `/r`, `/op` | QR codes on the résumé and one-pager | source `resume`, `one-pager` |
| `/bangla` | the Bangla home page | campaign `bangla` |
| `/cv`, `/wa` | straight to the CV, or a WhatsApp chat | (not tracked: they leave the site) |

Add your own in `src/data/links.ts`.

### Sharing

Every page has its own link-preview image, drawn at build time in the site's fonts and colours
(case studies show their headline number). Case studies, essays and the one-pager also have
share buttons: the phone's own share sheet where available, LinkedIn, WhatsApp, Facebook, X,
email and copy link. Shared links carry tags (`utm_source=linkedin&utm_medium=social&utm_campaign=share`),
so you can see which network sends people.

---

## Previewing

**Owner preview (any browser).** Add `?preview` to any address, e.g. `https://thesajidkamal.me/?preview`.
A small bar lets you switch palettes and press **Placeholders** to outline every stand-in on the
page. It is remembered while the tab is open; × closes it. Visitors never see the bar.

Articles still marked `placeholder: true` are kept out of search engines, the sitemap and the RSS
feed, so nothing unfinished gets indexed even if the site goes live early. Delete that line when an
article is real.

**On your computer.** Install [Node.js](https://nodejs.org) 22, then:

```sh
npm install
npm run dev            # live preview at http://localhost:4321
npm run build          # build the finished site into dist/
npm run cf:preview     # run the built site the way Cloudflare does, contact form included
npm run test:contact   # test the contact form's email sender
```

---

## Hosting on Cloudflare Pages (recommended)

Free, fast in Bangladesh and worldwide, and it runs the contact form without a third-party form service.

1. **Create the project.** In the [Cloudflare dashboard](https://dash.cloudflare.com):
   Workers & Pages → Create → Pages → *Connect to Git* → choose this repository.
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   Cloudflare reads the Node version from `.node-version`. Every branch gets its own preview address,
   so you can check a branch before merging it.
2. **Contact form email.** Create a free account at [resend.com](https://resend.com) and an API key.
   In the Pages project: Settings → Variables and Secrets, add:
   - `RESEND_API_KEY` (secret): your Resend key
   - `CONTACT_TO_EMAIL`: `sajidkamal214@gmail.com`
   - `CONTACT_FROM_EMAIL` (optional): e.g. `Website <hello@thesajidkamal.me>`, after verifying
     the domain in Resend. Until then, messages come from Resend's test sender.
   Redeploy, then send yourself a test message from `/contact/`.
3. **Spam protection (optional).** Create a Turnstile widget in Cloudflare. Put the *site key*
   in `src/site.config.ts` → `contactForm.turnstileSiteKey`, and the *secret key* in Pages as
   `TURNSTILE_SECRET_KEY`.
4. **Your domain.** Add `thesajidkamal.me` to Cloudflare (free plan) and switch the nameservers at
   your registrar to the two Cloudflare gives you. Then in the Pages project: Custom domains →
   add `thesajidkamal.me` and `www.thesajidkamal.me`.
5. **Stop GitHub Pages publishing.** In GitHub: Settings → Secrets and variables → Actions →
   Variables → add `DEPLOY_TARGET` = `cloudflare`. Optionally turn off Settings → Pages.

`public/_redirects` sends old links (like the previous CV address) to the right place, and
`public/_headers` adds security headers. Both only work on Cloudflare.

### Staying on GitHub Pages instead

Merging into `main` keeps publishing to GitHub Pages through `.github/workflows/pages.yml`, as
before. The one difference is the contact form: GitHub Pages can't run `functions/api/contact.js`,
so set `contactForm.endpoint` in `src/site.config.ts` to a form service address (Formspree, Web3Forms
or FormSubmit's `/ajax/` address). The form understands their replies.

### Why not Framer?

Framer is a good no-code builder with great animation, but sites are built inside Framer's own
editor, so this code can't be imported into it. It also costs about $10–30 a month for a custom
domain. This site gives you the same polish for free, with your content in plain files you own.
If you'd rather edit visually later, the design here can be rebuilt in Framer.

---

## A professional email address

`hello@thesajidkamal.me` looks more established to investors and clients than a Gmail address,
and costs nothing on Cloudflare: Email Routing (in the Cloudflare dashboard for your domain) forwards it to
your Gmail. To reply from it, add it in Gmail under Settings → Accounts → *Send mail as*.
Then change `email` in `src/site.config.ts`.

## Analytics and tracking

**Tools.** Google Tag Manager, Umami and Microsoft Clarity are on (IDs in `src/site.config.ts`;
set one to `''` to switch it off). There are slots for Google Analytics 4 (only if it isn't
already inside Tag Manager), the Meta Pixel (Facebook/Instagram retargeting), the LinkedIn Insight
Tag and Cloudflare Web Analytics, plus Google and Bing Search Console verification codes. The
footer's privacy note lists whichever tools are on. Analytics never load in `npm run dev`, or in a
build made with `PUBLIC_ANALYTICS=off npm run build`, so your own previews don't count.

**Speed.** Umami and Cloudflare are tiny and start straight away, so every visit is counted. The
heavier tools wait until the page has loaded and the browser is idle, or until the visitor first
taps, scrolls or types, so they never slow the first view. Events from before then are queued.

**Events.** Each one goes to every tool that is on (Umami events, the Tag Manager `dataLayer`,
GA4, Clarity, Meta). Most are picked up automatically from clicks, so new links are covered too.
Each carries the page, the language and where on the page it happened (`zone`: header, hero,
cta-band, footer, floating-whatsapp…).

| Event | When |
| --- | --- |
| `cv_download`, `one_pager_download`, `vcard_download` | CV, one-pager or contact card downloaded |
| `resume_print`, `print` | the résumé (or any page) is printed or saved as PDF |
| `whatsapp_click`, `email_click`, `phone_click`, `booking_click` | someone starts a conversation |
| `contact_start`, `contact_submit`, `contact_error` | the contact form is begun, sent, or fails |
| `share` (`network`), `copy` | a share button or "copy" is used |
| `outbound_click` (`host`) | a link to another site, e.g. LinkedIn |
| `audience_tab`, `work_filter`, `language_switch`, `theme_toggle`, `video_play`, `newsletter_click` | choices on the page |
| `scroll_depth` (25/50/75/100), `read_complete`, `engaged` (30 s, 2 min) | how far and how long people read |
| `not_found` | someone lands on a missing page (with the address they came from) |

In Meta and GA4, `contact_submit` also counts as a lead, and WhatsApp, email and phone clicks as
contacts, so ads can optimise for them. In Tag Manager, add a *Custom Event* trigger for the event
names you care about and send them to GA4. To watch events live, open any page with
`?debug-analytics` and look in the browser console (`?debug-analytics=off` stops it).

**Where visitors came from.** The site remembers the campaign tags (`utm_…`), the site that sent
the visitor, their first page and how many pages they read. Contact-form emails end with a
*How they found you* section, e.g. *Source: linkedin / social (campaign: share) · First page:
/work/sui-chokri/ · Pages viewed this visit: 4*.

Pages change without a full reload, for smooth transitions. Umami, GA4 and Clarity track this
automatically; in Google Tag Manager, use a *History Change* trigger for page views.

## Checks

Every push runs `.github/workflows/pages.yml`: it installs, tests the contact function and builds
the site. A red cross on GitHub means something needs fixing before it goes live.

Last audit (Lighthouse 13.5, compressed as on Cloudflare, analytics off): desktop 100 for
performance, accessibility, best practices and SEO, in English and Bangla; phone performance
92–98 in English and 90 in Bangla (which loads its own fonts), with 100 for everything else.
