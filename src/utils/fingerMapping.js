import {
  KEY_FINGERS,
  LAYOUTS,
  getFingerForChar,
  getKeyForChar,
  getLayoutLabel,
} from './keyboardLayouts'

export const FINGERS = {
  'left-pinky': {
    id: 'left-pinky',
    label: 'Left pinky',
    short: 'LP',
    hand: 'left',
    color: 'var(--finger-pinky)',
    keys: ['a', 'q', 'z', '1'],
    tip: 'Anchor on A. It also handles the outer edge, Tab, Caps Lock and left Shift.',
  },
  'left-ring': {
    id: 'left-ring',
    label: 'Left ring',
    short: 'LR',
    hand: 'left',
    color: 'var(--finger-ring)',
    keys: ['s', 'w', 'x', '2'],
    tip: 'Anchor on S. Reach up to W and down to X without moving the rest of the hand.',
  },
  'left-middle': {
    id: 'left-middle',
    label: 'Left middle',
    short: 'LM',
    hand: 'left',
    color: 'var(--finger-middle)',
    keys: ['d', 'e', 'c', '3'],
    tip: 'Anchor on D. Reach straight up to E and straight down to C.',
  },
  'left-index': {
    id: 'left-index',
    label: 'Left index',
    short: 'LI',
    hand: 'left',
    color: 'var(--finger-index)',
    keys: ['f', 'g', 'r', 't', 'v', 'b', '4', '5'],
    tip: 'Anchor on F, the key with the raised bump. It owns two columns: F/G and R/T/V/B.',
  },
  'right-index': {
    id: 'right-index',
    label: 'Right index',
    short: 'RI',
    hand: 'right',
    color: 'var(--finger-index)',
    keys: ['j', 'h', 'u', 'y', 'n', 'm', '6', '7'],
    tip: 'Anchor on J, the key with the raised bump. It owns H/J and Y/U/N/M.',
  },
  'right-middle': {
    id: 'right-middle',
    label: 'Right middle',
    short: 'RM',
    hand: 'right',
    color: 'var(--finger-middle)',
    keys: ['k', 'i', ',', '8'],
    tip: 'Anchor on K. Reach up to I and down to the comma key.',
  },
  'right-ring': {
    id: 'right-ring',
    label: 'Right ring',
    short: 'RR',
    hand: 'right',
    color: 'var(--finger-ring)',
    keys: ['l', 'o', '.', '9'],
    tip: 'Anchor on L. Reach up to O and down to the period key.',
  },
  'right-pinky': {
    id: 'right-pinky',
    label: 'Right pinky',
    short: 'RP',
    hand: 'right',
    color: 'var(--finger-pinky)',
    keys: [';', 'p', '/', '0'],
    tip: 'Anchor on semicolon. It handles P, Enter, right Shift and the right edge.',
  },
  thumb: {
    id: 'thumb',
    label: 'Thumbs',
    short: 'TH',
    hand: 'both',
    color: 'var(--finger-thumb)',
    keys: [' '],
    tip: 'Press Space with either thumb. Keep it relaxed and close to the space bar.',
  },
}

export const FINGER_LIST = Object.values(FINGERS)

export function getFingerMeta(fingerId) {
  return FINGERS[fingerId] || null
}

/**
 * Return every printable key owned by one finger for the active layout.
 * Physical positions stay the same; labels follow the selected layout.
 */
export function getFingerKeys(fingerId, layoutId = 'qwerty') {
  const layout = LAYOUTS[layoutId] || LAYOUTS.qwerty
  return Object.entries(layout.keys)
    .filter(([code]) => KEY_FINGERS[code] === fingerId)
    .map(([, char]) => char)
}

export { KEY_FINGERS, getFingerForChar, getKeyForChar, getLayoutLabel }
