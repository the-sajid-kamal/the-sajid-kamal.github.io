// =====================================================================
//  Site settings: the one file to edit for names, links and switches.
//  Text inside quotes can be changed freely; keep the quotes and commas.
// =====================================================================

export const site = {
  name: 'Sajid Kamal',
  fullName: 'MD Sajid Kamal',
  // Your name in Bangla, shown as a signature in the hero and footer. Set to '' to hide.
  nameBangla: 'সাজিদ কামাল',
  role: 'Brand Manager',
  company: 'Ghorer Bazar',
  roles: ['Brand builder', 'Operator', 'Founder'],
  location: 'Dhaka, Bangladesh',
  timezone: 'Asia/Dhaka',

  url: 'https://thesajidkamal.me',
  title: 'Sajid Kamal: brand builder, operator and founder in Dhaka',
  description:
    'Sajid Kamal builds food and beauty brands in Bangladesh: three brands from scratch, new categories at Ghorer Bazar, trade programs, 100+ campaigns and a startup for neighbourhood tailors.',

  // Contact
  email: 'sajidkamal214@gmail.com',
  phone: '+880 1732-101111', // set to '' to hide it on the Contact page
  // A booking page (Cal.com, Calendly, Google Calendar). While '', "Book a call"
  // buttons go to the contact form instead.
  bookingUrl: '',
  // Newsletter sign-up page (Substack, LinkedIn newsletter, Buttondown...). '' points people to LinkedIn.
  newsletterUrl: '',
  cv: '/MD-Sajid-Kamal-CV.pdf',

  profiles: {
    linkedin: 'https://www.linkedin.com/in/sajid-kamal/',
    facebook: 'https://www.facebook.com/mohammad.sajid.kamal/',
    github: 'https://github.com/the-sajid-kamal',
  },

  // Colour palette: 'terracotta' (default) | 'bottle' | 'indigo'.
  // Visitors can also switch light/dark with the button in the header.
  // Try them all first by adding ?preview to any address.
  palette: 'terracotta' as 'terracotta' | 'bottle' | 'indigo',

  // Shown as "Open to" on the About page. Keep it general if you'd rather your
  // current employer didn't read it as job hunting.
  openTo: 'Advisory, ventures, talks and the right conversations',

  // Set to false to hide the Services page and every link to it
  // (for example, if your employment contract rules out outside work).
  showServices: true,

  contactForm: {
    // On Cloudflare Pages this is handled by functions/api/contact.js (see README).
    // Elsewhere you can paste a Formspree or Web3Forms address here.
    endpoint: '/api/contact',
    // Cloudflare Turnstile spam protection. Paste the site key to switch it on.
    turnstileSiteKey: '',
  },

  // Analytics. Leave a value '' to switch that tool off.
  analytics: {
    gtm: 'GTM-K3FKGBKT',
    umami: 'c3292b9f-a17a-4e91-9679-1f1fa07db4f9',
    clarity: 'wnjoux3m19',
    // Cloudflare Web Analytics token (free, cookie-free), if you switch it on in Cloudflare
    cloudflare: '',
  },
};

export type Site = typeof site;
