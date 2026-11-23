/**
 * Physical keyboard model.
 *
 * Keys are identified by their physical `code` (KeyboardEvent.code) so that
 * alternate layouts (Dvorak, Colemak) only remap labels — finger assignment
 * stays anchored to the physical key, which is how touch typing actually works.
 */

export const LAYOUTS = {
  qwerty: {
    id: 'qwerty',
    name: 'QWERTY',
    keys: {
      Backquote: '`',
      Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
      Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
      Minus: '-', Equal: '=',
      KeyQ: 'q', KeyW: 'w', KeyE: 'e', KeyR: 'r', KeyT: 't',
      KeyY: 'y', KeyU: 'u', KeyI: 'i', KeyO: 'o', KeyP: 'p',
      BracketLeft: '[', BracketRight: ']', Backslash: '\\',
      KeyA: 'a', KeyS: 's', KeyD: 'd', KeyF: 'f', KeyG: 'g',
      KeyH: 'h', KeyJ: 'j', KeyK: 'k', KeyL: 'l', Semicolon: ';', Quote: "'",
      KeyZ: 'z', KeyX: 'x', KeyC: 'c', KeyV: 'v', KeyB: 'b',
      KeyN: 'n', KeyM: 'm', Comma: ',', Period: '.', Slash: '/',
      Space: ' ',
    },
  },
  dvorak: {
    id: 'dvorak',
    name: 'Dvorak',
    keys: {
      Backquote: '`',
      Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
      Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
      Minus: '[', Equal: ']',
      KeyQ: "'", KeyW: ',', KeyE: '.', KeyR: 'p', KeyT: 'y',
      KeyY: 'f', KeyU: 'g', KeyI: 'c', KeyO: 'r', KeyP: 'l',
      BracketLeft: '/', BracketRight: '=', Backslash: '\\',
      KeyA: 'a', KeyS: 'o', KeyD: 'e', KeyF: 'u', KeyG: 'i',
      KeyH: 'd', KeyJ: 'h', KeyK: 't', KeyL: 'n', Semicolon: 's', Quote: '-',
      KeyZ: ';', KeyX: 'q', KeyC: 'j', KeyV: 'k', KeyB: 'x',
      KeyN: 'b', KeyM: 'm', Comma: 'w', Period: 'v', Slash: 'z',
      Space: ' ',
    },
  },
  colemak: {
    id: 'colemak',
    name: 'Colemak',
    keys: {
      Backquote: '`',
      Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
      Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
      Minus: '-', Equal: '=',
      KeyQ: 'q', KeyW: 'w', KeyE: 'f', KeyR: 'p', KeyT: 'g',
      KeyY: 'j', KeyU: 'l', KeyI: 'u', KeyO: 'y', KeyP: ';',
      BracketLeft: '[', BracketRight: ']', Backslash: '\\',
      KeyA: 'a', KeyS: 'r', KeyD: 's', KeyF: 't', KeyG: 'd',
      KeyH: 'h', KeyJ: 'n', KeyK: 'e', KeyL: 'i', Semicolon: 'o', Quote: "'",
      KeyZ: 'z', KeyX: 'x', KeyC: 'c', KeyV: 'v', KeyB: 'b',
      KeyN: 'k', KeyM: 'm', Comma: ',', Period: '.', Slash: '/',
      Space: ' ',
    },
  },
}

/** Characters that require Shift on a US-style keyboard. */
export const SHIFT_MAP = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
  '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
  '<': ',', '>': '.', '?': '/',
}

/** Physical finger assignment — identical for every layout. */
export const KEY_FINGERS = {
  Backquote: 'left-pinky',
  Digit1: 'left-pinky', Digit2: 'left-ring', Digit3: 'left-middle',
  Digit4: 'left-index', Digit5: 'left-index',
  Digit6: 'right-index', Digit7: 'right-index', Digit8: 'right-middle',
  Digit9: 'right-ring', Digit0: 'right-pinky',
  Minus: 'right-pinky', Equal: 'right-pinky',
  KeyQ: 'left-pinky', KeyW: 'left-ring', KeyE: 'left-middle',
  KeyR: 'left-index', KeyT: 'left-index',
  KeyY: 'right-index', KeyU: 'right-index', KeyI: 'right-middle',
  KeyO: 'right-ring', KeyP: 'right-pinky',
  BracketLeft: 'right-pinky', BracketRight: 'right-pinky', Backslash: 'right-pinky',
  KeyA: 'left-pinky', KeyS: 'left-ring', KeyD: 'left-middle',
  KeyF: 'left-index', KeyG: 'left-index',
  KeyH: 'right-index', KeyJ: 'right-index', KeyK: 'right-middle',
  KeyL: 'right-ring', Semicolon: 'right-pinky', Quote: 'right-pinky',
  KeyZ: 'left-pinky', KeyX: 'left-ring', KeyC: 'left-middle',
  KeyV: 'left-index', KeyB: 'left-index',
  KeyN: 'right-index', KeyM: 'right-index', Comma: 'right-middle',
  Period: 'right-ring', Slash: 'right-pinky',
  Space: 'thumb',
  Tab: 'left-pinky', CapsLock: 'left-pinky', ShiftLeft: 'left-pinky',
  ShiftRight: 'right-pinky', Enter: 'right-pinky', Backspace: 'right-pinky',
  ControlLeft: 'left-pinky', ControlRight: 'right-pinky',
  AltLeft: 'left-pinky', AltRight: 'right-pinky',
  MetaLeft: 'left-pinky', MetaRight: 'right-pinky',
}

