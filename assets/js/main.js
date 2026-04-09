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
      { text: 'Tucked',              anim: 'anim-skid' },
      { text: 'in',                  anim: 'anim-drop' },
      { text: 'buttery',             anim: 'anim-spin', extra: 'accent' },
      { text: 'pastry\u00A0\u2014',  anim: 'anim-skid', extra: 'accent' },
    ]
  },
  {
    id: 'line3',
    words: [
      { text: 'Earth',  anim: 'anim-drop' },
      { text: 'made',   anim: 'anim-flip' },
      { text: 'into',   anim: 'anim-spin' },
      { text: 'sweet.', anim: 'anim-drop', extra: 'sweet', floatClass: 'glow', sparks: true },
    ]
  }
];

const LINE_STARTS = [400, 1700, 3100];
const WORD_GAP    = 200;
const LAND_EXTRA  = 700;

// Track all word spans for the click effect
const allSpans = [];
let allLanded  = false;

//  Build & animate 
LINES.forEach((lineData, li) => {
  const lineEl = document.getElementById(lineData.id);

  lineData.words.forEach((wordData, wi) => {
    const span = document.createElement('span');
    span.className = `word ${wordData.anim}`;
    if (wordData.extra) span.classList.add(wordData.extra);
    span.textContent = wordData.text;
    if (wi < lineData.words.length - 1) span.style.marginRight = '0.3em';
    lineEl.appendChild(span);
    allSpans.push(span);

    const triggerAt = LINE_STARTS[li] + wi * WORD_GAP;

    setTimeout(() => { span.classList.add('in'); }, triggerAt);

    if (wordData.floatClass) {
      setTimeout(() => { span.classList.add(wordData.floatClass); }, triggerAt + LAND_EXTRA);
    }

    if (wordData.sparks) {
      setTimeout(() => { spawnSparks(span); }, triggerAt + LAND_EXTRA - 100);
    }
  });
});


const lastWordTime = LINE_STARTS[2] + (LINES[2].words.length - 1) * WORD_GAP + LAND_EXTRA + 400;
setTimeout(() => { allLanded = true; }, lastWordTime);

// warm haze effect 
let hazeRunning = false;

document.querySelector('.haiku').style.cursor = 'pointer';

document.querySelector('.haiku').addEventListener('click', () => {
  if (!allLanded || hazeRunning) return;
  hazeRunning = true;

  allSpans.forEach((span, i) => {
    const delay = i * 55; // ripple across words left to right

    setTimeout(() => {
      span.animate([
        {
          filter:    'blur(0px) brightness(1)',
          transform: 'translateY(0px) scale(1)',
          color:     getComputedStyle(span).color,
          opacity:   1,
        },
        {
          filter:    'blur(3.5px) brightness(1.6)',
          transform: 'translateY(-6px) scale(1.08)',
          color:     '#f5d9a0',
          opacity:   0.85,
          offset:    0.35,
        },
        {
          filter:    'blur(5px) brightness(1.9)',
          transform: 'translateY(-10px) scale(1.12)',
          color:     '#fff4d6',
          opacity:   0.7,
          offset:    0.55,
        },
        {
          filter:    'blur(2px) brightness(1.3)',
          transform: 'translateY(-4px) scale(1.05)',
          color:     '#f0c87a',
          opacity:   0.9,
          offset:    0.75,
        },
        {
          filter:    'blur(0px) brightness(1)',
          transform: 'translateY(0px) scale(1)',
          color:     getComputedStyle(span).color,
          opacity:   1,
        },
      ], {
        duration: 1600,
        delay:    0,
        easing:   'ease-in-out',
        fill:     'none',
      });
    }, delay);
  });

  // Warm glow 
  const stage = document.querySelector('.stage');
  stage.animate([
    { filter: 'brightness(1)' },
    { filter: 'brightness(1.15)', offset: 0.4 },
    { filter: 'brightness(1)' },
  ], { duration: 1800, easing: 'ease-in-out' });

  // Release after full animation
  const totalDur = allSpans.length * 55 + 1700;
  setTimeout(() => { hazeRunning = false; }, totalDur);
});

// Spark particles 
function spawnSparks(target, count = 22) {
  const container = document.getElementById('sparks');
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
    const dist  = 28 + Math.random() * 65;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const size  = 1.5 + Math.random() * 2.5;
    const delay = Math.random() * 180;
    const dur   = 800 + Math.random() * 500;

    spark.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;`;
    container.appendChild(spark);

    setTimeout(() => {
      spark.animate([
        { opacity: 0,   transform: 'translate(-50%,-50%) scale(0)',   filter: 'blur(0px)' },
        { opacity: 1,   transform: `translate(calc(-50% + ${tx*.45}px),calc(-50% + ${ty*.45}px)) scale(1.2)` },
        { opacity: 0.7, transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(0.7)`, filter: 'blur(1px)' },
        { opacity: 0,   transform: `translate(calc(-50% + ${tx*1.35}px),calc(-50% + ${ty*1.35}px)) scale(0)` }
      ], { duration: dur, easing: 'ease-out', fill: 'forwards' });
    }, delay);

    setTimeout(() => spark.remove(), delay + dur + 100);
  }
}

    
