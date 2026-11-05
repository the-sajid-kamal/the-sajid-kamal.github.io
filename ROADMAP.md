# What's done, and what could come next

Everything below is on the `claude/astro-cloudflare-redesign` branch. `main` is untouched until
you merge. Placeholders stay visible on purpose: replace them before going live
(see [CONTENT-GUIDE.md](CONTENT-GUIDE.md)).

## Done

### Site and story
- Rebuilt in Astro for Cloudflare Pages (still works on GitHub Pages). Fast, with no framework
  code shipped to visitors.
- Pages:
  - **Home:** hero, products band, "How I can help" tabs for employers, investors, clients and
    organisers, featured work, the numbers band, story, principles, writing, testimonials.
  - **Work:** six case studies and a filterable showcase.
  - **Writing:** essays and an RSS feed.
  - **About:** story, experience, education, skills and a press kit.
  - **Services:** offers, formats, process and FAQ.
  - **Contact:** a form that works on Cloudflare, with topics.
  - **404:** a not-found page.
- Three colour palettes with dark mode, all passing WCAG AA contrast.
- **Owner preview:** add `?preview` to any address to switch palettes and outline every placeholder.
- The contact form emails you through Resend, with a spam trap and optional Turnstile.

### Added in this round
- **Bangla version:** home, About, Services and Contact at `/bn/`, with a **বাংলা / EN** switch in
  the header.
  - It keeps you on the same page when you switch.
  - Text uses Bangla digits (০১, ১৪০%) and a Bangla clock.
  - Bangla-specific fonts load only on Bangla pages.
  - Search engines get the two versions linked to each other (hreflang tags and the sitemap).
  - Visitors whose phone or browser is set to Bangla get a one-time hint.
- **WhatsApp:**
  - A floating "Message me" button. It appears once the visitor scrolls and steps aside near the
    footer and contact form.
  - Links in the call-to-action band, the footer and the contact page.
  - The greeting is pre-typed, in English or Bangla.
- **One-page download:** `/one-pager/` plus a one-page A4 PDF, rebuilt with `npm run pdf`.
- **Printable résumé:** `/resume/`, built from your career data and laid out for A4 (2 pages),
  with a QR code back to the site.
- **Automatic sharing:**
  - Every page gets its own link-preview image, drawn at build time. Case studies show their
    headline number.
  - Share buttons on case studies, essays and the one-pager: the phone's share sheet, LinkedIn,
    WhatsApp, Facebook, X, email and copy link.
  - Shared links carry UTM tags, so you can see which network sends visitors.
- **Tracking:**
  - 25+ events go to every analytics tool: CV, one-pager and contact-card downloads, prints,
    WhatsApp, email, phone and booking clicks, the contact-form funnel, shares, outbound links,
    tabs, filters, language and theme, scroll depth, read-through, engaged time and 404s.
  - Contact emails now say *how the person found you*: campaign, referring site, first page,
    pages read and return visits.
  - Short links (`/card`, `/li`, `/sig`, `/talk`, `/r`, `/op`) for business cards, profiles,
    slides and print.
  - Optional slots for GA4, Meta Pixel, LinkedIn Insight and Search Console verification.
  - Debug mode: add `?debug-analytics` to any address.
- **Analytics speed:** Tag Manager and Clarity now start after the page has loaded, or at the
  first interaction. Umami still counts every visit.
- **Micro-interactions,** all light and switched off for people who prefer reduced motion:
  - **Buttons:** a sheen and a soft press; the main buttons lean slightly towards the pointer.
  - **Cards:** they lift, and a light follows the pointer across them.
  - **Tabs:** the highlight slides from tab to tab.
  - **Sections:** staggered fade-ins, and section numbers that draw a short rule.
  - **Scrolling:** a progress line along the top of every page, a header that slides away while
    reading and returns when you scroll up, a slow drift on the portrait and a story timeline
    that draws itself as you scroll.
  - **Dark mode:** the new theme spreads out in a circle from the button.
  - **Feedback:** "Link copied" style messages and a spinner while the contact form sends.
- **Hidden for now:**
  - A newsletter box (`showNewsletter: true` shows it).
  - An intro video with a placeholder (`video.show: true` shows it). The video loads only when
    pressed.
- **"Save contact" card** (`/sajid-kamal.vcf`): adds you to a phone's contacts in one tap.
- **Print styles:** any page prints cleanly in black on white.
- **Checks:**
  - 15 automated tests for the contact form, including the new "how they found you" lines.
  - 741 internal links with none broken.
  - Lighthouse:
    - **Accessibility, best practices and SEO:** 100 on every page tested.
    - **Desktop performance:** 100.
    - **Phone performance:** 92–98 in English, 90 in Bangla.

## What could come next

Roughly in order of value for the effort.

| Idea | Why | Effort |
| --- | --- | --- |
| **Replace the placeholders** (portrait, case-study text, testimonials, one real essay) | The site can't go live without them, and they make the biggest difference | You |
| **Move analytics into Cloudflare Zaraz** | Runs GTM, Clarity and Meta from Cloudflare's servers instead of the visitor's phone: faster pages, the same data | Small |
| **Booking link** (Cal.com or Calendly) | One-click calls for clients and recruiters; the buttons are already in place | Small |
| **Auto-post new essays to LinkedIn** | Connect the RSS feed (`/writing/feed.xml`) to Make, Zapier or IFTTT so each new essay is shared automatically | Small |
| **Analytics dashboard** | A Looker Studio or Umami report of the key events (CV downloads, WhatsApp, form sends) by source, each month | Small |
| **Real newsletter** (Buttondown, Substack or Beehiiv) | Own your audience; switch on `showNewsletter` | Small |
| **Record the intro video** | 60–120 seconds builds trust fast; switch on `video.show` | You |
| **Bangla case studies and essays** | Reach Bangla-first readers, clients and media | Medium |
| **Edit in the browser** (Keystatic, TinaCMS or Decap) | Change text and photos without touching files | Medium |
| **A lead magnet** (for example a "launch checklist" PDF for founders) | Turns visitors into contacts you can follow up with | Medium |
| **Speaking page** | Talk topics, past talks, an event kit and a booking form | Small |
| **Press page** | Logos, downloadable photos and media mentions in one place | Small |
| **Search and topics for writing** (Pagefind) | Useful once there are 10+ essays | Small |
| **Share-a-quote** in essays | Highlight a line to share it on LinkedIn or X | Small |
| **Bangla link-preview images** | Needs a renderer that shapes Bangla letters correctly (the current one can't) | Medium |
| **Consent banner** | Only needed if you target EU or UK visitors with Meta or LinkedIn ads | Small |
| **A "Now" page** | What you're working on this month, a popular personal-site idea | Small |
| **Weekly link and uptime check** | A GitHub Action that emails you if a page or link breaks | Small |
| **Headline A/B test** | Try the copy options in CONTENT-GUIDE.md against each other | Medium |
