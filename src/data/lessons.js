/**
 * TypeFlow curriculum.
 *
 * Six units take a learner from the home row to real-world code and prose.
 * Every lesson contains one or more timed exercises; the typing engine treats
 * each exercise as a practice text.
 */

export const lessonUnits = [
  {
    id: 'home-row',
    number: 1,
    title: 'Home Row Foundations',
    description: 'Anchor your fingers on ASDF and JKL; and build the muscle memory everything else depends on.',
    icon: 'home',
    color: 'primary',
    lessons: [
      {
        id: 'home-row-anchor',
        title: 'Meet the home row',
        description: 'Park your fingers on ASDF JKL; and learn to return to home after every reach.',
        level: 'beginner',
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetWpm: 18,
        tip: 'Keep your wrists floating. Your index fingers rest on the raised bumps on F and J.',
        exercises: [
          {
            title: 'Anchor drill',
            text: 'asdf jkl; asdf jkl; ff jj dd kk ss ll aa ;; asdf jkl; ;lkj fdsa',
          },
          {
            title: 'First words',
            text: 'ask a lad; all sad lads fall; dad had a flask; add a salad',
          },
          {
            title: 'Return to home',
            text: 'fj fj dk dk sl sl a; a; fjdksla; fjdksla; asdf jkl; asdf jkl;',
          },
        ],
      },
      {
        id: 'home-row-gh',
        title: 'Reach for G and H',
        description: 'Stretch your index fingers inward to G and H without lifting the rest of your hand.',
        level: 'beginner',
        keys: ['g', 'h'],
        targetWpm: 18,
        tip: 'Only the index finger moves. The other three fingers stay glued to the home row.',
        exercises: [
          {
            title: 'G and H',
            text: 'fgf jhj fgf jhj gh gh hg hg fgh jhg fgh jhg g h g h',
          },
          {
            title: 'G words',
            text: 'gas has had gag hag lag flag glad glass half hall shall',
          },
          {
            title: 'G and H flow',
            text: 'a glad lad has half a glass; ask dad to add a flag; hall gas',
          },
        ],
      },
      {
        id: 'home-row-words',
        title: 'Home row words',
        description: 'Chain home row letters into real words and short sentences.',
        level: 'beginner',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 22,
        tip: 'Aim for smooth, even rhythm rather than bursts of speed.',
        exercises: [
          {
            title: 'Word ladder',
            text: 'ask all fall glass flask salad shall hall flag glad half',
          },
          {
            title: 'Short sentences',
            text: 'all lads ask a glad dad; a glass half full; dad had a salad',
          },
          {
            title: 'Rhythm run',
            text: 'as a lad asks dad; all fall; a glad dad has half a glass',
          },
        ],
      },
      {
        id: 'home-row-capitals',
        title: 'Shift and capitals',
        description: 'Use the opposite Shift key while keeping your other hand anchored.',
        level: 'beginner',
        keys: ['Shift', 'A', 'S', 'D', 'F', 'J', 'K', 'L'],
        targetWpm: 20,
        tip: 'Right hand types a capital with left Shift; left hand uses right Shift. Never cross hands.',
        exercises: [
          {
            title: 'Capital pairs',
            text: 'Aa Ss Dd Ff Jj Kk Ll Aa Ss Dd Ff Jj Kk Ll',
          },
          {
            title: 'Names',
            text: 'Ada Dallas Frank Sally Jack Karl Lila Hana',
          },
          {
            title: 'Capital sentences',
            text: 'Ada asks Dad. Jack had a flask. Sally falls. Frank adds salad.',
          },
        ],
      },
      {
        id: 'home-row-check',
        title: 'Home row checkpoint',
        description: 'A short paragraph using only the home row. Keep accuracy above 96%.',
        level: 'beginner',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 24,
        tip: 'If errors creep in, slow down by 10 WPM. Accuracy is the skill; speed is the side effect.',
        exercises: [
          {
            title: 'Checkpoint passage',
            text: 'dad had a glass flask. all lads ask a glad lad to add a salad. a glass half full has a flag.',
          },
          {
            title: 'Accuracy focus',
            text: 'ask dad; dad asks; a glad dad; a sad lad; all fall; half a glass; a flask falls',
          },
        ],
      },
    ],
  },
  {
    id: 'top-row',
    number: 2,
    title: 'Top Row Reaches',
    description: 'Reach upward without looking. E, I, R, U, T, Y, Q, P, W and O join the party.',
    icon: 'arrow-up',
    color: 'secondary',
    lessons: [
      {
        id: 'top-ei',
        title: 'E and I',
        description: 'Lift the middle fingers straight up to E and I, then snap back home.',
        level: 'beginner',
        keys: ['e', 'i'],
        targetWpm: 20,
        tip: 'Reach with the middle finger only; the rest of the hand stays balanced on home.',
        exercises: [
          {
            title: 'E and I drill',
            text: 'ded kik ded kik de ed ki ik deed like died lied field',
          },
          {
            title: 'E and I words',
            text: 'see feel keep heel side hide slide field shield like file',
          },
          {
            title: 'Sentences',
            text: 'she sees a field; he likes a slide; keep a file; hide the key',
          },
        ],
      },
      {
        id: 'top-ru',
        title: 'R and U',
        description: 'Index fingers reach up and in for R and U while the pinkies hold the edge.',
        level: 'beginner',
        keys: ['r', 'u'],
        targetWpm: 20,
        tip: 'Think of a straight vertical line: F to R, J to U. Do not rotate the wrist.',
        exercises: [
          {
            title: 'R and U drill',
            text: 'frf juj frf juj fr ju rf uj r u r u dure rule ruse',
          },
          {
            title: 'Words',
            text: 'rush rule road read real user urge sure fuse pure ruffle',
          },
          {
            title: 'Sentences',
            text: 'read a rule; rush to a real user; she is sure; he had a red rug',
          },
        ],
      },
      {
        id: 'top-ty',
        title: 'T and Y',
        description: 'The long reach for T and Y builds lateral index control.',
        level: 'beginner',
        keys: ['t', 'y'],
        targetWpm: 22,
        tip: 'Reach with the index finger while keeping the hand quiet. Avoid moving the whole arm.',
        exercises: [
          {
            title: 'T and Y drill',
            text: 'ftf jyj ftf jyj ft jy tf yj t y t y type tiny yet they',
          },
          {
            title: 'Words',
            text: 'type test yet they stay style tasty typist yesterdays safety',
          },
          {
            title: 'Sentences',
            text: 'they type fast; stay on task; test the style; yet they try',
          },
        ],
      },
      {
        id: 'top-qpwo',
        title: 'Edges: Q, P, W, O',
        description: 'Pinkies work the top corners while ring fingers cover W and O.',
        level: 'intermediate',
        keys: ['q', 'p', 'w', 'o'],
        targetWpm: 22,
        tip: 'Pinkies are your weakest fingers. Give them a deliberate, light tap.',
        exercises: [
          {
            title: 'Corner drill',
            text: 'aqa p;p aqa p;p q p q p sws lol sws lol w o w o',
          },
          {
            title: 'Words',
            text: 'quiet power quote word work point open world people wood',
          },
          {
            title: 'Sentences',
            text: 'quiet people work well; open the world; power to the people',
          },
        ],
      },
      {
        id: 'top-row-check',
        title: 'Top row checkpoint',
        description: 'All eight top row keys, mixed with the home row, at a steady pace.',
        level: 'intermediate',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 26,
        tip: 'Let your eyes stay one word ahead of your fingers.',
        exercises: [
          {
            title: 'Top row passage',
            text: 'our quiet studio holds a wide pool of light; people type the first draft and revise it later',
          },
          {
            title: 'Mixed drill',
            text: 'quiet proud writer; type your own story; the world is full of ideas',
          },
        ],
      },
    ],
  },
  {
    id: 'bottom-row',
    number: 3,
    title: 'Bottom Row Control',
    description: 'Downward reaches test your discipline. V, N, C, M, X, Z, commas and periods.',
    icon: 'arrow-down',
    color: 'success',
    lessons: [
      {
        id: 'bottom-vn',
        title: 'V and N',
        description: 'Drop the index fingers down to V and N and return to F and J.',
        level: 'beginner',
        keys: ['v', 'n'],
        targetWpm: 20,
        tip: 'Reach down and slightly inward. The palm should not collapse.',
        exercises: [
          {
            title: 'V and N drill',
            text: 'fvf jnj fvf jnj fv jn vf nj v n v n van vine never inner',
          },
          {
            title: 'Words',
            text: 'van vine never given seven navy event invent invite oven',
          },
          {
            title: 'Sentences',
            text: 'never give in; seven vans invite a navy event; given time',
          },
        ],
      },
      {
        id: 'bottom-cm',
        title: 'C and M',
        description: 'Middle fingers drop to C and M while the rest of the hand stays put.',
        level: 'beginner',
        keys: ['c', 'm'],
        targetWpm: 22,
        tip: 'Keep your wrist level. Dropping the whole hand is the most common bottom row mistake.',
        exercises: [
          {
            title: 'C and M drill',
            text: 'dcd kmk dcd kmk dc km cd mk c m c m come camp calm climb',
          },
          {
            title: 'Words',
            text: 'come camp calm climb comic match machine music medic mint',
          },
          {
            title: 'Sentences',
            text: 'come to camp; match the music; a calm climber; climb the machine',
          },
        ],
      },
      {
        id: 'bottom-xpunct',
        title: 'X, comma, period',
        description: 'Punctuation is part of fluency. Learn comma and period without looking.',
        level: 'intermediate',
        keys: ['x', ',', '.'],
        targetWpm: 24,
        tip: 'Use the ring finger for the period and the middle finger for the comma.',
        exercises: [
          {
            title: 'Punctuation drill',
            text: 'sxs k,k l.l sxs k,k l.l x , . x , . box fox next text.',
          },
          {
            title: 'Punctuated lines',
            text: 'read this, then rest. type it, test it. next time, take a breath.',
          },
          {
            title: 'Words',
            text: 'box fox next text extra exact exit expand explain, relax.',
          },
        ],
      },
      {
        id: 'bottom-zb',
        title: 'Z, slash, B',
        description: 'Pinky, ring and index share the bottom edge. Keep the motion small.',
        level: 'intermediate',
        keys: ['z', '/', 'b'],
        targetWpm: 24,
        tip: 'For B, use whichever index finger is closer — left B is the standard.',
        exercises: [
          {
            title: 'Edge drill',
            text: 'aza ;/; aza ;/; fbf fbf z / b z / b buzz size lazy brown',
          },
          {
            title: 'Words',
            text: 'buzz size lazy zebra brown blend build zebra blaze amazing',
          },
          {
            title: 'Sentences',
            text: 'a lazy zebra naps; build a bright buzz; brown bread, please',
          },
        ],
      },
      {
        id: 'bottom-row-check',
        title: 'Bottom row checkpoint',
        description: 'Combine all three rows in longer phrases. Keep your eyes on the text.',
        level: 'intermediate',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        targetWpm: 28,
        tip: 'When a hard word appears, keep the rhythm instead of hammering the keys.',
        exercises: [
          {
            title: 'Three row passage',
            text: 'the quick brown fox jumps over the lazy dog while a calm musician practices a complex blend',
          },
          {
            title: 'Pangram practice',
            text: 'pack my box with five dozen liquor jugs; amazing zebras visit every cozy corner',
          },
        ],
      },
    ],
  },
  {
    id: 'numbers-symbols',
    number: 4,
    title: 'Numbers & Symbols',
    description: 'The number row and shifted symbols, from 1 through 0 to brackets and braces.',
    icon: 'hash',
    color: 'warning',
    lessons: [
      {
        id: 'numbers-1-5',
        title: 'Numbers 1 to 5',
        description: 'Left hand stretches across the left half of the number row.',
        level: 'intermediate',
        keys: ['1', '2', '3', '4', '5'],
        targetWpm: 20,
        tip: 'Reach from the home row and return immediately. Do not look down.',
        exercises: [
          {
            title: 'Number drill',
            text: '1a 2s 3d 4f 5g 1a 2s 3d 4f 5g 1 2 3 4 5 5 4 3 2 1',
          },
          {
            title: 'Number groups',
            text: '12 23 34 45 15 24 35 41 52 14 25 31 42 53',
          },
          {
            title: 'Numbers in text',
            text: '12 apples, 34 pears, 45 plums, 15 figs, 24 dates, 35 nuts',
          },
        ],
      },
      {
        id: 'numbers-6-0',
        title: 'Numbers 6 to 0',
        description: 'Right hand owns the right half of the number row.',
        level: 'intermediate',
        keys: ['6', '7', '8', '9', '0'],
        targetWpm: 20,
        tip: 'The pinky handles 0; keep it curved and relaxed.',
        exercises: [
          {
            title: 'Right number drill',
            text: '6h 7j 8k 9l 0; 6h 7j 8k 9l 0; 6 7 8 9 0 0 9 8 7 6',
          },
          {
            title: 'Number groups',
            text: '67 78 89 90 60 79 80 96 70 68 97 85 10 20',
          },
          {
            title: 'Numbers in text',
            text: '60 seats, 78 tickets, 89 guests, 90 plates, 100 cups',
          },
        ],
      },
      {
        id: 'symbols-shift',
        title: 'Shifted symbols',
        description: 'The top row doubles as symbols. Train the Shift reach deliberately.',
        level: 'advanced',
        keys: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
        targetWpm: 18,
        tip: 'Let the right pinky hold Shift for left-hand symbols; mirror it for the right hand.',
        exercises: [
          {
            title: 'Symbol pairs',
            text: '1! 2@ 3# 4$ 5% 6^ 7& 8* 9( 0) 1! 2@ 3# 4$ 5% 6^ 7& 8* 9( 0)',
          },
          {
            title: 'Symbol line',
            text: '! @ # $ % ^ & * ( ) ) ( * & ^ % $ # @ !',
          },
          {
            title: 'Mixed line',
            text: 'save 20%, pay $45, book 3 seats, add 5*6, call (555) 0123',
          },
        ],
      },
      {
        id: 'symbols-punctuation',
        title: 'Punctuation in motion',
        description: 'Quotes, brackets, hyphens, colons and semicolons in natural sentences.',
        level: 'advanced',
        keys: ['"', "'", '-', ':', ';', '?', '!', '(', ')'],
        targetWpm: 22,
        tip: 'Punctuation is rhythm, not an interruption. Keep the same steady cadence.',
        exercises: [
          {
            title: 'Punctuation sets',
            text: 'hello, world; ready? yes! (maybe) - wait: no; "sure" - "why not?"',
          },
          {
            title: 'Dialogue',
            text: 'she said, "stay calm." he asked: why? the answer was simple!',
          },
          {
            title: 'Mixed marks',
            text: 'pack (lightly); travel far: read, write, rest - then repeat.',
          },
        ],
      },
      {
        id: 'numbers-symbols-check',
        title: 'Numbers & symbols checkpoint',
        description: 'A mixed drill with prices, times, percentages and punctuation.',
        level: 'advanced',
        keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%'],
        targetWpm: 24,
        tip: 'Accuracy beats speed on this row. A single missing Shift creates a very different symbol.',
        exercises: [
          {
            title: 'Checkpoint',
            text: 'order 3 boxes at $24.50; save 15%; arrive at 9:45; call (555) 010-2030!',
          },
          {
            title: 'Data entry',
            text: 'ID 1045, ID 2089, ID 3310, ID 4621; total = $1,250.75; rate 7.5%',
          },
        ],
      },
    ],
  },
  {
    id: 'speed-rhythm',
    number: 5,
    title: 'Speed & Rhythm',
    description: 'Bigrams, trigrams and natural prose. Learn to move fast by staying relaxed.',
    icon: 'zap',
    color: 'info',
    lessons: [
      {
        id: 'bigrams',
        title: 'Common bigrams',
        description: 'The two-letter pairs that make up a huge share of English text.',
        level: 'intermediate',
        keys: ['t', 'h', 'e', 'i', 'n', 'r', 'a', 's'],
        targetWpm: 35,
        tip: 'Think in pairs, not letters. TH, HE and IN should feel like single motions.',
        exercises: [
          {
            title: 'Bigram ladder',
            text: 'th he in er an re on at en nd ti es or te of ed is it al ar',
          },
          {
            title: 'Bigram words',
            text: 'the then they there other another when what with this that these those',
          },
          {
            title: 'Bigram flow',
            text: 'the other hand; in the end; at the start; on the road; it is a fine day',
          },
        ],
      },
      {
        id: 'trigrams',
        title: 'Trigrams and blends',
        description: 'Three-letter clusters build the rhythm of whole syllables.',
        level: 'intermediate',
        keys: ['t', 'h', 'e', 'a', 'n', 'd', 'i', 'o', 'n'],
        targetWpm: 38,
        tip: 'Do not stop between trigrams. Let the ending of one flow into the next.',
        exercises: [
          {
            title: 'Trigram ladder',
            text: 'the and ing ion tio ent her ere all ith tha nth hat',
          },
          {
            title: 'Trigram words',
            text: 'another nothing something thinking station relation national',
          },
          {
            title: 'Trigram flow',
            text: 'the nation is thinking about another station; nothing is impossible',
          },
        ],
      },
      {
        id: 'common-words',
        title: 'The 50 words that matter',
        description: 'Half of everything you type is made from a tiny set of common words.',
        level: 'intermediate',
        keys: ['all'],
        targetWpm: 40,
        tip: 'Read ahead by two words. Your fingers already know these.',
        exercises: [
          {
            title: 'Common words',
            text: 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me',
          },
          {
            title: 'Common word sentences',
            text: 'I would like to have a word with you about this, but there is not much time',
          },
        ],
      },
      {
        id: 'sentence-rhythm',
        title: 'Sentence rhythm',
        description: 'Vary speed within a sentence while keeping accuracy steady.',
        level: 'advanced',
        keys: ['all'],
        targetWpm: 42,
        tip: 'Breathe at punctuation. Speed without a rhythm turns into error correction.',
        exercises: [
          {
            title: 'Flow passage',
            text: 'A steady hand beats a fast one. Slow down, find the rhythm, and let the words carry you forward. Speed arrives quietly, one clean line at a time.',
          },
          {
            title: 'Long line',
            text: 'Practice is not repetition, it is attention. Each keystroke is a tiny decision, and each clean decision makes the next one easier.',
          },
        ],
      },
      {
        id: 'speed-check',
        title: 'Speed checkpoint',
        description: 'A longer passage to measure your true sustained pace.',
        level: 'advanced',
        keys: ['all'],
        targetWpm: 45,
        tip: 'Settle into a pace you can hold for the whole passage. Finishing strong is the goal.',
        exercises: [
          {
            title: 'Checkpoint passage',
            text: 'The art of typing well is mostly the art of staying calm. Tension spreads from your shoulders to your wrists and then to every key. Let your hands float, keep your eyes on the line, and trust the rhythm you have built. A clean run at a moderate speed will always beat a frantic one that needs fixing.',
          },
        ],
      },
    ],
  },
  {
    id: 'code-real-world',
    number: 6,
    title: 'Code & Real World',
    description: 'Brackets, identifiers, code snippets, emails and URLs — the punctuation-heavy reality.',
    icon: 'code',
    color: 'error',
    lessons: [
      {
        id: 'code-brackets',
        title: 'Brackets & braces',
        description: 'Parentheses, square brackets and curly braces without breaking flow.',
        level: 'advanced',
        keys: ['(', ')', '[', ']', '{', '}'],
        targetWpm: 26,
        tip: 'Left-hand keys pair with right-hand keys. Type the pair as one motion.',
        exercises: [
          {
            title: 'Bracket pairs',
            text: '() [] {} () [] {} (()) [[]] {{}} ()[]{} ([]){}',
          },
          {
            title: 'Bracket lines',
            text: 'call(a, b); list[0]; data = {key: value}; if (x) {run()}',
          },
          {
            title: 'Nested brackets',
            text: 'total = sum([1, 2, 3]); result = fn(inner(x), {a: [b]})',
          },
        ],
      },
      {
        id: 'code-identifiers',
        title: 'snake_case & camelCase',
        description: 'Underscores, capitals and compound identifiers.',
        level: 'advanced',
        keys: ['_', 'Shift', 'a', 'A'],
        targetWpm: 26,
        tip: 'For snake_case, use the right pinky for underscore and keep the left hand home.',
        exercises: [
          {
            title: 'Identifiers',
            text: 'user_name user_id total_count get_user_name set_active_item is_valid_input',
          },
          {
            title: 'Camel case',
            text: 'userName userId totalCount getUserName setActiveItem isValidInput',
          },
          {
            title: 'Mixed identifiers',
            text: 'const userName = get_user_name(id); totalCount += item_count;',
          },
        ],
      },
      {
        id: 'code-javascript',
        title: 'JavaScript snippet',
        description: 'Type a real function with punctuation, arrows and returns.',
        level: 'advanced',
        keys: ['all'],
        targetWpm: 28,
        tip: 'Pause at the start of each new line. Let the structure guide your hands.',
        exercises: [
          {
            title: 'Function',
            text: 'function add(a, b) { return a + b; } const result = add(2, 3);',
          },
          {
            title: 'Array methods',
            text: 'const total = items.filter((item) => item.active).map((item) => item.price).reduce((a, b) => a + b, 0);',
          },
          {
            title: 'Async',
            text: 'async function load() { const res = await fetch(url); return res.json(); }',
          },
        ],
      },
      {
        id: 'code-python',
        title: 'Python snippet',
        description: 'Indentation, colons and underscores in real Python code.',
        level: 'advanced',
        keys: ['all'],
        targetWpm: 28,
        tip: 'Python rewards rhythm: colon, newline, indent, line. Repeat it until it is automatic.',
        exercises: [
          {
            title: 'Function',
            text: 'def add(a, b): return a + b total = add(2, 3) print(total)',
          },
          {
            title: 'List comprehension',
            text: 'names = [user.name for user in users if user.active] total = len(names)',
          },
          {
            title: 'Dictionary',
            text: 'config = {"host": "localhost", "port": 8080, "debug": True}',
          },
        ],
      },
      {
        id: 'code-real-world',
        title: 'Email, URLs & data',
        description: 'Everyday addresses, links and values with dashes, dots and slashes.',
        level: 'advanced',
        keys: ['all'],
        targetWpm: 30,
        tip: 'Slash and dot live under the right hand. Keep the wrist quiet when switching rows.',
        exercises: [
          {
            title: 'Email & URL',
            text: 'hello@typeflow.app https://typeflow.app/practice/daily?mode=words&time=30',
          },
          {
            title: 'Data row',
            text: '2026-11-08, order-1045, $249.99, shipped: true, qty: 12',
          },
          {
            title: 'Final challenge',
            text: 'Thanks for training with TypeFlow! Keep your wrists light, your eyes ahead, and your rhythm steady. You are faster than yesterday.',
          },
        ],
      },
    ],
  },
]

export const allLessons = lessonUnits.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, unitTitle: unit.title, unitNumber: unit.number }))
)

export const TOTAL_LESSONS = allLessons.length

export function getLessonById(id) {
  return allLessons.find((lesson) => lesson.id === id) || null
}

export function getUnitById(id) {
  return lessonUnits.find((unit) => unit.id === id) || null
}

export const LEVEL_META = {
  beginner: { label: 'Beginner', tone: 'success' },
  intermediate: { label: 'Intermediate', tone: 'warning' },
  advanced: { label: 'Advanced', tone: 'error' },
}
