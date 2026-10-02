/*
 * All copy lives here so it can be revised without touching components.
 * Lines marked `placeholder: true` hold the place of a credit still to be
 * confirmed and are rendered with a subtle marker until replaced.
 *
 * Nepali: नेपाल (Nepal), बौद्धनाथ (Boudhanath).
 */

export const hero = {
  title: 'Boudhanath',
  titleNepali: 'बौद्धनाथ',
  place: 'Kathmandu · Nepal',
  line: 'A great white stupa on the old road from Tibet into the Kathmandu Valley.',
};

/* What the camera looks at as the page scrolls, in order */
export const chapters = [
  {
    id: 'eyes',
    label: 'The eyes',
    text: 'On every face of the harmika, the eyes of the Buddha look out over the valley. Between them is the sign shaped like the Nepali numeral one, १, said to stand for unity.',
  },
  {
    id: 'spire',
    label: 'Thirteen steps',
    text: 'Above the eyes rise thirteen gilded tiers, read as the stages on the path to enlightenment. From the top, lines of prayer flags run down to the ground and give their prayers to the wind.',
  },
  {
    id: 'mandala',
    label: 'The mandala',
    text: 'Seen from above, the terraces form a mandala. People walk around it clockwise, turning the prayer wheels set into the walls as they pass.',
    hint: 'Drag a wheel to the left to turn it, or select it and press Enter.',
  },
  {
    id: 'evening',
    label: 'Evening',
    text: 'The lamps are lit, and the walk around the stupa goes on into the night.',
  },
];

export const prayer = {
  mantra: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ',
  mantraLatin: 'Om Mani Padme Hum',
};

export const about = {
  heading: 'About',
  text: 'A digital portrait of Boudhanath Stupa in Kathmandu, Nepal. The stupa is part of the Kathmandu Valley World Heritage Site, inscribed by UNESCO in 1979.',
  credits: [
    { text: 'Illustration, motion and code are original to this project.' },
    { text: 'Background: Mount Everest from the air. Photograph credit to be confirmed.', placeholder: true },
    { text: 'Sound is made in the browser and stays off until you turn it on.' },
  ],
};

/* Lung ta order, read along the string: sky, wind, fire, water, earth */
export const flagColors = ['--flag-blue', '--flag-white', '--flag-red', '--flag-green', '--flag-yellow'];
