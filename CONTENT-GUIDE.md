# Content guide

Everything you need to finish the site: what to replace, colour palette options and copy
suggestions. Facts on the site (jobs, dates, numbers, education, certifications) come from
your CV. Everything else is a placeholder or a suggestion for you to change.

**How to spot placeholders:** text in **[square brackets]**, striped images labelled
"PLACEHOLDER", and pages with `placeholder: true` at the top. To see them all outlined,
open any page with `?preview` at the end of the address and press **Placeholders**.

---

## 1. Before you go live

The order is from most to least important.

- [ ] **Two portraits**: home page and About page (4:5, at least 1200 × 1500 px). This matters most.
- [ ] **A small headshot** for under each article (square, 400 × 400 px). Set it in `_config.yml` → `author.avatar`.
- [ ] **Project images**: one cover (16:10) and two photos (3:2) for each of the 6 projects.
- [ ] **Project stories**: the [bracketed] paragraphs in each file in `_projects/` (brief, results, what you learned).
- [ ] **Articles**: write at least one real article, and replace or delete the three placeholder files in `_posts/`.
- [ ] **Testimonials**: two real quotes in `_data/home.yml`, or delete the `testimonials` list to hide the section.
- [ ] **About page**: the optional personal line, your languages, the Speaking and media list (or delete that section), and a press photo link.
- [ ] **Contact page**: your usual reply time, and the last "Happy to help with" line.
- [ ] **Check permissions**: names, numbers and photos from employers. Logos in particular need the company's OK.
- [ ] **Contact form**: once FormSubmit is working, send yourself a test message and click the activation link.
- [ ] **Newsletter**: add a link in `_config.yml` → `newsletter_url` when you start one. Until then, the boxes point to LinkedIn.

## 2. Placeholder index

| Page | Placeholder | File |
| --- | --- | --- |
| Home | Portrait photo | `index.html` (`portrait.svg`) |
| Home | Point-of-view quote (suggested line in place) | `index.html` (`pullquote`) |
| Home | Two testimonials | `_data/home.yml` |
| Work | 6 cover images, 12 gallery photos, story paragraphs, 3 quotes | `_projects/*.md` |
| Writing | 3 placeholder articles (titles are suggestions) | `_posts/*.md` |
| Articles | Your headshot under each article | `_config.yml` → `author.avatar` |
| About | Portrait, personal line, languages | `about/index.html` |
| About | Speaking and media list | `about/index.html` |
| About | Press photo download | `about/index.html` |
| Contact | Reply time, last "Happy to help with" item | `contact/index.html` |
| Every page | Link-preview image (a designed name card for now) | `assets/img/share-card.png` |

## 3. Photos

- **Portrait:** natural daylight, a plain or softly blurred background, shoulders up or waist up, looking at or just past the camera. One smiling, one thoughtful.
- **Stand-in for now:** your current photo is kept at `assets/img/sajid-kamal.jpg` (640 × 640). It works as a temporary portrait, but it is square and small, so a new 4:5 photo will look much sharper.
- **At work:** in a store aisle, presenting to a team, at a launch or activation. These make the case studies believable.
- **Products:** packs on shelf, campaign key visuals, before/after rebrands (with permission).
- **Size:** export JPG at 80% quality, under about 400 KB each. Name files clearly, e.g. `assets/img/work/yum-shelf.jpg`.
- **Sizes used:** portrait 1200 × 1500 · project cover 1600 × 1000 · gallery 1200 × 800 · article cover 1600 × 900 · headshot 400 × 400 · link preview 1200 × 630.

---

## 4. Colour palettes

All four are built in. Every pair of text and background colours passes WCAG AA contrast,
and body text passes the stricter AAA level. **To compare them on the real site**, open
`/?preview` and click the swatches. **To choose one**, set `palette:` in `_config.yml`.

