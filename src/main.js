import './style.css';

const tools = [
  { id: 'flames', title: 'Flames', icon: '♡', tag: 'CLASSIC' },
  { id: 'love', title: 'Love Match', icon: '♡', tag: 'JUST FOR FUN' },
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
        <span class="brand-mark" aria-hidden="true">♡</span>
        <span class="brand-name">Épris<span class="brand-dot">.</span><small>FIRST LOVE, LITTLE GAMES</small></span>
      </a>
      <div class="side-label">YOUR LITTLE CORNER</div>
      <nav class="tool-nav" aria-label="Love games">
        ${tools.map((tool) => `
          <button class="nav-item ${tool.id === activeTool ? 'is-active' : ''} ${tool.disabled ? 'is-disabled' : ''}"
            data-tool="${tool.id}" ${tool.disabled ? 'disabled' : ''} ${tool.id === activeTool ? 'aria-current="page"' : ''}>
            <span class="nav-icon">${tool.icon}</span>
            <span class="nav-copy"><strong>${tool.title}</strong></span>
            ${tool.id === activeTool ? '<span class="nav-chevron">›</span>' : ''}
          </button>
        `).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-note"><span class="note-flower">✿</span><p>A tiny reminder:<br /><strong>this is all for fun.</strong></p></div>
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
          <span class="heading-sticker" aria-hidden="true">♡</span>
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
          <span class="heading-sticker" aria-hidden="true">♡</span>
          <span class="heading-copy"><strong>THE NAME GAME</strong><small>okay, spill the names...</small></span>
          <span class="heading-doodle" aria-hidden="true">✿</span>
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
      <div class="love-note"><span>“</span><p>Numbers are fun. Kindness is the real love language.</p><span>”</span></div>
    </section>
  `;
}

function render() {
  const isFlames = activeTool === 'flames';
  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <main class="main-area">
        <header class="topbar">
          <div class="breadcrumb">${isFlames ? 'Flames' : 'Love Match'}</div>
          <div class="topbar-right"><span class="status-dot"></span> "YOU WERE OUT OF MY LEAGUE."</div>
        </header>
        <div class="page-body">
          <div class="content-scroll">
            <div class="content-grid">
              ${isFlames ? renderFlames() : renderLove()}
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
          <footer class="page-footer"><span>TAKE WHAT YOU NEED, LEAVE THE REST TO FATE.</span><span>HAVE A LOVELY LITTLE DAY <b>♥</b></span></footer>
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

function lovePercentage(firstName, secondName) {
  const names = [normalizeName(firstName), normalizeName(secondName)].sort();
  const input = `${names[0]}:${names[1]}`;
  let hash = 0;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 55 + (hash % 46);
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
      form.elements.firstName.value = 'Shagun';
      form.elements.secondName.value = 'Nirvan';
      form.requestSubmit();
    });

    form.querySelector('[data-form-action="clear"]').addEventListener('click', () => {
      form.reset();
      form.closest('.game-card').querySelector('.result-wrap').replaceChildren();
      document.querySelector('.layout').classList.remove('has-result');
      form.elements.firstName.focus();
    });
  });

  const flamesForm = document.querySelector('#flames-form');
  if (flamesForm) flamesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(flamesForm);
    const result = flamesResult(data.get('firstName').trim(), data.get('secondName').trim());
    if (!result) return;
    document.querySelector('.layout').classList.add('has-result');
    document.querySelector('#flames-result').innerHTML = `
      <div class="result-card">
        <div class="result-copy"><span class="result-kicker">YOUR FLAMES RESULT</span><strong>${result.letter} <span>·</span> ${result.name}</strong><p>${result.note}</p></div>
        <span class="result-icon">${result.letter}</span>
      </div>`;
  });

  const loveForm = document.querySelector('#love-form');
  if (loveForm) loveForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(loveForm);
    const firstName = data.get('firstName').trim();
    const secondName = data.get('secondName').trim();
    const percentage = lovePercentage(firstName, secondName);
    document.querySelector('.layout').classList.add('has-result');
    document.querySelector('#love-result').innerHTML = `
      <div class="result-card love-result-card">
        <div class="result-copy"><span class="result-kicker">YOUR TOTALLY UNOFFICIAL SCORE</span><strong>${percentage}<small>%</small></strong><p>${percentage > 88 ? 'The universe is blushing a little.' : percentage > 72 ? 'There’s definitely a little spark here.' : 'Every good story has a surprise chapter.'}</p></div>
        <div class="score-ring" style="--score:${percentage}"><span>${icons.heart}</span></div>
      </div>`;
  });
}

render();
