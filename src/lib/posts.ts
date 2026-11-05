import { getCollection } from 'astro:content';

/** All articles except drafts, newest first. */
export async function getPosts() {
  return (await getCollection('writing', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** True once at least one finished (non-placeholder) article exists.
    Until then the Writing links and sections stay hidden from visitors. */
export async function hasPublishedWriting() {
  return (await getPosts()).some((p) => !p.data.placeholder);
}
