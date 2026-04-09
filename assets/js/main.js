// main.js
// main.js
const LINES = [
  {
    id: 'line1',
    words: [
      { text: 'Humble',  anim: 'anim-flip' },
      { text: 'carrot',  anim: 'anim-spin' },
      { text: 'sleeps,', anim: 'anim-flip', extra: 'sleeps', floatClass: 'float' },
    ]
  },
  {
    id: 'line2',
    words: [
      { text: 'Tucked',   anim: 'anim-skid' },
      { text: 'in',       anim: 'anim-drop' },
      { text: 'buttery',  anim: 'anim-spin',  extra: 'accent' },
      { text: 'pastry\u00A0\u2014', anim: 'anim-skid', extra: 'accent' },
    ]
  },
  {
    id: 'line3',
    words: [
      { text: 'Earth', anim: 'anim-drop' },
      { text: 'made',  anim: 'anim-flip' },
      { text: 'into',  anim: 'anim-spin' },
      { text: 'sweet.', anim: 'anim-drop', extra: 'sweet', floatClass: 'glow', sparks: true },
    ]
  }
];

// ── Timing (ms) ─────────────────────────────────────────────────
const LINE_STARTS = [400, 1700, 3100]; // when each line's first word fires
const WORD_GAP    = 200;               // stagger between words in same line
const LAND_EXTRA  = 700;               // delay before adding post-land class

// ── Build & animate ─────────────────────────────────────────────
LINES.forEach((lineData, li) => {
  const lineEl = document.getElementById(lineData.id);

  lineData.words.forEach((wordData, wi) => {
    // Create span
    const span = document.createElement('span');
    span.className = `word ${wordData.anim}`;
    if (wordData.extra) span.classList.add(wordData.extra);
    span.textContent = wordData.text;
    if (wi < lineData.words.length - 1) span.style.marginRight = '0.3em';
    lineEl.appendChild(span);

    const triggerAt = LINE_STARTS[li] + wi * WORD_GAP;

    // Fire entrance animation
    setTimeout(() => {
      span.classList.add('in');
    }, triggerAt);

    // Fire post-land effect (float / glow)
    if (wordData.floatClass) {
      setTimeout(() => {
        span.classList.add(wordData.floatClass);
      }, triggerAt + LAND_EXTRA);
    }

    // Fire sparks for "sweet."
    if (wordData.sparks) {
      setTimeout(() => {
        spawnSparks(span);
      }, triggerAt + LAND_EXTRA - 100);
    }
  });
});

// ── Spark particles ─────────────────────────────────────────────
function spawnSparks(target) {
  const container = document.getElementById('sparks');
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;

  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    const angle   = (i / COUNT) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
    const dist    = 28 + Math.random() * 65;
    const tx      = Math.cos(angle) * dist;
    const ty      = Math.sin(angle) * dist;
    const size    = 1.5 + Math.random() * 2.5;
    const delay   = Math.random() * 180;
    const dur     = 800 + Math.random() * 500;

    spark.style.cssText = `
      left:   ${cx}px;
      top:    ${cy}px;
      width:  ${size}px;
      height: ${size}px;
    `;

    container.appendChild(spark);

    setTimeout(() => {
      spark.animate(
        [
          { opacity: 0,   transform: 'translate(-50%,-50%) scale(0)',   filter: 'blur(0px)' },
          { opacity: 1,   transform: `translate(calc(-50% + ${tx * 0.45}px), calc(-50% + ${ty * 0.45}px)) scale(1.2)` },
          { opacity: 0.7, transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.7)`, filter: 'blur(1px)' },
          { opacity: 0,   transform: `translate(calc(-50% + ${tx * 1.35}px), calc(-50% + ${ty * 1.35}px)) scale(0)` }
        ],
        { duration: dur, easing: 'ease-out', fill: 'forwards' }
      );
    }, delay);

    // Clean up after animation
    setTimeout(() => spark.remove(), delay + dur + 100);
  }
}
