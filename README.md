# thesajidkamal.me

Personal website of **Sajid Kamal**, FMCG brand strategist in Dhaka.
Live at **https://thesajidkamal.me**.

The site is built with [Jekyll](https://jekyllrb.com), the system GitHub Pages runs natively.
You write in plain text files, and GitHub turns them into the website every time you save.

**What to replace before going live:** see [CONTENT-GUIDE.md](CONTENT-GUIDE.md). It lists
every placeholder, plus colour palette and copy suggestions.

---

## Pages

| Address | What it is | Edit this file |
| --- | --- | --- |
| `/` | Home | `index.html`, plus lists in `_data/home.yml` |
| `/work/` | All projects | Each project is a file in `_projects/` |
| `/work/<name>/` | One project (case study) | `_projects/<name>.md` |
| `/writing/` | All articles | Each article is a file in `_posts/` |
| `/writing/<title>/` | One article | `_posts/<date>-<title>.md` |
| `/about/` | Bio, experience, education | `about/index.html`, plus `_data/experience.yml`, `ventures.yml`, `education.yml`, `certifications.yml`, `expertise.yml` |
| `/contact/` | Contact details and form | `contact/index.html` |
| `/writing/feed.xml` | RSS feed (automatic) | – |

## Where things live

| Path | What it holds |
| --- | --- |
| `_config.yml` | **Site settings:** name, email, phone, social links, colour palette, analytics IDs, newsletter link |
| `_data/` | Lists shown on pages (career timeline, certifications, numbers, testimonials...) |
| `_posts/` | Articles (one Markdown file each) |
| `_projects/` | Project case studies (one Markdown file each) |
| `_layouts/` | Page templates (article, project, base page) |
| `_includes/` | Shared pieces (header, footer, cards, analytics) |
| `assets/css/main.css` | All the styling, including the four colour palettes |
| `assets/js/main.js` | Menu, fade-ins, project filters, contact form, owner preview |
| `assets/img/` | Images. `placeholders/` holds the striped stand-ins |
| `MD-Sajid-Kamal-CV.pdf` | The downloadable CV |
| `CNAME` | The custom domain |
| `.github/workflows/pages.yml` | Builds and publishes the site |

---

## Everyday tasks

### Publish an article

1. Create a file in `_posts/` named `YEAR-MONTH-DAY-short-title.md`, for example
   `_posts/2026-12-01-what-shoppers-want.md`. The date sets its place in the list,
   and the short title becomes the address (`/writing/what-shoppers-want/`).
2. Start the file with this block, then write the article underneath in plain text:

```markdown
---
title: "What shoppers want from a honey brand"
dek: "One line under the title."
excerpt: "One or two sentences shown in lists and link previews."
topic: Brand building
cover: /assets/img/writing/honey-shelf.jpg
cover_alt: "Honey jars on a supermarket shelf in Dhaka"
---

Your first paragraph.

## A subheading

More text. Use **bold**, *italic* and [links](https://example.com).

> A line worth quoting.

- A list item
- Another item

![Describe the image](/assets/img/writing/photo.jpg)
*A caption under the image.*
```

It appears on the Writing page, on the home page and in the RSS feed automatically.

### Add or change a project

Copy any file in `_projects/`, rename it (the name becomes the address) and change the text.
The block at the top controls the card and the header: `title`, `summary`, `client`, `role`,
`year`, `category` (used by the filter buttons), `cover`, `metrics`, `gallery` and `quote`.

- `featured: true` shows it on the home page (the first four, by `order`).
- `order:` sets its position on the Work page.

### Replace a placeholder image

1. Upload your photo to `assets/img/` (for example `assets/img/portrait.jpg`).
   JPG under 400 KB is ideal; see CONTENT-GUIDE.md for sizes.
2. Change the path that points to `/assets/img/placeholders/...` so it points to your file.
3. Remove `data-placeholder` from that `<img>` tag if it has one, and add a short description to `alt`.

### Other quick changes

- **Name, email, phone, links, palette:** `_config.yml`
- **Career timeline:** `_data/experience.yml` (newest first)
- **Numbers on the home page:** `_data/home.yml` → `stats`
- **Testimonials:** `_data/home.yml` → `testimonials` (delete the list to hide the section)
- **Menu:** `_data/navigation.yml`
- **CV:** replace `MD-Sajid-Kamal-CV.pdf`, keeping the same name

---

## Previewing changes

**Owner preview (in any browser).** Add `?preview` to any address, for example
`https://thesajidkamal.me/?preview`. A small bar appears in the corner where you can:

- switch between the four colour palettes, and
- press **Placeholders** to outline every stand-in still on the page.

It is remembered while the tab is open, and only you see it. Press × to leave.

**On your computer (optional).** With Ruby installed:

```sh
gem install jekyll -v 3.10.0 jekyll-feed jekyll-seo-tag jekyll-sitemap kramdown-parser-gfm webrick
jekyll serve
# then open http://localhost:4000
```

## Publishing

`.github/workflows/pages.yml` builds the site with the same Jekyll version GitHub Pages uses.

- **Every branch and pull request is built.** A green tick on GitHub means the site builds; a red cross means something needs fixing before it goes live.
- **Only `main` is published.** Merging a branch into `main` updates https://thesajidkamal.me within a minute or two.

In the repository settings, **Pages → Build and deployment → Source** must be **GitHub Actions** (it already is).

---

## Contact form

Messages are delivered by [FormSubmit](https://formsubmit.co) to the address in
`_config.yml` (`contact_form`).

- **Activation:** the first message sent through the form makes FormSubmit email you an
  "Activate Form" link. Nothing is delivered until you click it.
- After activating, FormSubmit gives you a random string to use in place of the email
  address in `contact_form`, which hides your address from spam bots.
- If sending fails, visitors are shown your email address instead.
- To switch provider (e.g. Web3Forms or Formspree), change the two addresses under
  `contact_form` and the hidden `_` fields in `contact/index.html`. `assets/js/main.js`
  already understands the replies from all three.

## Analytics and privacy

Google Tag Manager, Umami and Microsoft Clarity are loaded on every page (IDs in
`_config.yml` → `analytics`; set one to `""` to switch it off). The footer carries the
visitor notice Microsoft recommends for Clarity.

## Built in

- Search and social: page titles, descriptions, link-preview images (`assets/img/share-card.png`),
  a Google profile tag (Person), `sitemap.xml` and `robots.txt` are generated automatically.
- Accessibility: every colour pair passes WCAG AA contrast (body text passes AAA), keyboard
  navigation, a skip link, and visitors who ask their device for reduced motion get no animations.
- If JavaScript fails, every page still shows all its content.
