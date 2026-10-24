// App screenshots from the pinned leysdr release (see scripts/fetch-shots.sh).
// Sizes and alt text come from the release's shots.json, not from markup.
import type { ImageMetadata } from 'astro';
import manifest from '@/assets/shots/shots.json';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/shots/*.png', {
  eager: true,
});

export interface Shot {
  src: ImageMetadata;
  alt: string;
  /** CSS pixels: the captures are @2x. */
  width: number;
  height: number;
}

export function shot(name: string): Shot {
  const asset = `${name}.png`;
  const entry = manifest.shots.find((s) => s.asset === asset);
  const file = files[`/src/assets/shots/${asset}`];
  if (!entry || !file) throw new Error(`No screenshot ${asset} in src/assets/shots`);
  return {
    src: file.default,
    alt: entry.alt,
    width: entry.width / entry.scale,
    height: entry.height / entry.scale,
  };
}
