#!/usr/bin/env node
// The Leyline release that leysdr.com/updates/ serves, pinned in src/updates/TAG.
//
//   node scripts/fetch-release.mjs [vX.Y.Z]
//     Moves the pin (or refreshes it) and writes the release's small files into
//     src/updates/: appcast.xml, drivers.json, notes.md and release.json. Commit them.
//
//   node scripts/fetch-release.mjs --dist dist/updates
//     At deploy: downloads every asset of the pinned release into the directory,
//     plus the DMG and sources of any older release the appcast still lists, and
//     checks each enclosure's file and length. The appcast is signed on the
//     release Mac and served byte for byte; this never edits it.
//
// Needs `gh` with read access to reflexive-labs/leysdr.
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'reflexive-labs/leysdr';
const PIN_DIR = 'src/updates';
const FEED_BASE = 'https://leysdr.com/updates/';

// Pinned-release-only files: an older release's copies must not replace them.
const PIN_ONLY = new Set(['appcast.xml', 'drivers.json']);

const gh = (...args) =>
  execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

function fail(message) {
  console.error(`fetch-release: ${message}`);
  process.exit(1);
}

function readPin() {
  return readFileSync(join(PIN_DIR, 'TAG'), 'utf8').trim();
}

function pin(tag) {
  const info = JSON.parse(
    gh('release', 'view', tag, '--repo', REPO, '--json', 'tagName,publishedAt,isDraft,body,assets')
  );
  if (info.isDraft) fail(`${tag} is a draft`);
  const version = tag.replace(/^v/, '');
  const assets = info.assets.map((a) => ({ name: a.name, size: a.size }));
  for (const name of ['appcast.xml', 'drivers.json', `Leyline-${version}.dmg`]) {
    if (!assets.some((a) => a.name === name)) fail(`${tag} has no ${name}`);
  }

  gh(
    'release',
    'download',
    tag,
    '--repo',
    REPO,
    '--dir',
    PIN_DIR,
    '--clobber',
    '--pattern',
    'appcast.xml',
    '--pattern',
    'drivers.json'
  );
  writeFileSync(join(PIN_DIR, 'notes.md'), `${info.body.trim()}\n`);
  writeFileSync(
    join(PIN_DIR, 'release.json'),
    `${JSON.stringify({ tag, version, publishedAt: info.publishedAt, assets }, null, 2)}\n`
  );
  writeFileSync(join(PIN_DIR, 'TAG'), `${tag}\n`);
  console.log(`pinned ${tag}`);
}

function enclosures(appcast) {
  return [...appcast.matchAll(/<enclosure\b[^>]*>/g)].map(([tag]) => {
    const attr = (name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
    return { url: attr('url'), length: Number(attr('length')) };
  });
}

function dist(dir) {
  const tag = readPin();
  gh('release', 'download', tag, '--repo', REPO, '--dir', dir, '--clobber');

  const appcast = readFileSync(join(dir, 'appcast.xml'), 'utf8');
  if (appcast !== readFileSync(join(PIN_DIR, 'appcast.xml'), 'utf8')) {
    fail(
      `${tag}'s appcast.xml differs from src/updates/appcast.xml; run \`node scripts/fetch-release.mjs\` and commit`
    );
  }

  for (const { url, length } of enclosures(appcast)) {
    if (!url?.startsWith(FEED_BASE)) fail(`enclosure ${url} is not under ${FEED_BASE}`);
    const name = url.slice(FEED_BASE.length);
    if (!existsSync(join(dir, name))) {
      const version = name.match(/^Leyline-(.+)\.dmg$/)?.[1];
      if (!version) fail(`can't tell which release serves ${name}`);
      const tmp = mkdtempSync(join(tmpdir(), 'leyline-'));
      gh('release', 'download', `v${version}`, '--repo', REPO, '--dir', tmp);
      for (const file of readdirSync(tmp)) {
        if (!PIN_ONLY.has(file) && !existsSync(join(dir, file)))
          copyFileSync(join(tmp, file), join(dir, file));
      }
      console.log(`added v${version} for the appcast's older entry`);
    }
    const size = statSync(join(dir, name)).size;
    if (size !== length) fail(`${name} is ${size} bytes; the appcast says ${length}`);
    console.log(`${name} ${size} bytes matches the appcast`);
  }
}

const [arg, value] = process.argv.slice(2);
if (arg === '--dist') {
  if (!value) fail('--dist needs a directory');
  dist(value);
} else {
  pin(arg ?? readPin());
}
