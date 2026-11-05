// =====================================================================
//  Home page content.
//  Facts come from the CV. Text in [square brackets] is a placeholder.
//  Lines marked "SUGGESTED" are my wording of your story: rewrite them
//  in your own voice before going live.
// =====================================================================

// Things you have helped bring to market: the scrolling band under the hero
export const shelf = [
  'Sundarban honey',
  'Black seed honey',
  'Lychee flower honey',
  'Mustard oil',
  'Gawa ghee',
  'Chia seeds',
  'Pink salt',
  'Cakes',
  'Breads',
  'Buns',
  'Fresh noodles',
  'Jhal muri',
  'BBQ chanachur',
  'Candy',
  'Wafers',
  'Chocolate',
  'Total powder',
];

// Companies strip under the hero (plain text, so no logo permissions needed)
export const companies = ['Ghorer Bazar', 'Akij Bakers', 'Meghna Group', 'Remark HB · Herlan', 'Sui Chokri'];

// The four big numbers (all from the CV)
export const stats = [
  { value: 3, label: 'brands built from scratch, each No. 2 in its category' },
  { value: 140, suffix: '%', label: 'annual sales growth at Ghorer Bazar' },
  { value: 100, suffix: '+', label: 'integrated campaigns at Akij Bakers' },
  { value: 156, label: 'tailor shops on the Sui Chokri network' },
];

// Recognition and certifications: the row under the big numbers (all from the CV)
export const credentials = [
  'Selected for the H&M Foundation’s Needle Innovation Challenge',
  'Google Ads and Google Analytics 4 certified',
  'Meta Business Suite Expert, Meta Blueprint',
  'Digital Ad Expert, Aleph Group',
];

// "How I can help": one tab for each kind of visitor.
// The id is used in links, e.g. /#for-investors opens that tab.
export const audiences = [
  {
    id: 'for-employers',
    tab: 'Hiring',
    eyebrow: 'For employers',
    title: 'A brand manager who builds the whole brand, not just the campaign.',
    text: 'I’ve built brands from zero, launched new categories and owned the numbers behind them, across food, health and beauty.',
    proof: [
      { value: '3', label: 'brands built from scratch, each reaching No. 2 in its category' },
      { value: '140%', label: 'annual sales growth at Ghorer Bazar' },
      { value: 'P&L', label: 'SOPs, business plans and margin dashboards, not only campaigns' },
    ],
    primary: { label: 'Download my CV', href: 'cv' },
    secondary: { label: 'See my experience', href: '/about/#experience' },
  },
  {
    id: 'for-investors',
    tab: 'Investing',
    eyebrow: 'For investors and founders',
    title: 'A founder-operator who takes ideas from zero to a working network.',
    text: 'I founded Sui Chokri alongside my job, won a grant to pilot it and put 156 tailor shops on one network, then learned from the data and pivoted.',
    proof: [
      { value: '156', label: 'neighbourhood tailor shops onboarded in Dhaka' },
      { value: 'H&M', label: 'Foundation’s Needle Innovation Challenge: selected and awarded a pollination grant' },
      { value: 'Ops', label: 'a hub-based operating model built on FMCG distribution principles' },
    ],
    primary: { label: 'Read the Sui Chokri story', href: '/work/sui-chokri/' },
    secondary: { label: 'Start a conversation', href: '/contact/?topic=venture#message' },
  },
  {
    id: 'for-clients',
    tab: 'Consulting',
    eyebrow: 'For brands and businesses',
    title: 'Practical help with categories, go-to-market and trade, from someone who does it every day.',
    text: 'Launching a product, entering retail or trying to make trade spend work harder? I can help you plan it and measure it.',
    proof: [
      { value: '172%', label: 'short-term noodle sales growth from trade programs at Meghna Group' },
      { value: '4', label: 'new categories taken to market at Ghorer Bazar' },
      { value: '60%', label: 'more online sales from one Herlan digital campaign' },
    ],
    primary: { label: 'See how I can help', href: '/services/' },
    secondary: { label: 'Book an intro call', href: 'booking' },
  },
  {
    id: 'for-organisers',
    tab: 'Speaking',
    eyebrow: 'For organisers, educators and media',
    title: 'Talks, classes and interviews on building brands in Bangladesh.',
    text: 'From bakery brands to honey and a tailoring startup, I share what actually happens between the idea and the shelf.',
    proof: [
      { value: '700+', label: 'volunteers trained in emergency first aid as a Criticalink trainer' },
      { value: '[ ]', label: '[Placeholder: a talk, guest lecture or panel you have done]' },
      { value: 'Kit', label: 'a short bio, photos and CV ready to use' },
    ],
    primary: { label: 'Get the press kit', href: '/about/#press' },
    secondary: { label: 'Invite me to speak', href: '/contact/?topic=speaking#message' },
  },
];

// "How I work". SUGGESTED principles drawn from your CV: edit them so they sound like you.
export const principles = [
  {
    title: 'Start at the shelf.',
    text: 'Plans begin where people actually buy: the shop, the shelf and the screen they scroll. Trade programs taught me that.',
  },
  {
    title: 'Numbers before noise.',
    text: 'The P&L, the margin dashboard and the business plan come first, so every campaign has a clear job to do.',
  },
  {
    title: 'Build systems, not one-offs.',
    text: 'SOPs, route-to-market plans and hub models outlast any single campaign, and let a team grow without me in every meeting.',
  },
  {
    title: 'Brands are built with people.',
    text: 'Neighbourhood tailors, grocery owners, volunteers and agency partners: the people behind the product decide whether it works.',
  },
];

// PLACEHOLDER testimonials. Replace with real quotes, with permission
// (LinkedIn recommendations are a good source). Empty the list to hide the section.
export const testimonials = [
  {
    quote: '[Placeholder: a quote from a manager about a launch or result you delivered together. One or two sentences.]',
    name: '[Name]',
    role: '[Role, Company]',
  },
  {
    quote: '[Placeholder: a quote from a colleague, agency partner or team member about what you are like to work with.]',
    name: '[Name]',
    role: '[Role, Company]',
  },
  {
    quote: '[Placeholder: a quote from a founder, retailer or partner from Sui Chokri or a trade program.]',
    name: '[Name]',
    role: '[Role, Company]',
  },
];
