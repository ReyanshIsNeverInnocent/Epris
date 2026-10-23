import './style.css';
import { notifyComparison } from './webhook-notifier.js';
import { zodiacElementReadings, zodiacSigns } from './data/zodiac.js';
import { calculateLovesPyramid } from './utils/loves.js';

const tools = [
  { id: 'flames', title: 'Flames', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 2.4c.8 3.7-1.1 5.2-2.6 7.1-.8-1.5-.8-2.7-.5-4-3.2 2.2-5.1 5.6-5.1 9.2a6.5 6.5 0 0 0 13 0c0-4.5-2.2-9-4.8-12.3Zm-1.2 17.8a3.1 3.1 0 0 1-3.1-3.1c0-1.3.7-2.4 1.8-3.7.2 1 .8 1.7 1.5 2.3.7-.8 1-1.6 1.1-2.5 1.1 1.3 1.8 2.6 1.8 3.9a3.1 3.1 0 0 1-3.1 3.1Z"/></svg>', tag: 'CLASSIC' },
  { id: 'love', title: 'Love Match', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8.8-5.3-8.8-11.4A4.8 4.8 0 0 1 12 6.8a4.8 4.8 0 0 1 8.8 2.8C20.8 15.7 12 21 12 21Z"/></svg>', tag: 'JUST FOR FUN' },
  { id: 'loves', title: 'LOVES Pyramid', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.5 20h17L12 3Z"/><path d="M7.1 12.8h9.8M5.3 16.3h13.4M12 3v17"/></svg>', tag: 'THE PAPER GAME' },
  { id: 'zodiac', title: 'Zodiac Match', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16.8c3.7-7.3 12.3-9.9 16-9.6-1.1 3.9-5.5 11.4-13.1 12.1"/><path d="m7.4 5 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7L7.4 5Zm10.1 8 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z"/></svg>', tag: 'JUST FOR FUN' },
  { id: 'future', title: 'Coming soon', icon: '＋', tag: 'IN THE WORKS', disabled: true },
];

const icons = {
  arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4l6 6-6 6" /></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 14.1 9l6.4 3-6.4 2.2L12 21l-2.2-6.8L3 12l6.8-3L12 2.5Z" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" /></svg>',
};

const app = document.querySelector('#app');
let activeTool = 'flames';

function renderSidebar() {
  return `
    <aside class="sidebar">
      <a class="brand" href="#" aria-label="Épris home">
        <img class="brand-mark" src="/epris_logo.png" alt="" aria-hidden="true" />
        <span class="brand-name">Épris<span class="brand-dot">.</span><small>MEANS ENAMORED OR INFATUATED IN FRENCH</small></span>
      </a>
      <div class="side-label">YOUR LITTLE CORNER</div>
      <nav class="tool-nav" aria-label="Love games">
        ${tools.map((tool) => `
          <button class="nav-item ${tool.id === activeTool ? 'is-active' : ''} ${tool.disabled ? 'is-disabled' : ''}"
            data-tool="${tool.id}" ${tool.disabled ? 'disabled' : ''} ${tool.id === activeTool ? 'aria-current="page"' : ''}>
            <span class="nav-icon" aria-hidden="true">${tool.icon}</span>
            <span class="nav-copy"><strong>${tool.title}</strong></span>
            ${tool.id === activeTool ? '<span class="nav-chevron">›</span>' : ''}
          </button>
        `).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-note"><span class="note-flower">✿</span><p>A tiny reminder:<br /><strong>this is not real (if you get a bad result).</strong></p></div>
        <span class="side-version">MADE WITH ❤️ BY REYANSH</span>
      </div>
    </aside>
  `;
}

function renderFlames() {
  return `
    <section class="tool-content" aria-labelledby="tool-title">
      <div class="eyebrow"><span class="eyebrow-spark" aria-hidden="true">ᵎᵎ 🧁</span> THE GENESIS OF A CRUSH </div>
      <h1 id="tool-title">So... what are <em>you two?</em></h1>
      <p class="intro">Type in your names and let the world's least scientific quiz decide.</p>
      <div class="game-card">
        <div class="form-card-heading">
          <span class="heading-sticker flames-sticker" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21.2C8.5 18.8 3.8 15.5 3.8 10.8c0-3 2.2-5.2 5-5.2 1.3 0 2.4.5 3.2 1.5.7-2.3 2.1-4 4.2-5.2-.1 2.5.7 4 2.1 5.5 1.2 1.3 2 2.7 2 4.6 0 4.3-4.8 7.4-8.3 9.2Z"/><path d="M12 17.8c-1.9-1.3-4.2-3-4.2-5.5 0-1.8 1.2-3.1 2.8-3.1.9 0 1.5.4 2 1.1.5-1.2 1.3-2.1 2.5-2.8 0 1.5.5 2.4 1.3 3.3.7.8 1.1 1.5 1.1 2.6 0 2.1-2.2 3.5-5.5 4.4Z"/></svg></span>
          <span class="heading-copy"><strong>THE NAME GAME</strong><small>okay, spill the names...</small></span>
          <span class="heading-doodle" aria-hidden="true">✿</span>
        </div>
        <form id="flames-form" class="name-form">
          <label class="field">
            <span>Your name</span>
            <input name="firstName" type="text" maxlength="40" placeholder="e.g. Shagun" autocomplete="given-name" required />
          </label>
          <span class="form-heart" aria-hidden="true">♡</span>
          <label class="field">
            <span>Their name</span>
            <input name="secondName" type="text" maxlength="40" placeholder="e.g. Nirvan" autocomplete="off" required />
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit">Find out <span>${icons.arrow}</span></button>
            <button class="form-action-button" type="button" data-form-action="example">Try example</button>
            <button class="form-action-button" type="button" data-form-action="clear">Clear</button>
          </div>
        </form>
        <div class="result-wrap" id="flames-result" aria-live="polite"></div>
        <div class="card-foot"><span>NO SCIENCE. JUST SPARKS.</span><span>✦</span></div>
      </div>
      <div class="flames-legend">
        <span class="legend-heading">THE POSSIBILITIES</span>
        <div class="legend-items">
          <span><b>F</b> Friends</span><span><b>L</b> Love</span><span><b>A</b> Affection</span>
          <span><b>M</b> Marriage</span><span><b>E</b> Enemies</span><span><b>S</b> Siblings</span>
        </div>
      </div>
    </section>
  `;
}

function renderLove() {
  return `
    <section class="tool-content love-content" aria-labelledby="tool-title">
      <div class="eyebrow"><span class="eyebrow-spark" aria-hidden="true">ᵎᵎ 🧁</span> FOR SCIENTIFIC REASONS (NOT)</div>
      <h1 id="tool-title">What's your <em>love score?</em></h1>
      <p class="intro">Two names go in. A very official-looking number comes out.</p>
      <div class="game-card">
        <div class="form-card-heading">
          <span class="heading-sticker score-sticker" aria-hidden="true">%</span>
          <span class="heading-copy"><strong>THE LOVE SCORE</strong><small>let's see what the number says...</small></span>
          <span class="heading-doodle" aria-hidden="true">✦</span>
        </div>
        <form id="love-form" class="name-form">
          <label class="field">
            <span>Your name</span>
            <input name="firstName" type="text" maxlength="40" placeholder="e.g. Shagun" autocomplete="given-name" required />
          </label>
          <span class="form-heart" aria-hidden="true">♡</span>
          <label class="field">
            <span>Their name</span>
            <input name="secondName" type="text" maxlength="40" placeholder="e.g. Nirvan" autocomplete="off" required />
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit">Calculate <span>${icons.arrow}</span></button>
            <button class="form-action-button" type="button" data-form-action="example">Try example</button>
            <button class="form-action-button" type="button" data-form-action="clear">Clear</button>
          </div>
        </form>
        <div class="result-wrap" id="love-result" aria-live="polite"></div>
        <div class="card-foot"><span>THE STARS ARE NOT LIABLE</span><span>✦</span></div>
      </div>
      <div class="love-note love-match-note"><span>“</span><p>Numbers are fun. Kindness is the real love language.</p><span>”</span></div>
    </section>
  `;
}

function renderLoves() {
  return `
    <section class="tool-content loves-content" aria-labelledby="tool-title">
      <div class="eyebrow"><span class="eyebrow-spark" aria-hidden="true">✦</span> THE CLASSIC PAPER GAME</div>
      <h1 id="tool-title">Let's play <em>LOVES.</em></h1>
      <p class="intro">Write two names, count the L-O-V-E-S letters, then watch the number pyramid collapse.</p>
      <div class="game-card">
        <div class="form-card-heading">
          <span class="heading-sticker loves-sticker" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.8v4h4"/><path d="M9 11h6M9 14h6M9 17h4"/><path d="m15.8 17.2 3.7-3.7 1.4 1.4-3.7 3.7-1.8.4z"/></svg></span>
          <span class="heading-copy"><strong>THE LOVES PYRAMID</strong><small>two names, one very unserious number...</small></span>
          <span class="heading-doodle" aria-hidden="true">♡</span>
        </div>
        <form id="loves-form" class="name-form">
          <label class="field">
            <span>Your name</span>
            <input name="firstName" type="text" maxlength="40" placeholder="e.g. Shagun" autocomplete="given-name" required />
          </label>
          <span class="form-heart" aria-hidden="true">♡</span>
          <label class="field">
            <span>Their name</span>
            <input name="secondName" type="text" maxlength="40" placeholder="e.g. Nirvan" autocomplete="off" required />
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit">Make the pyramid <span>${icons.arrow}</span></button>
            <button class="form-action-button" type="button" data-form-action="example">Try example</button>
            <button class="form-action-button" type="button" data-form-action="clear">Clear</button>
          </div>
        </form>
        <div class="result-wrap loves-result" id="loves-result" aria-live="polite"></div>
        <span class="loves-developer-note">Fuck it.<br />We Ball.</span>
        <div class="card-foot"><span>THE PYRAMID HAS SPOKEN</span><span>✦</span></div>
      </div>
      <div class="love-note loves-note"><span>“</span><p>Count the letters, not your chances. This is just a paper game.</p><span>”</span></div>
    </section>
  `;
}

function renderZodiac() {
  const signOptions = zodiacSigns.map((sign) => `
    <option value="${sign.id}">${sign.symbol} ${sign.name} · ${sign.dates}</option>
  `).join('');
  return `
    <section class="tool-content zodiac-content" aria-labelledby="tool-title">
      <div class="eyebrow"><span class="eyebrow-spark" aria-hidden="true">✧</span> COSMIC VIBE CHECK</div>
      <h1 id="tool-title">What's the <em>vibe?</em></h1>
      <p class="intro">Pick your signs, then steal a question for your next convo. Astrology is a conversation starter, not a compatibility test.</p>
      <div class="game-card">
        <div class="form-card-heading">
          <span class="heading-sticker zodiac-sticker" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2m0 14.6v2.2M2.5 12h2.2m14.6 0h2.2M5.3 5.3l1.6 1.6m10.2 10.2 1.6 1.6m0-13.4-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg></span>
          <span class="heading-copy"><strong>THE STAR-CROSSED CLUB</strong><small>sun signs only, stargazer...</small></span>
          <span class="heading-doodle" aria-hidden="true">✧</span>
        </div>
        <form id="zodiac-form" class="name-form">
          <label class="field">
            <span>Your sign</span>
            <select name="firstSign" required>
              <option value="" disabled selected>Choose a sign</option>
              ${signOptions}
            </select>
          </label>
          <span class="form-heart" aria-hidden="true">♡</span>
          <label class="field">
            <span>Their sign</span>
            <select name="secondSign" required>
              <option value="" disabled selected>Choose a sign</option>
              ${signOptions}
            </select>
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit">Reveal our vibe <span>${icons.arrow}</span></button>
            <button class="form-action-button" type="button" data-form-action="example">Try example</button>
            <button class="form-action-button" type="button" data-form-action="clear">Clear</button>
          </div>
        </form>
        <div class="result-wrap zodiac-result" id="zodiac-result" aria-live="polite"></div>
        <div class="card-foot"><span>FOR FUN, NOT FATE</span><span>✦</span></div>
      </div>
      <div class="love-note zodiac-note"><span>“</span><p>The stars can start the convo. How you treat each other matters more.<br />P.S. The developer (virgo) thinks zodiac is total BS.</p><span>”</span></div>
    </section>
  `;
}

function render() {
  const activeTitle = tools.find((tool) => tool.id === activeTool)?.title ?? 'Flames';
  const activeView = {
    flames: renderFlames,
    love: renderLove,
    loves: renderLoves,
    zodiac: renderZodiac,
  }[activeTool] ?? renderFlames;
  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <main class="main-area">
        <header class="topbar">
          <div class="breadcrumb">${activeTitle}</div>
          <div class="topbar-right"><span class="status-dot"></span> "YOU WERE OUT OF MY LEAGUE."</div>
        </header>
        <div class="page-body">
          <div class="content-scroll">
            <div class="content-grid">
              ${activeView()}
              <aside class="art-panel" aria-label="Decorative illustration">
                <div class="snowfall" aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span class="art-label">WELCOME TO THE</span>
                <div class="club-badge">CRUSH CLUB <span>✦</span></div>
                <div class="cassette-wrap" aria-hidden="true">
                  <div class="cassette">
                    <div class="cassette-label">
                      <span class="cassette-title">CRUSH MIX</span>
                      <span class="cassette-hearts">♥ ♥ ♥</span>
                    </div>
                    <div class="cassette-window">
                      <span class="tape-reel reel-left"><i></i></span>
                      <span class="tape-line"></span>
                      <span class="tape-reel reel-right"><i></i></span>
                    </div>
                    <div class="cassette-screws"><i></i><i></i></div>
                    <div class="cassette-bottom">SIDE A <span>♡</span> PLAY IT COOL</div>
                  </div>
                </div>
                <span class="art-caption">100% certified daydreamer</span>
              </aside>
            </div>
          </div>
          <footer class="page-footer"><span>TAKE WHAT YOU NEED, LEAVE THE REST TO FATE.</span><span>TRUST.</span></footer>
        </div>
      </main>
    </div>
  `;
  bindEvents();
}

function normalizeName(name) {
  return name.normalize('NFKD').toLocaleLowerCase().replace(/[\p{M}\p{P}\p{Z}\p{S}]/gu, '');
}

function flamesResult(firstName, secondName) {
  const first = normalizeName(firstName);
  const second = normalizeName(secondName);
  if (!first || !second) return null;
  const firstChars = [...first];
  const remaining = [...second];
  for (const char of firstChars) {
    const match = remaining.indexOf(char);
    if (match !== -1) {
      firstChars[firstChars.indexOf(char)] = '';
      remaining.splice(match, 1);
    }
  }
  const count = firstChars.filter(Boolean).length + remaining.length;
  const outcomes = [
    { letter: 'F', name: 'Friends', note: 'A friendship with its own kind of magic.' },
    { letter: 'L', name: 'Love', note: 'A little romance might be in the air.' },
    { letter: 'A', name: 'Affection', note: 'There’s a soft spot in this story.' },
    { letter: 'M', name: 'Marriage', note: 'The plot is taking a very serious turn.' },
    { letter: 'E', name: 'Enemies', note: 'A little rivalry keeps things interesting.' },
    { letter: 'S', name: 'Siblings', note: 'Or, if you prefer, S can stand for soulmates.' },
  ];
  if (!count) return { ...outcomes[1], note: 'A perfect match... or a very funny coincidence.' };
  let remainingLetters = outcomes.map((outcome) => outcome.letter);
  while (remainingLetters.length > 1) {
    const index = (count - 1) % remainingLetters.length;
    remainingLetters.splice(index, 1);
  }
  return outcomes.find((outcome) => outcome.letter === remainingLetters[0]);
}

function zodiacCompatibility(firstSign, secondSign) {
  const elementPair = [firstSign.element, secondSign.element].sort().join('-');
  return zodiacElementReadings[elementPair];
}

function bindEvents() {
  document.querySelectorAll('[data-tool]:not(:disabled)').forEach((button) => {
    button.addEventListener('click', () => {
      activeTool = button.dataset.tool;
      render();
    });
  });

  document.querySelectorAll('.name-form').forEach((form) => {
    form.querySelector('[data-form-action="example"]').addEventListener('click', () => {
      if (form.id === 'zodiac-form') {
        form.elements.firstSign.value = 'virgo';
        form.elements.secondSign.value = 'cancer';
      } else if (form.id === 'loves-form') {
        form.elements.firstName.value = 'Shagun';
        form.elements.secondName.value = 'Nirvan';
      } else {
        form.elements.firstName.value = 'Shagun';
        form.elements.secondName.value = 'Nirvan';
      }
      form.dataset.isExample = 'true';
      form.requestSubmit();
    });

    form.querySelector('[data-form-action="clear"]').addEventListener('click', () => {
      form.reset();
      form.closest('.game-card').querySelector('.result-wrap').replaceChildren();
      document.querySelector('.layout').classList.remove('has-result');
      (form.elements.firstName || form.elements.firstSign).focus();
    });
  });

  const flamesForm = document.querySelector('#flames-form');
  if (flamesForm) flamesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isExample = flamesForm.dataset.isExample === 'true';
    delete flamesForm.dataset.isExample;
    const data = new FormData(flamesForm);
    const result = flamesResult(data.get('firstName').trim(), data.get('secondName').trim());
    if (!result) return;
    document.querySelector('.layout').classList.add('has-result');
    document.querySelector('#flames-result').innerHTML = `
      <div class="result-card">
        <div class="result-copy"><span class="result-kicker">YOUR FLAMES RESULT</span><strong>${result.letter} <span>·</span> ${result.name}</strong><p>${result.note}</p></div>
        <span class="result-icon">${result.letter}</span>
      </div>`;
    if (!isExample) {
      notifyComparison('flames', data.get('firstName').trim(), data.get('secondName').trim(), `${result.letter} · ${result.name}`)
        .catch((error) => console.error('Unable to send the FLAMES webhook:', error));
    }
  });

  const loveForm = document.querySelector('#love-form');
  if (loveForm) loveForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const isExample = loveForm.dataset.isExample === 'true';
    delete loveForm.dataset.isExample;
    const data = new FormData(loveForm);
    const firstName = data.get('firstName').trim();
    const secondName = data.get('secondName').trim();
    let percentage;
    try {
      const response = await fetch('/api/love-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, secondName }),
      });
      if (!response.ok) throw new Error(`Love score API returned HTTP ${response.status}.`);
      const result = await response.json();
      percentage = result.percentage;
      if (percentage !== 'Infinity' && (!Number.isInteger(percentage) || percentage < 55 || percentage > 100)) {
        throw new Error('Love score API returned an invalid result.');
      }
      if (percentage === 'Infinity') percentage = Infinity;
    } catch (error) {
      console.error('Unable to calculate the love score:', error);
      document.querySelector('#love-result').textContent = 'Unable to calculate the love score. Please try again.';
      document.querySelector('.layout').classList.add('has-result');
      return;
    }
    document.querySelector('.layout').classList.add('has-result');
    document.querySelector('#love-result').innerHTML = `
      <div class="result-card love-result-card">
        <div class="result-copy"><span class="result-kicker">YOUR TOTALLY UNOFFICIAL SCORE</span><strong>${percentage}${Number.isFinite(percentage) ? '' : ' '}<small>%</small></strong><p>${percentage > 88 ? 'The universe is blushing a little.' : percentage > 72 ? 'There’s definitely a little spark here.' : 'Every good story has a surprise chapter.'}</p></div>
        <div class="score-ring" style="--score:${Number.isFinite(percentage) ? percentage : 100}"><span>${icons.heart}</span></div>
      </div>`;
    if (!isExample) {
      notifyComparison('love', firstName, secondName, Number.isFinite(percentage) ? percentage : 'Infinity')
        .catch((error) => console.error('Unable to send the love match webhook:', error));
    }
  });

  const zodiacForm = document.querySelector('#zodiac-form');
  if (zodiacForm) zodiacForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(zodiacForm);
    const firstSign = zodiacSigns.find((sign) => sign.id === data.get('firstSign'));
    const secondSign = zodiacSigns.find((sign) => sign.id === data.get('secondSign'));
    if (!firstSign || !secondSign) return;
    const result = zodiacCompatibility(firstSign, secondSign);
    document.querySelector('.layout').classList.add('has-result');
    document.querySelector('#zodiac-result').innerHTML = `
      <div class="zodiac-reading-heading">
        <span class="result-kicker">STAR LORE, NOT A SCORE</span>
        <h2>${result.title}</h2>
      </div>
      <div class="zodiac-pair">
        <div class="zodiac-sign-card"><span aria-hidden="true">${firstSign.symbol}</span><div><strong>${firstSign.name}</strong><small>${firstSign.dates} · ${firstSign.element}</small></div></div>
        <div class="zodiac-sign-card"><span aria-hidden="true">${secondSign.symbol}</span><div><strong>${secondSign.name}</strong><small>${secondSign.dates} · ${secondSign.element}</small></div></div>
      </div>
      <div class="zodiac-insights">
        <section><h3>The lore</h3><p>${result.lore}</p></section>
        <section><h3>IRL plot twist</h3><p>${result.plotTwist}</p></section>
        <section class="zodiac-question"><h3>Ask them this</h3><p>${result.ask}</p></section>
      </div>
      `;
  });

  const lovesForm = document.querySelector('#loves-form');
  if (lovesForm) lovesForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const isExample = lovesForm.dataset.isExample === 'true';
    delete lovesForm.dataset.isExample;
    const data = new FormData(lovesForm);
    const firstName = data.get('firstName').trim();
    const secondName = data.get('secondName').trim();
    const result = document.querySelector('#loves-result');
    if (!firstName || !secondName) {
      result.textContent = 'Add both names to build the pyramid.';
      document.querySelector('.layout').classList.add('has-result');
      return;
    }

    let rows;
    try {
      rows = calculateLovesPyramid(firstName, secondName);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      result.textContent = error.message;
      document.querySelector('.layout').classList.add('has-result');
      return;
    }

    const percentage = rows.at(-1).join('');
    let isDeveloperPair;
    try {
      const response = await fetch('/api/loves-developer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, secondName }),
      });
      if (!response.ok) throw new Error(`LOVES developer check returned HTTP ${response.status}.`);
      const check = await response.json();
      if (typeof check.isDeveloperPair !== 'boolean') {
        throw new Error('LOVES developer check returned an invalid response.');
      }
      isDeveloperPair = check.isDeveloperPair;
    } catch (error) {
      console.error('Unable to check the LOVES developer pair:', error);
      result.textContent = 'Unable to finish the LOVES result. Please try again.';
      document.querySelector('.layout').classList.add('has-result');
      return;
    }

    result.innerHTML = `
      <div class="result-card loves-score-card">
        <div class="result-copy"><span class="result-kicker">YOUR TOTALLY UNOFFICIAL LOVES RESULT</span><strong>${isDeveloperPair ? `<s class="loves-original-score">${percentage}%</s><span class="loves-infinity-score">Infinity%</span>` : `${percentage}<small>%</small>`}</strong><p>${isDeveloperPair ? 'The numbers tried. The developer said nah.' : 'Pure paper-game math. Absolutely not a forecast.'}</p></div>
      </div>
      <div class="loves-pyramid-shell ${isDeveloperPair ? 'is-developer-pair' : ''}">
        <div class="loves-pyramid" role="list" aria-label="LOVES letter count and number reduction steps">
          <div class="loves-pyramid-steps" style="--pyramid-width:${Math.max(...rows.map((row) => row.length)) * 36 - 5}px">
            ${rows.map((row, rowIndex) => `
              <div class="loves-step" role="listitem" style="--step-index:${rowIndex}" aria-label="${rowIndex === 0 ? `Letter counts: ${row.map((value, index) => `${'LOVES'[index]} ${value}`).join(', ')}` : `Reduction ${rowIndex}: ${row.join(', ')}`}">
                <span class="loves-step-label">${rowIndex === 0 ? 'LETTER COUNTS' : `STEP ${rowIndex}`}</span>
                <div class="loves-row">
                  ${row.map((value, index) => `<span class="loves-cell">${rowIndex === 0 ? `<small>${'LOVES'[index]}</small>` : ''}<b>${value}</b></span>`).join('')}
                </div>
              </div>
            `).join('')}
            ${isDeveloperPair ? `
              <div class="loves-developer-doodle" aria-hidden="true">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M5 8 C18 24, 35 45, 54 61 S70 77, 79 82" />
                  <path d="M4 93 C25 75, 44 53, 59 39 S78 16, 89 6" />
                </svg>
              </div>
            ` : ''}
          </div>
        </div>
      </div>`;
    lovesForm.closest('.game-card').querySelector('.loves-developer-note').classList.toggle('is-visible', isDeveloperPair);
    document.querySelector('.layout').classList.add('has-result');
    if (!isExample) {
      notifyComparison('loves', firstName, secondName, isDeveloperPair ? 'Infinity' : Number(percentage))
        .catch((error) => console.error('Unable to send the LOVES Pyramid webhook:', error));
    }
  });
}

render();
