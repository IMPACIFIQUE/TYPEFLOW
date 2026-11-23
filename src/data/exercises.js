import { ADVANCED_WORDS, COMMON_WORDS, PARAGRAPHS, QUOTES } from './passages'

const NUMBER_POOL = ['12', '24', '37', '45', '60', '78', '90', '105', '250', '1000', '2026']
const SYMBOL_SUFFIX = ['.', ',', '.', '!', '?', ';', ':']

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/** Small deterministic PRNG so the daily challenge is stable for a date. */
export function seededRandom(seed) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function hashString(text) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function dateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function generateWords(count = 30, options = {}) {
  const { punctuation = false, numbers = false, difficulty = 'common', rand = Math.random } = options
  const pool = difficulty === 'advanced'
    ? [...COMMON_WORDS, ...ADVANCED_WORDS]
    : COMMON_WORDS

  const words = []
  let sentenceStart = true

  for (let i = 0; i < count; i += 1) {
    let word = pool[Math.floor(rand() * pool.length)]

    if (numbers && rand() < 0.12) {
      const num = NUMBER_POOL[Math.floor(rand() * NUMBER_POOL.length)]
      const decorated = rand() < 0.35 ? `${rand() < 0.5 ? '$' : ''}${num}${rand() < 0.5 ? '%' : ''}` : num
      words.push(decorated)
      sentenceStart = false
      continue
    }

    if (punctuation) {
      if (sentenceStart) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
        sentenceStart = false
      }
      const breaksSentence = rand() < 0.14 || i === count - 1
      if (breaksSentence) {
        word += SYMBOL_SUFFIX[Math.floor(rand() * SYMBOL_SUFFIX.length)]
        sentenceStart = true
      } else if (rand() < 0.06) {
        word += ','
      }
    }

    words.push(word)
  }

  return words.join(' ')
}

export function generateQuote() {
  return randomItem(QUOTES)
}

export function generateParagraph() {
  return randomItem(PARAGRAPHS)
}

export function generateCode() {
  return null
}

/** Focus areas for guided practice. */
export const FOCUS_AREAS = [
  {
    id: 'home-row',
    label: 'Home row',
    description: 'A S D F J K L ;',
    keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    words: ['ask', 'all', 'fall', 'glass', 'flask', 'salad', 'shall', 'hall', 'flag', 'glad', 'half', 'dad', 'lad', 'sad', 'gas'],
  },
  {
    id: 'top-row',
    label: 'Top row',
    description: 'Q W E R T Y U I O P',
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    words: ['quiet', 'power', 'quote', 'word', 'work', 'point', 'open', 'world', 'people', 'wood', 'type', 'test', 'stay', 'style', 'route'],
  },
  {
    id: 'bottom-row',
    label: 'Bottom row',
    description: 'Z X C V B N M , . /',
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    words: ['buzz', 'size', 'lazy', 'zebra', 'brown', 'blend', 'build', 'come', 'camp', 'calm', 'climb', 'comic', 'match', 'music', 'never'],
  },
  {
    id: 'numbers',
    label: 'Numbers',
    description: '1 2 3 4 5 6 7 8 9 0',
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    words: ['12', '24', '37', '45', '60', '78', '90', '105', '250', '1000', '2026', '3.14', '50%', '$20', '(555)'],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    description: '! @ # $ % ^ & * ( )',
    keys: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    words: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '20%', '$45', '(a)', '[b]', '{c}', 'a+b', 'x=y'],
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    description: ', . ; : " \' ? !',
    keys: [',', '.', ';', ':', '"', "'", '?', '!'],
    words: ['hello,', 'world.', 'ready?', 'yes!', 'maybe;', 'wait:', '"sure"', "it's", 'no;', 'why?', 'then,', 'later.'],
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Brackets, identifiers, symbols',
    keys: ['(', ')', '[', ']', '{', '}', '_', '=', '+', '-'],
    words: ['add(a, b)', 'list[0]', '{key: value}', 'const x = 1;', 'if (x) {run()}', 'user_name', 'getUser()', 'a + b', 'i++', 'return;'],
  },
  {
    id: 'speed',
    label: 'Speed',
    description: 'Common words at pace',
    keys: [],
    words: COMMON_WORDS.slice(0, 60),
  },
]

export function getFocusArea(id) {
  return FOCUS_AREAS.find((area) => area.id === id) || FOCUS_AREAS[0]
}

export function generateDrill(focusId = 'home-row', count = 30) {
  const area = getFocusArea(focusId)
  const seed = hashString(`${dateKey()}-${focusId}`)
  if (area.id === 'speed') {
    return generateWords(count, { rand: seededRandom(seed) })
  }
  const rand = seededRandom(seed)
  const words = []
  for (let i = 0; i < count; i += 1) {
    words.push(area.words[Math.floor(rand() * area.words.length)])
  }
  return words.join(' ')
}

/** Deterministic daily challenge text, stable for a given date. */
export function getDailyChallenge(day = dateKey()) {
  const seed = hashString(`typeflow-daily-${day}`)
  const rand = seededRandom(seed)

  const optionPool = [
    { id: 'balanced', label: 'Balanced flow', punctuation: true, numbers: false, difficulty: 'common' },
    { id: 'numeric', label: 'Numbers & symbols', punctuation: true, numbers: true, difficulty: 'common' },
    { id: 'advanced', label: 'Advanced vocabulary', punctuation: true, numbers: false, difficulty: 'advanced' },
  ]
  const variant = optionPool[Math.floor(rand() * optionPool.length)]
  const words = generateWords(40, { ...variant, rand })
  const quote = QUOTES[Math.floor(rand() * QUOTES.length)]

  return {
    day,
    variant,
    text: words,
    quote,
    targetWpm: 40,
    targetAccuracy: 95,
  }
}

export const PRACTICE_DURATIONS = [15, 30, 60, 120]
export const TEST_DURATIONS = [15, 30, 60, 120]
export const TEST_WORD_COUNTS = [10, 25, 50, 100]

export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  const mins = seconds / 60
  return Number.isInteger(mins) ? `${mins}m` : `${(seconds / 60).toFixed(1)}m`
}
