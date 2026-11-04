# thesajidkamal.me

Personal website of **MD Sajid Kamal**, FMCG brand strategist based in Dhaka.
Live at **https://thesajidkamal.me**.

It is a single static page: plain HTML, CSS and JavaScript, with no build step and no frameworks.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All the page content: hero, about, experience, skills, contact, footer |
| `css/style.css` | All the styling |
| `js/main.js` | Menu, typing effect, counters, scroll animations, custom cursor, contact form |
| `js/particles.js` | The moving particle background behind the hero (plain Canvas 2D, no libraries) |
| `sajid-kamal.jpg` | Profile photo used in the About section |
| `MD-Sajid-Kamal-CV.pdf` | CV behind the "Download CV" button |
| `favicon.ico` | Browser tab icon |
| `CNAME` | Custom domain for GitHub Pages |
| `.github/workflows/static.yml` | Publishes the site |

## Editing content

Everything visible on the page is in `index.html`. Each section starts with a comment
such as `<!-- Experience Section -->`. To add a job, copy one `<div class="timeline-item">…</div>`
block and change the text.

The numbers at the top count up from zero when they appear. Change the number in both
`data-count` and the text, for example `data-count="7" data-suffix="+">7+`.

## Publishing

Every push to `main` publishes the site automatically through GitHub Actions
(see the **Actions** tab). It is usually live within a minute or two.

To preview locally before pushing:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Contact form

Messages are delivered by [FormSubmit](https://formsubmit.co) to `sajidkamal214@gmail.com`.

- **Activation:** the first time the form is used, FormSubmit emails that address an
  "Activate Form" link. Nothing is delivered until it has been clicked.
- **After activating**, FormSubmit also gives you a random string to use instead of the
  email address. Putting it in the form's `action` and `data-endpoint` (in `index.html`)
  keeps the address away from spam bots.
- If sending fails, visitors are shown the email address to write to directly.
- A hidden `_honey` field catches simple spam bots.

**Switching to another provider** (for example Web3Forms or Formspree, if FormSubmit is
unreliable): change the form's `action` and `data-endpoint` in `index.html` to the new
provider's URL and replace FormSubmit's hidden `_…` fields with the ones that provider
documents. `js/main.js` already understands the replies from FormSubmit, Formspree and Web3Forms.

## Analytics

The page loads Google Tag Manager, Umami and Microsoft Clarity (all in the `<head>` of
`index.html`). The footer carries the visitor notice that Microsoft recommends for Clarity.

## Accessibility notes

- Visitors whose device is set to reduce motion get a still page: no particles, typing,
  counting, parallax, smooth scrolling or custom cursor.
- The custom cursor only appears for mouse and trackpad users. Touch screens keep their normal behaviour.
- If JavaScript fails to load, all content is still visible.
