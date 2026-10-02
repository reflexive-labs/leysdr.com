# leysdr.com

Marketing site for [Leyline SDR](https://github.com/reflexive-labs/leysdr), software defined
radio for the Mac. A single static [Astro](https://astro.build) page, deployed to AWS S3 +
CloudFront.

```sh
make install   # npm install
make dev       # http://localhost:4321
make ci        # type-check, formatting, build
```

## Layout

| Path                    | What                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| `src/config/site.ts`    | Links (repo, docs, download), version and shared copy              |
| `src/styles/global.css` | Design tokens (colors, fonts) and shared utility classes           |
| `src/components/`       | One component per page section                                     |
| `src/scripts/radio.ts`  | Canvas animations: hero wave field and simulated waterfalls        |
| `src/pages/`            | `index` and `404` (the build also copies `404.html` to `403.html`) |

The design source is the "Leyline Site v3" file in the Leyline project on claude.ai/design.
Fonts (Space Grotesk, Space Mono) are self-hosted via Fontsource. Animations draw a single
still frame under `prefers-reduced-motion`.

## Deploying

Merges to `main` deploy automatically once CI passes. See [docs/deployment.md](docs/deployment.md).
