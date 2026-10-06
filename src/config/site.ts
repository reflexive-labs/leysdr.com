// Site-wide facts and links. Change URLs here, not in markup.

const REPO = 'https://github.com/reflexive-labs/leysdr';

export const site = {
  name: 'Leyline SDR',
  title: 'Leyline SDR — software defined radio, made for the Mac',
  // Meta and social preview copy; keep under ~125 characters.
  description:
    'Plug in an RTL-SDR or HackRF and listen. Leyline records every transmission and decodes APRS, weather alerts and AIS.',
  intro:
    'Plug in an RTL-SDR or HackRF, click a signal on the waterfall and listen. Leyline files your memories by band, finds a repeater’s tone, records every transmission and decodes APRS, weather alerts and AIS.',
  minOS: 'macOS 26 or later',
  links: {
    repo: REPO,
    repoLabel: 'reflexive-labs/leysdr',
    docs: `${REPO}/tree/main/docs`,
    // The pinned release's DMG, notes and sources (src/updates/).
    download: '/download',
  },
} as const;