export const HOME_KEYS = new Set([
  'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon',
])

/**
 * Keyboard rows for the virtual keyboard. `width` is in key units; row totals
 * are ~15 units, matching a standard ANSI keyboard.
 */
export const KEYBOARD_ROWS = [
  [
    { code: 'Backquote' },
    { code: 'Digit1' }, { code: 'Digit2' }, { code: 'Digit3' },
    { code: 'Digit4' }, { code: 'Digit5' }, { code: 'Digit6' },
    { code: 'Digit7' }, { code: 'Digit8' }, { code: 'Digit9' },
    { code: 'Digit0' }, { code: 'Minus' }, { code: 'Equal' },
    { code: 'Backspace', width: 2, modifier: true, label: 'Backspace' },
  ],
  [
    { code: 'Tab', width: 1.5, modifier: true, label: 'Tab' },
    { code: 'KeyQ' }, { code: 'KeyW' }, { code: 'KeyE' }, { code: 'KeyR' },
    { code: 'KeyT' }, { code: 'KeyY' }, { code: 'KeyU' }, { code: 'KeyI' },
    { code: 'KeyO' }, { code: 'KeyP' },
    { code: 'BracketLeft' }, { code: 'BracketRight' },
    { code: 'Backslash', width: 1.5 },
  ],
  [
    { code: 'CapsLock', width: 1.75, modifier: true, label: 'Caps' },
    { code: 'KeyA' }, { code: 'KeyS' }, { code: 'KeyD' }, { code: 'KeyF' },
    { code: 'KeyG' }, { code: 'KeyH' }, { code: 'KeyJ' }, { code: 'KeyK' },
    { code: 'KeyL' }, { code: 'Semicolon' }, { code: 'Quote' },
    { code: 'Enter', width: 2.25, modifier: true, label: 'Enter' },
  ],
  [
    { code: 'ShiftLeft', width: 2.25, modifier: true, label: 'Shift' },
    { code: 'KeyZ' }, { code: 'KeyX' }, { code: 'KeyC' }, { code: 'KeyV' },
    { code: 'KeyB' }, { code: 'KeyN' }, { code: 'KeyM' },
    { code: 'Comma' }, { code: 'Period' }, { code: 'Slash' },
    { code: 'ShiftRight', width: 2.75, modifier: true, label: 'Shift' },
  ],
  [
    { code: 'ControlLeft', width: 1.25, modifier: true, label: 'Ctrl' },
    { code: 'MetaLeft', width: 1.25, modifier: true, label: 'Win' },
    { code: 'AltLeft', width: 1.25, modifier: true, label: 'Alt' },
    { code: 'Space', width: 7.5, modifier: true, label: 'space' },
    { code: 'AltRight', width: 1.25, modifier: true, label: 'Alt' },
    { code: 'MetaRight', width: 1.25, modifier: true, label: 'Win' },
    { code: 'ControlRight', width: 1.25, modifier: true, label: 'Ctrl' },
  ],
]

/** Build a reverse char → physical key map for a layout. */
export function buildCharKeyMap(layoutId = 'qwerty') {
  const layout = LAYOUTS[layoutId] || LAYOUTS.qwerty
  const map = {}
  for (const [code, char] of Object.entries(layout.keys)) {
    if (!char) continue
    map[char] = { code, shift: false }
    if (/[a-z]/.test(char)) {
      map[char.toUpperCase()] = { code, shift: true }
    }
  }
  for (const [shifted, base] of Object.entries(SHIFT_MAP)) {
    // Shifted symbol only valid when the layout has the base char.
    if (map[base]) map[shifted] = { code: map[base].code, shift: true }
  }
  map[' '] = { code: 'Space', shift: false }
  return map
}

const cache = {}
export function getKeyForChar(char, layoutId = 'qwerty') {
  if (!cache[layoutId]) cache[layoutId] = buildCharKeyMap(layoutId)
  return cache[layoutId][char] || null
}

export function getFingerForChar(char, layoutId = 'qwerty') {
  const key = getKeyForChar(char, layoutId)
  return key ? KEY_FINGERS[key.code] || null : null
}

export function getLayoutLabel(code, layoutId = 'qwerty') {
  const layout = LAYOUTS[layoutId] || LAYOUTS.qwerty
  return layout.keys[code] ?? ''
}
