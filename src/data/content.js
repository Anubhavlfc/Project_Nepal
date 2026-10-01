/*
 * All copy lives here so it can be revised without touching components.
 * Lines marked `placeholder: true` are holding places for final copy or
 * credits and are rendered with a subtle marker until replaced.
 *
 * Nepali: नेपाल (Nepal), हिमालय (Himalaya), बौद्धनाथ (Boudhanath).
 * Section numbers use Devanagari digits ०१–०५.
 */

export const sections = [
  { id: 'dusk', number: '०१', label: 'Dusk' },
  { id: 'himalaya', number: '०२', label: 'Himalaya' },
  { id: 'boudhanath', number: '०३', label: 'Boudhanath' },
  { id: 'prayer', number: '०४', label: 'Prayer' },
  { id: 'nepal', number: '०५', label: 'Nepal' },
];

export const hero = {
  eyebrow: 'Nepal · Himalaya',
  title: 'Boudhanath',
  titleNepali: 'बौद्धनाथ',
  tagline: 'Between earth, sky, and prayer.',
};

export const himalaya = {
  nepali: 'हिमालय',
  heading: 'The Himalaya',
  lead: 'The snow keeps the last of the evening light long after the valleys below have turned blue.',
  body: 'Space for a short passage on the range, the light, and the scale of the land.',
  bodyPlaceholder: true,
  image: {
    alt: 'Two snow-covered Himalayan peaks lit gold by the setting sun, with a long cloud trailing from the summit on the left.',
    caption: 'Peaks at last light. Add location and photographer credit.',
    captionPlaceholder: true,
  },
};

export const boudhanath = {
  nepali: 'बौद्धनाथ',
  heading: 'Boudhanath',
  lead: 'A white dome in the Kathmandu Valley, beneath eyes that look out in every direction.',
  note: 'Part of the Kathmandu Valley World Heritage Site, inscribed by UNESCO in 1979.',
  prompt: 'Select a part to see it on the stupa',
  parts: [
    {
      id: 'pinnacle',
      name: 'Pinnacle',
      text: 'The gilded finial that crowns the whole structure.',
    },
    {
      id: 'spire',
      name: 'Thirteen tiers',
      text: 'The stepped golden spire, traditionally read as the stages on the path to enlightenment.',
    },
    {
      id: 'harmika',
      name: 'Harmika and eyes',
      text: 'A square tower painted with eyes on all four faces. Between them, a sign shaped like the Nepali numeral one, १.',
    },
    {
      id: 'dome',
      name: 'Dome',
      text: 'The great whitewashed hemisphere at the centre of the stupa.',
    },
    {
      id: 'base',
      name: 'Mandala base',
      text: 'Three stepped terraces; seen from above, their outline forms a mandala. Prayer wheels are set into the walls.',
    },
  ],
};

export const prayer = {
  heading: 'Prayer, in motion',
  lead: 'Flags give their prayers to the wind. Wheels are turned by hand, always clockwise.',
  body: 'Each wheel carries the mantra Om Mani Padme Hum. Drag one to the left to turn it, or focus it and press Enter.',
  mantra: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ',
  mantraLatin: 'Om Mani Padme Hum',
};

export const closing = {
  nepali: 'नेपाल',
  heading: 'Nepal',
  lead: 'The light leaves the peaks last.',
  credits: [
    'Illustration, motion and code are original to this project.',
    'Mountain photograph supplied by the site author. Add credit.',
  ],
};

/* Lung ta order, read along the string: sky, wind, fire, water, earth */
export const flagColors = ['--flag-blue', '--flag-white', '--flag-red', '--flag-green', '--flag-yellow'];