| Palette | Background | Text | Accent | Tint | Feels | Good for |
| --- | --- | --- | --- | --- | --- | --- |
| **Terracotta** (default) | `#F6F1E9` | `#1F1B16` | `#A3402A` | `#EEE6D9` | Warm, editorial, earthy | Food brands, writing-first profile |
| **Bottle green** | `#F3F2EC` | `#15211C` | `#1E5A43` | `#E4E6DC` | Heritage, calm, premium | A nod to Bangladesh green, long-term "trusted expert" feel |
| **Indigo** | `#F4F4F0` | `#131A2B` | `#3140A6` | `#E5E7EE` | Corporate, trustworthy | Corporate audiences and recruiters |
| **Ink** (dark) | `#121315` | `#F1EDE6` | `#FF8466` | `#212429` | Modern, bold, nighttime | A tech or startup-leaning profile |

**Recommendation:** Terracotta. It is warm, sits well with food and beauty, and reads as
"editorial" rather than "template". Bottle green is the close second if you want something
more restrained.

**Pairing rules used on the site:** one accent colour only, used for italics in headlines,
buttons, small rules and links. Everything else stays in ink and paper tones. Keep any new
graphics in the same accent.

---

## 5. Copy suggestions

### Home: headline (`index.html`, the `<h1>`)

Wrap the phrase you want in the accent italic in `<em>…</em>`.

1. I build food and beauty brands that *earn their place* on the shelf. *(in place now)*
2. Building Bangladesh’s next *favourite* brands.
3. Brands people *reach for*, from the factory to the feed.
4. I help everyday products become *brands people trust*.
5. Six years, three brands from scratch and *one stubborn startup*.

### Home: eyebrow above the headline

- Brand Manager · FMCG · Dhaka *(in place now)*
- Brand strategist · Food, health and beauty
- Brand building in Bangladesh

### Home: point of view (the large quote)

1. Great brands are built where people buy, not only where they scroll. *(in place now)*
2. A brand is a promise the shelf has to keep.
3. Distribution is the first campaign.
4. Insight starts in the shop, not in the slide deck.

### Section names

- Writing: **Notes from the shelf** *(in place now)* · Field notes · Shelf talk · Brand notes from Dhaka
- Work: **Selected work** *(in place now)* · Brands I’ve built · Case studies
- Footer call to action: **Building a brand, planning an event or writing a story? Let’s talk.** *(in place now)* · Have a brand question? Ask me. · Let’s build something people reach for.

### Buttons

- Read my writing · See selected work · Download CV · Follow on LinkedIn · Get in touch · Invite me to speak

### Bios

**One line (LinkedIn headline, social bios):**
Brand Manager at Ghorer Bazar · FMCG brand strategist · 3 brands built from scratch · Founder, Sui Chokri

**Short, first person (about 50 words):**
I’m Sajid, an FMCG brand strategist in Dhaka and Brand Manager at Ghorer Bazar. Over six years
I’ve built three bakery brands from scratch, designed trade programs that grew sales by up to
172% and run more than 100 digital campaigns. I write about brands, retail and how people in
Bangladesh shop.

**Short, third person (for organisers):** already on the About page, with a Copy button.

### Search and link-preview description (`_config.yml` → `description`)

Sajid Kamal is an FMCG brand strategist and Brand Manager at Ghorer Bazar in Dhaka. Projects,
essays and lessons from building food and beauty brands in Bangladesh. *(in place now)*

---

## 6. Article ideas

Each is drawn from your CV, so you already have the material.

1. What building three bakery brands taught me about Bangladeshi shoppers *(placeholder in place)*
2. Why the shelf still beats the screen: lessons from a 172% trade program *(placeholder in place)*
3. Building a startup next to a full-time job *(placeholder in place)*
4. How to launch a honey brand people can trust
5. 100 digital campaigns later: what actually moved sales
6. The flagship store idea: getting 50 grocers to sell only your products
7. Designing a route-to-market for an online-first brand
8. What first-aid training taught me about leading a launch team
9. Brand architecture for a conglomerate: notes from Akij
10. Pricing is part of the brand: lessons from cakes, noodles and cosmetics

**Rhythm:** one article a month is plenty. Post a short version on LinkedIn, with a link back to the full piece here.
