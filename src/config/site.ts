// Site-wide facts and links. Change URLs here, not in markup.

const REPO = 'https://github.com/reflexive-labs/leysdr';

export const site = {
  name: 'Leyline SDR',
  title: 'Leyline SDR — software defined radio, made for the Mac',
  // Meta and social preview copy; keep under ~125 characters.
  description:
    'Radio for the Mac, with an assistant and speech-to-text on your own AI key. Plug in an RTL-SDR or HackRF and listen.',
  intro:
    'Plug in an RTL-SDR or HackRF, click a signal on the waterfall and listen. Leyline files your memories by band and records each transmission. Add your own AI key to run the radio in plain words and turn speech into searchable text.',
  minOS: 'macOS 26 or later',
  links: {
    repo: REPO,
    repoLabel: 'reflexive-labs/leysdr',
    docs: `${REPO}/tree/main/docs`,
    // The pinned release's DMG, notes and sources (src/updates/).
    download: '/download',
  },
} as const;
