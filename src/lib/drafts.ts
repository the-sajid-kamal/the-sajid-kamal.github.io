// =====================================================================
//  Keeps unfinished content away from visitors.
//
//  In a case study or article marked "placeholder: true", any paragraph,
//  list item, quote or heading whose text starts with "[" is a stand-in.
//  This marks them with class="placeholder" (hidden from visitors, shown in
//  the owner preview), and also hides a heading when everything under it
//  is still a stand-in. Finished pages are left exactly as written.
// =====================================================================

const BLOCK = /<(h2|h3|p|ul|ol|blockquote)(\s[^>]*)?>[\s\S]*?<\/\1>|<hr\s*\/?>/g;

const textOf = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&[a-z0-9#]+;/gi, ' ').trim();

const addClass = (html: string, cls: string) =>
  html.replace(/^<(\w+)([^>]*)>/, (_m, tag: string, attrs: string) =>
    /\sclass="/.test(attrs)
      ? `<${tag}${attrs.replace(/\sclass="/, ` class="${cls} `)}>`
      : `<${tag}${attrs} class="${cls}">`,
  );

type Block = { tag: string; html: string; draft: boolean };

export function markDrafts(html: string): string {
  const matches = [...html.matchAll(BLOCK)];
  // Safety net: if the content holds anything this simple reader doesn't
  // understand (tables, images in figures...), leave it untouched.
  const squash = (s: string) => s.replace(/\s+/g, '');
  if (squash(matches.map((m) => m[0]).join('')) !== squash(html)) return html;

  const blocks: Block[] = matches.map((m) => {
    const tag = m[1] ?? 'hr';
    let out = m[0];
    let draft = false;
    if (tag === 'ul' || tag === 'ol') {
      let all = true;
      out = out.replace(/<li>([\s\S]*?)<\/li>/g, (li, inner: string) => {
        if (textOf(inner).startsWith('[')) return `<li class="placeholder">${inner}</li>`;
        all = false;
        return li;
      });
      draft = all;
    } else if (tag !== 'hr') {
      draft = textOf(out).startsWith('[');
    }
    if (draft) out = addClass(out, 'placeholder');
    return { tag, html: out, draft };
  });

  // A heading with only stand-ins underneath is hidden as well
  blocks.forEach((b, i) => {
    if (b.tag !== 'h2' || b.draft) return;
    let j = i + 1;
    let any = false;
    let all = true;
    while (j < blocks.length && blocks[j].tag !== 'h2') {
      any = true;
      if (!blocks[j].draft && blocks[j].tag !== 'hr') all = false;
      j++;
    }
    if (any && all) b.html = addClass(b.html, 'placeholder');
  });

  return blocks.map((b) => b.html).join('\n');
}
