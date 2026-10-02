// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// S3 with Origin Access Control returns 403 (not 404) for a missing object, and
// CloudFront serves a status-matched error page. Ship /403.html as a build-time
// copy of /404.html so both error responses render the same page.
/** @type {import('astro').AstroIntegration} */
const emit403 = {
  name: 'emit-403',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      copyFileSync(`${out}404.html`, `${out}403.html`);
    },
  },
};

// Static output deployed to AWS S3 + CloudFront. See docs/deployment.md.
export default defineConfig({
  site: 'https://leysdr.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    emit403,
  ],
  devToolbar: { enabled: false },
});
