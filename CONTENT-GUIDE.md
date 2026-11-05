# Content guide

Everything you need to finish the site before it goes live. Facts on the site (roles, dates,
numbers, education, certifications) come from your CV. Everything else falls into one of three
kinds of content:

- **Placeholders:** text in **[square brackets]**, striped photo boxes and the "SK" portrait.
  Replace these with real content.
- **Suggested wording:** lines I wrote to tell your story (marked `SUGGESTED` in the files).
  They are based on your CV, but they are my words, so rewrite them in your voice.
- **Copy options:** alternatives for the main lines, in section 4.

**Visitors never see placeholders.** Unfinished content is hidden from the public site
automatically and appears the moment you replace it, so the site looks finished even while you work
through this list. **To see everything still to do,** open any page with `?preview` at the end of
the address, and press **Placeholders** to outline it all.

---

## 1. Before you go live (most important first)

- [ ] **Portrait** for the home page: `src/assets/photos/portrait.jpg` (4:5, at least 1200 × 1500).
      Nothing makes a bigger difference. For now you can copy `legacy-sajid-kamal.jpg` to `portrait.jpg`.
- [ ] **Second portrait** for About: `src/assets/photos/about.jpg`, ideally a different shot (presenting, in a store).
- [ ] **Headshot** for articles: `src/assets/photos/headshot.jpg` (square).
- [ ] **Suggested wording:** read and rewrite the story "lessons" (`src/data/story.ts`) and
      the four principles (`src/data/home.ts`) so they sound like you.
- [ ] **"What comes next" chapter** in `src/data/story.ts`: say what you're building towards, or delete that chapter.
- [ ] **Case studies:** the [bracketed] paragraphs in each file in `src/content/work/`, plus photos.
- [ ] **One real article:** write it, then replace or delete the three placeholder files in `src/content/writing/`.
- [ ] **Testimonials:** three real quotes in `src/data/home.ts`, or empty the list to hide the section.
- [ ] **Speaking tab and press kit:** the placeholder talk in `src/data/home.ts`, the Speaking and media list in `src/data/career.ts`, and press photos.
- [ ] **Services:** the formats, prices and FAQ answers in `src/data/services.ts`. First check that your
      employment contract allows outside work. If it doesn't, set `showServices: false` in `src/site.config.ts`.
- [ ] **Booking link:** add a Cal.com or Calendly address to `bookingUrl` in `src/site.config.ts`.
- [ ] **Contact form:** set up Resend on Cloudflare (README, step 2) and send yourself a test.
- [ ] **Bangla name:** check that `সাজিদ কামাল` (in `src/site.config.ts`) is how you write your name. If you change it,
      run `npm run fonts:bangla`, or set it to `''` to hide it.
- [ ] **"Open to" line** on the About page (`openTo` in `src/site.config.ts`): it is worded so it doesn't read as
      job hunting. Change it if you're openly looking.
- [ ] **Professional email:** consider `hello@thesajidkamal.me` (free with Cloudflare Email Routing; see the README).
- [ ] **Phone number:** it is shown on the Contact page. Set `phone: ''` if you'd rather not publish it.
- [ ] **Permissions:** check that you can name employers' results and show their product photos.

## 2. Where each placeholder lives

| Page | Placeholder | File |
| --- | --- | --- |
| Home | Portrait | `src/assets/photos/portrait.jpg` |
| Home | Speaking tab: a talk you have given | `src/data/home.ts` → `audiences` |
| Home and About | "What comes next" chapter | `src/data/story.ts` |
| Home | Three testimonials | `src/data/home.ts` → `testimonials` |
| Work | Case study paragraphs, 2 photos and a quote per project | `src/content/work/*.md`, `src/assets/photos/work/` |
| Writing | Three placeholder articles (titles are suggestions) | `src/content/writing/*.md` |
| About | Portrait, personal line, "Beyond work", Speaking and media, press photos | `src/pages/about.astro`, `src/data/career.ts` |
| Services | Formats, prices, FAQ answers | `src/data/services.ts` |
| Contact | Reply time | `src/pages/contact.astro` |

## 3. Colour palettes

Three palettes, each with a matching dark mode that visitors can switch to with the button in the
header. Every text colour passes WCAG AA contrast, and body text passes the stricter AAA level, in
both modes. **Compare them on the real site** by adding `?preview` to any address and clicking the
swatches. **Choose one** by setting `palette:` in `src/site.config.ts`.

