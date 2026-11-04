# thesajidkamal.me

Personal site of **Sajid Kamal**: brand builder, operator and founder in Dhaka.

Built with [Astro](https://astro.build) and designed to run on **Cloudflare Pages**, which is free, fast
and runs the contact form. It also still works on GitHub Pages.

- **What to replace before going live:** [CONTENT-GUIDE.md](CONTENT-GUIDE.md) lists every
  placeholder, plus colour palette and copy suggestions.
- **Where to put photos:** [src/assets/photos/README.md](src/assets/photos/README.md). Drop a file in with the right name; no code needed.

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

Also automatic: link previews (Open Graph), a Google profile tag (Person), `sitemap-index.xml`,
dark mode, smooth page transitions and reduced-motion support.

## Where things live

```
src/site.config.ts        ← names, email, links, palette, booking link, analytics: start here
src/data/                 ← lists: story chapters, experience, services, numbers, testimonials
src/content/work/         ← one Markdown file per project
src/content/writing/      ← one Markdown file per article
src/assets/photos/        ← your photos (picked up by file name)
src/components/           ← building blocks (header, cards, tabs...)
src/pages/                ← one file per page
src/styles/global.css     ← all styling, including the colour palettes
src/scripts/site.ts       ← menu, tabs, fade-ins, contact form, dark mode
functions/api/contact.js  ← the contact form's email sender (Cloudflare)
public/                   ← files served as they are: CV, favicon, share image, _redirects, _headers
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

---

## Previewing

**Owner preview (any browser).** Add `?preview` to any address, e.g. `https://thesajidkamal.me/?preview`.
A small bar lets you switch palettes and outline every placeholder. Only you see it; × closes it.

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

## Analytics and privacy

Google Tag Manager, Umami and Microsoft Clarity load on every page (IDs in `src/site.config.ts`;
set one to `''` to switch it off). Cloudflare Web Analytics, which is free and cookie-free, can be
added with its token. The footer carries the visitor notice Microsoft recommends for Clarity.

Pages change without a full reload, for smooth transitions. Umami and Clarity track this
automatically; in Google Tag Manager, use a *History Change* trigger for page views.

## Checks

Every push runs `.github/workflows/pages.yml`: it installs, tests the contact function and builds
the site. A red cross on GitHub means something needs fixing before it goes live.
