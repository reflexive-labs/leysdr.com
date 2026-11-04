// Site-wide facts and links. Change URLs here, not in markup.

const REPO = 'https://github.com/reflexive-labs/leysdr';

export const site = {
  name: 'Leyline SDR',
  title: 'Leyline SDR — software defined radio, made for the Mac',
  // Meta and social preview copy; keep under ~125 characters.
  description:
    'Software defined radio for the Mac. Tune, listen, decode and record from the app, terminal or an assistant.',
  intro:
    'Tune, listen, decode and record with an RTL-SDR or HackRF. Keep your memories and recordings together, and work from the Mac app, the terminal or an assistant.',
  minOS: 'macOS 26 or later',
  links: {
    repo: REPO,
    repoLabel: 'reflexive-labs/leysdr',
    docs: `${REPO}/tree/main/docs`,
    // The pinned release's DMG, notes and sources (src/updates/).
    download: '/download',
  },
} as const;