| Palette | Paper | Ink | Accent | Dark-mode accent | Feels | Good for |
| --- | --- | --- | --- | --- | --- | --- |
| **Terracotta** (default) | `#F6F1E9` | `#1F1B16` | `#A3402A` | `#FF8466` | Warm, editorial, earthy | Food brands; a writing-first profile |
| **Bottle green** | `#F3F2EC` | `#15211C` | `#1E5A43` | `#6FCB9F` | Heritage, calm, premium | A nod to Bangladesh green; "trusted expert" |
| **Indigo** | `#F4F4F0` | `#131A2B` | `#3140A6` | `#9AA6FF` | Corporate, trustworthy | Recruiters, investors, corporate clients |

**My pick: Terracotta.** It is warm, suits food and beauty, and reads as a personal brand rather
than a template. Bottle green is a close second if you want something quieter.

## 4. Copy options

### Hero headline (`src/pages/index.astro`)

Wrap the phrase you want in the accent italic in `<em>…</em>`.

1. I build brands people *reach for*. *(in place now: short, works for every audience)*
2. I build food and beauty brands that *earn their place* on the shelf.
3. Brands people trust, *from the factory to the feed*.
4. Building Bangladesh’s next *favourite* brands.
5. Six years, three brands from scratch and *one stubborn startup*.

### Eyebrow above the headline (`roles` in `src/site.config.ts`)

- Brand builder · Operator · Founder *(in place now)*
- Brand manager · FMCG · Dhaka
- Brands · Categories · Go-to-market

### "How I can help" titles (`src/data/home.ts`)

| Visitor | In place now | Alternative |
| --- | --- | --- |
| Employers | A brand manager who builds the whole brand, not just the campaign. | Someone who can own a brand: the product, the plan and the P&L. |
| Investors | A founder-operator who takes ideas from zero to a working network. | I’ve built a startup from zero; next time I want to build one that lasts. |
| Clients | Practical help with categories, go-to-market and trade… | Strategy you can run on Monday, from someone who still does the work. |
| Organisers | Talks, classes and interviews on building brands in Bangladesh. | Stories from the shelf: what it really takes to launch a brand here. |

### Point-of-view lines (for the principles or a pull quote)

- Great brands are built where people buy, not only where they scroll.
- A brand is a promise the shelf has to keep.
- Distribution is the first campaign.
- Insight starts in the shop, not in the slide deck.

### Bios

**One line** (LinkedIn headline, speaker cards): Brand Manager at Ghorer Bazar · Built 3 brands from scratch · Founder, Sui Chokri

**Short, first person:** I’m Sajid, an FMCG brand strategist in Dhaka and Brand Manager at Ghorer
Bazar. Over six years I’ve built three bakery brands from scratch, designed trade programs that grew
sales by up to 172% and run more than 100 digital campaigns. I write about brands, retail and how
people in Bangladesh shop.

**Third person:** on the About page under *Press kit*, with a Copy button.

## 5. Article ideas (all drawn from your CV)

1. Building a startup next to a full-time job *(placeholder in place)*
2. Why the shelf still beats the screen: lessons from a 172% trade program *(placeholder in place)*
3. What building three bakery brands taught me about Bangladeshi shoppers *(placeholder in place)*
4. How to launch a honey brand people can trust
5. 100 campaigns later: what actually moved sales
6. The flagship store idea: getting 50 grocers to sell only your products
7. Designing a route-to-market for an online-first brand
8. What training 700 first-aid volunteers taught me about leading launches
9. Brand architecture inside a conglomerate
10. Pricing is part of the brand: lessons from cakes, noodles and cosmetics

**Rhythm:** one article a month is plenty. Post a short version on LinkedIn, linking back to the full piece here.

## 6. Photos

- **Portrait:** natural daylight, a plain or softly blurred background, chest up, looking at or just past the camera.
- **At work:** in a store aisle, presenting, at a launch or activation. These make the case studies believable.
- **Products:** packs on shelf, campaign visuals, before/after rebrands (with permission).
- Names and sizes are in [src/assets/photos/README.md](src/assets/photos/README.md). JPG straight from the
  camera or phone is fine: the site resizes and compresses it automatically.
