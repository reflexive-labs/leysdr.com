// Site-wide facts and links. Change URLs here, not in markup.

const REPO = 'https://github.com/reflexive-labs/leysdr';

export const site = {
  name: 'Leyline SDR',
  title: 'Leyline SDR — software defined radio, made for the Mac',
  description:
    'Plug in an RTL-SDR or HackRF, click a signal on the waterfall and listen. Leyline files your memories by band, finds a repeater’s tone, records every transmission and decodes APRS, weather alerts and AIS.',
  version: '1.0',
  minOS: 'macOS 26 or later',
  links: {
    repo: REPO,
    repoLabel: 'reflexive-labs/leysdr',
    docs: `${REPO}/tree/main/docs`,
    // The signed, notarized build is attached to each GitHub release.
    download: `${REPO}/releases/latest`,
  },
} as const;
