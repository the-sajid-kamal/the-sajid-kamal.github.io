// Finds your photos by file name, so adding one never needs a code change.
//
//   src/assets/photos/portrait.jpg          -> home page portrait
//   src/assets/photos/about.jpg             -> About page portrait
//   src/assets/photos/headshot.jpg          -> small round photo on articles
//   src/assets/photos/work/<project>.jpg    -> project cover   (e.g. work/sui-chokri.jpg)
//   src/assets/photos/work/<project>-1.jpg  -> project gallery photos 1, 2, 3...
//   src/assets/photos/writing/<article>.jpg -> article cover
//
// JPG, PNG, WebP and AVIF all work. Astro resizes and compresses them automatically.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

const extensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'JPG', 'JPEG', 'PNG'];

export function photo(name: string): ImageMetadata | undefined {
  for (const ext of extensions) {
    const file = files[`/src/assets/photos/${name}.${ext}`];
    if (file) return file.default;
  }
  return undefined;
}
