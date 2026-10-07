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
| `src/scripts/radio.ts`  | Canvas animation: the hero wave field                              |
| `src/assets/shots/`     | App screenshots from a pinned leysdr release (`make shots`)        |
| `src/updates/`          | The pinned app release: appcast, notes and asset list              |
| `src/pages/download`    | Download page: the pinned release, its notes and sources           |
| `src/pages/`            | `index` and `404` (the build also copies `404.html` to `403.html`) |

The design source is the "Leyline Site v3" file in the Leyline project on claude.ai/design.
Fonts (Space Grotesk, Space Mono) are self-hosted via Fontsource. The animation draws a single
still frame under `prefers-reduced-motion`.

## Screenshots

The screenshots are real captures published as `shots-YYYY-MM-DD` releases on
[reflexive-labs/leysdr](https://github.com/reflexive-labs/leysdr). `scripts/fetch-shots.sh` pins
one tag and copies it into `src/assets/shots/`; sizes and alt text come from its `shots.json`.

The **Update screenshots** workflow checks daily for a newer release and opens a PR that bumps
the tag. Before merging, check that the copy beside each changed shot still describes it. To
update by hand, change `TAG` in the script, run `make shots` and commit.

## App releases

Installed copies of Leyline poll `https://leysdr.com/updates/appcast.xml` and download
`/updates/Leyline-<version>.dmg`. `src/updates/TAG` pins the `vX.Y.Z` release the site serves;
its appcast, release notes and asset list are committed beside it, and the deploy fetches the
DMG and source tarballs into `dist/updates/`, checking each appcast enclosure's file and length.
The appcast is signed on the release Mac: never edit it here.

The **Update app release** workflow checks daily for a newer `v*` release and opens a PR with
its release notes. **Merging that PR ships the update to every installed copy.** To move the pin
by hand, run `make release TAG=vX.Y.Z` and commit `src/updates/`.

The download page at `/download` shows the pinned release, with its notes and the
source tarballs (the GPL source offer, which must stay reachable while the DMG is offered).

## Deploying

Merges to `main` deploy automatically once CI passes. See [docs/deployment.md](docs/deployment.md).
