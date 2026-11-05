import { getCollection } from 'astro:content';

/** All articles except drafts, newest first. */
export async function getPosts() {
  return (await getCollection('writing', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
