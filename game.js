(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const shell = document.getElementById('shell');

  const ui = {
    title: document.getElementById('uiTitle'),
    subtitle: document.getElementById('uiSubtitle'),
    labelScore: document.getElementById('labelScore'),
    labelLives: document.getElementById('labelLives'),
    labelCombo: document.getElementById('labelCombo'),
    labelTime: document.getElementById('labelTime'),
    scoreValue: document.getElementById('scoreValue'),
    livesValue: document.getElementById('livesValue'),
    comboValue: document.getElementById('comboValue'),
    timeValue: document.getElementById('timeValue'),
    statusPill: document.getElementById('statusPill'),
    tipPill: document.getElementById('tipPill'),
    menuScreen: document.getElementById('menuScreen'),
    settingsScreen: document.getElementById('settingsScreen'),
    pauseScreen: document.getElementById('pauseScreen'),
    resultScreen: document.getElementById('resultScreen'),
    menuEyebrow: document.getElementById('menuEyebrow'),
    menuTitle: document.getElementById('menuTitle'),
    menuText: document.getElementById('menuText'),
    hintControls: document.getElementById('hintControls'),
    hintGoal: document.getElementById('hintGoal'),
    settingsTitle: document.getElementById('settingsTitle'),
    languageLabel: document.getElementById('languageLabel'),
    languageDesc: document.getElementById('languageDesc'),
    soundLabel: document.getElementById('soundLabel'),
    soundDesc: document.getElementById('soundDesc'),
    audioNote: document.getElementById('audioNote'),
    pauseTitle: document.getElementById('pauseTitle'),
    pauseText: document.getElementById('pauseText'),
    resultBadge: document.getElementById('resultBadge'),
    resultTitle: document.getElementById('resultTitle'),
    resultText: document.getElementById('resultText'),
    resultStats: document.getElementById('resultStats'),
    startBtn: document.getElementById('startBtn'),
    menuSettingsBtn: document.getElementById('menuSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    pauseRestartBtn: document.getElementById('pauseRestartBtn'),
    pauseMenuBtn: document.getElementById('pauseMenuBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    resultMenuBtn: document.getElementById('resultMenuBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    langRuBtn: document.getElementById('langRuBtn'),
    langEnBtn: document.getElementById('langEnBtn'),
    soundToggle: document.getElementById('soundToggle'),
  };

  const STORAGE_KEY = 'space-cat-food-catcher-6';
  const MAX_TIME = 900;
  const MAX_LIVES = 5;
  const START_LIVES = 3;
  const WAVE_SECONDS = 90;

  const balance = {
    target_session_length_sec: 900,
    score_rules: { food_common: 10, food_rare: 25, food_premium: 40, wave_clear_bonus: 150, no_hit_wave_bonus: 100, bomb_score_penalty: -75, min_score_floor: 0 },
    combo: { window_sec: 2.2, tiers: [1, 1.15, 1.3, 1.5, 1.75, 2] },
    waves: [
      { food_spawn_sec: [1.2, 1.45], bomb_spawn_sec: [7.5, 9.0], speed_mult: 1.0, rare_chance: 0.05 },
      { food_spawn_sec: [1.12, 1.35], bomb_spawn_sec: [6.8, 8.2], speed_mult: 1.06, rare_chance: 0.06 },
      { food_spawn_sec: [1.05, 1.28], bomb_spawn_sec: [6.0, 7.4], speed_mult: 1.12, rare_chance: 0.08 },
      { food_spawn_sec: [0.98, 1.22], bomb_spawn_sec: [5.4, 6.8], speed_mult: 1.18, rare_chance: 0.1 },
      { food_spawn_sec: [0.92, 1.16], bomb_spawn_sec: [4.8, 6.0], speed_mult: 1.24, rare_chance: 0.12 },
      { food_spawn_sec: [0.86, 1.08], bomb_spawn_sec: [4.2, 5.4], speed_mult: 1.31, rare_chance: 0.14 },
      { food_spawn_sec: [0.8, 1.0], bomb_spawn_sec: [3.8, 4.8], speed_mult: 1.38, rare_chance: 0.16 },
      { food_spawn_sec: [0.72, 0.92], bomb_spawn_sec: [3.3, 4.2], speed_mult: 1.46, rare_chance: 0.18 },
      { food_spawn_sec: [0.64, 0.84], bomb_spawn_sec: [2.8, 3.6], speed_mult: 1.55, rare_chance: 0.22 },
      { food_spawn_sec: [0.56, 0.74], bomb_spawn_sec: [2.3, 3.0], speed_mult: 1.65, rare_chance: 0.26 },
    ],
  };

  const i18n = {
    ru: {
      uiTitle: 'Space Cat Food Catcher',
      uiSubtitle: 'Неоновая космо-кухня',
      menuEyebrow: 'Аркада • Мобайл • Неон',
      menuTitle: 'Космический кот ловит еду',
      menuText: 'Лови космическую еду, уворачивайся от бомб и продержись 15 минут.',
      hintControls: 'Drag / swipe / arrows / WASD',
      hintGoal: 'Победа — выжить 15:00',
      startBtn: 'Играть',
      menuSettingsBtn: 'Настройки',
      settingsTitle: 'Настройки',
      languageLabel: 'Язык',
      languageDesc: 'RU / EN',
      soundLabel: 'Аудио',
      soundDesc: 'Процедурный fallback / mute',
      audioNote: 'Локальные аудиофайлы не включены; при включённом звуке используется процедурный fallback.',
      saveSettingsBtn: 'Сохранить',
      closeSettingsBtn: 'Назад',
      pauseTitle: 'Пауза',
      pauseText: 'Игру можно продолжить в любой момент.',
      resumeBtn: 'Продолжить',
      pauseRestartBtn: 'Перезапуск',
      pauseMenuBtn: 'В меню',
      resultWinTitle: 'Победа!',
      resultLoseTitle: 'Поражение',
      resultWinText: 'Ты дожил до конца забега и собрал отличный космический ужин.',
      resultLoseText: 'Коты тоже ошибаются. Попробуй ещё раз — забег начнётся быстро.',
      playAgainBtn: 'Играть ещё раз',
      resultMenuBtn: 'В меню',
      score: 'Счёт',
      lives: 'Жизни',
      combo: 'Комбо',
      time: 'Время',
      ready: 'Готово',
      playHint: 'Потяни кота пальцем или мышью',
      pauseHint: 'Esc / Pause',
      waveLabel: 'Волна',
      bestLabel: 'Лучший счёт',
      timeLabel: 'Время',
      caughtLabel: 'Еды',
      waveLabelLong: 'Волна',
      bombLabel: 'Удары бомб',
      comboLabel: 'Макс. комбо',
      winBadge: '✦',
      loseBadge: '☄',
      audioOn: 'Вкл',
      audioOff: 'Выкл',
      languageRu: 'Русский',
      languageEn: 'English',
      settingsSaved: 'Настройки сохранены',
      resultWave: 'Достигнутая волна',
      resultCause: 'Причина',
      causeWin: 'Таймер 15:00',
      causeLose: 'Жизни закончились',
      controls: 'Управление: drag / touch / arrows / WASD',
    },
    en: {
      uiTitle: 'Space Cat Food Catcher',
      uiSubtitle: 'Neon space kitchen',
      menuEyebrow: 'Arcade • Mobile • Neon',
      menuTitle: 'Space Cat Food Catcher',
      menuText: 'Catch cosmic food, dodge bombs, and survive the full 15-minute run.',
      hintControls: 'Drag / swipe / arrows / WASD',
      hintGoal: 'Win by surviving to 15:00',
      startBtn: 'Play',
      menuSettingsBtn: 'Settings',
      settingsTitle: 'Settings',
      languageLabel: 'Language',
      languageDesc: 'RU / EN',
      soundLabel: 'Audio',
      soundDesc: 'Procedural fallback / mute',
      audioNote: 'No local audio files are bundled; when enabled, the build uses procedural fallback sounds.',
      saveSettingsBtn: 'Save',
      closeSettingsBtn: 'Back',
      pauseTitle: 'Paused',
      pauseText: 'You can resume the run at any time.',
      resumeBtn: 'Resume',
      pauseRestartBtn: 'Restart',
      pauseMenuBtn: 'Menu',
      resultWinTitle: 'You win!',
      resultLoseTitle: 'Game Over',
      resultWinText: 'You survived the full run and served up a stellar space dinner.',
      resultLoseText: 'Cats make mistakes too. Jump back in and chase a better run.',
      playAgainBtn: 'Play again',
      resultMenuBtn: 'Menu',
      score: 'Score',
      lives: 'Lives',
      combo: 'Combo',
      time: 'Time',
      ready: 'Ready',
      playHint: 'Drag the cat with your finger or mouse',
      pauseHint: 'Esc / Pause',
      waveLabel: 'Wave',
      bestLabel: 'Best',
      timeLabel: 'Time',
      caughtLabel: 'Caught',
      waveLabelLong: 'Wave',
      bombLabel: 'Bomb hits',
      comboLabel: 'Best combo',
      winBadge: '✦',
      loseBadge: '☄',
      audioOn: 'On',
      audioOff: 'Off',
      languageRu: 'Русский',
      languageEn: 'English',
      settingsSaved: 'Settings saved',
      resultWave: 'Reached wave',
      resultCause: 'Cause',
      causeWin: '15:00 timer',
      causeLose: 'Lives depleted',
      controls: 'Controls: drag / touch / arrows / WASD',
    },
  };

  const state = {
    screen: 'menu',
    language: load('language', guessLanguage()),
    soundOn: load('soundOn', '1') !== '0',
    score: 0,
    bestScore: Number(load('bestScore', '0')) || 0,
    lives: START_LIVES,
    comboChain: 0,
    comboMult: 1,
    comboBest: 1,
    elapsed: 0,
    next30Bonus: 30,
    nextWaveBonusAt: WAVE_SECONDS,
    waveIndex: 0,
    waveHits: 0,
    waveBombHits: 0,
    totalCaught: 0,
    totalBombHits: 0,
    shake: 0,
    flash: 0,
    paused: false,
    running: false,
    gameOverReason: '',
    transition: 0,
    objects: [],
    particles: [],
    stars: buildStars(),
    player: {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      vx: 0,
      vy: 0,
      tilt: 0,
      blink: 0,
      hurt: 0,
      winPulse: 0,
    },
    pointer: { active: false, down: false, x: 0, y: 0, mode: 'mouse' },
    keys: new Set(),
    audioReady: false,
    audioCtx: null,
    audioGain: null,
    width: 0,
    height: 0,
    dpr: 1,
    lastTime: performance.now(),
    spawnFoodAt: 0,
    spawnBombAt: 0,
    message: '',
    reducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    focusPause: false,
  };

  const audioIds = {
    collect: 'sfx_collect',
    combo: 'sfx_collect_combo',
    hit: 'sfx_hit_bomb',
    ui: 'sfx_pause_ui',
    over: 'sfx_game_over',
  };

  const keyMap = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down',
    KeyR: 'restart', Escape: 'pause', Space: 'pause', KeyP: 'pause',
  };

  function guessLanguage() {
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('ru') ? 'ru' : 'en';
  }

  function save(key, value) {
    try { localStorage.setItem(`${STORAGE_KEY}:${key}`, String(value)); } catch (_) {}
  }

  function load(key, fallback) {
    try {
      const value = localStorage.getItem(`${STORAGE_KEY}:${key}`);
      return value == null ? fallback : value;
    } catch (_) { return fallback; }
  }

  function tr(key) {
    return i18n[state.language][key] ?? i18n.en[key] ?? key;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function buildStars() {
    const stars = [];
    const count = 160;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(), y: Math.random(), z: Math.random(),
        size: rand(0.5, 2.2), speed: rand(0.02, 0.18), hue: Math.random() < 0.1 ? 'violet' : 'cyan',
      });
    }
    return stars;
  }

  function currentWaveIndex(sec) {
    return Math.min(balance.waves.length - 1, Math.floor(sec / WAVE_SECONDS));
  }

  function currentWave(sec) {
    return balance.waves[currentWaveIndex(sec)];
  }

  function waveProgress(sec) {
    return Math.floor(sec / WAVE_SECONDS) + 1;
  }

  function resetGame() {
    state.score = 0;
    state.lives = START_LIVES;
    state.comboChain = 0;
    state.comboMult = 1;
    state.comboBest = 1;
    state.elapsed = 0;
    state.next30Bonus = 30;
    state.nextWaveBonusAt = WAVE_SECONDS;
    state.waveIndex = 0;
    state.waveHits = 0;
    state.waveBombHits = 0;
    state.totalCaught = 0;
    state.totalBombHits = 0;
    state.shake = 0;
    state.flash = 0;
    state.paused = false;
    state.running = true;
    state.gameOverReason = '';
    state.transition = 0;
    state.objects.length = 0;
    state.particles.length = 0;
    state.spawnFoodAt = 0.2;
    state.spawnBombAt = 2.0;
    state.message = tr('playHint');
    const pad = 0.14;
    state.player.x = 0.5;
    state.player.y = 0.84;
    state.player.tx = state.player.x;
    state.player.ty = state.player.y;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.tilt = 0;
    state.player.blink = 0;
    state.player.hurt = 0;
    state.player.winPulse = 0;
    syncLanguage();
    setOverlay('game');
    updateStatus(tr('ready'));
    updateButtons();
    syncHUD();
  }

  function startGame() {
    initAudio();
    resetGame();
    state.screen = 'game';
    setOverlay('none');
    updateStatus(tr('ready'));
    state.lastTime = performance.now();
    if (!state.running) state.running = true;
    playTone('ui');
  }

  function endGame(win) {
    state.running = false;
    state.paused = false;
    state.screen = 'result';
    state.gameOverReason = win ? 'win' : 'lose';
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      save('bestScore', state.bestScore);
    }
    showResult(win);
    setOverlay('result');
    updateStatus(win ? tr('winBadge') : tr('loseBadge'));
    playTone(win ? 'ui' : 'over');
  }

  function pauseGame() {
    if (state.screen !== 'game' || !state.running) return;
    state.paused = true;
    state.screen = 'pause';
    setOverlay('pause');
    updateStatus(tr('pauseHint'));
    playTone('ui');
  }

  function resumeGame() {
    if (!state.running && state.screen !== 'pause') return;
    state.paused = false;
    state.screen = 'game';
    setOverlay('none');
    updateStatus(tr('ready'));
    state.lastTime = performance.now();
    playTone('ui');
  }

  function goMenu() {
    state.screen = 'menu';
    state.running = false;
    state.paused = false;
    state.score = 0;
    state.lives = START_LIVES;
    state.comboChain = 0;
    state.comboMult = 1;
    state.elapsed = 0;
    state.totalCaught = 0;
    state.totalBombHits = 0;
    state.waveHits = 0;
    state.waveBombHits = 0;
    state.objects.length = 0;
    state.particles.length = 0;
    state.player.x = state.width * 0.5 || 0;
    state.player.y = state.height * 0.84 || 0;
    state.player.tx = state.player.x;
    state.player.ty = state.player.y;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.tilt = 0;
    state.player.blink = 0;
    state.player.hurt = 0;
    state.player.winPulse = 0;
    syncHUD();
    setOverlay('menu');
    updateStatus(tr('ready'));
    updateButtons();
  }

  function setOverlay(name) {
    for (const el of [ui.menuScreen, ui.settingsScreen, ui.pauseScreen, ui.resultScreen]) {
      el.classList.remove('is-visible');
    }
    if (name === 'menu') ui.menuScreen.classList.add('is-visible');
    if (name === 'settings') ui.settingsScreen.classList.add('is-visible');
    if (name === 'pause') ui.pauseScreen.classList.add('is-visible');
    if (name === 'result') ui.resultScreen.classList.add('is-visible');
  }

  function openSettings() {
    state.screen = 'settings';
    setOverlay('settings');
    syncLanguage();
    updateButtons();
    playTone('ui');
  }

  function saveSettings() {
    save('language', state.language);
    save('soundOn', state.soundOn ? '1' : '0');
    updateStatus(tr('settingsSaved'));
    playTone('ui');
    if (state.screen === 'settings') {
      if (state.running) setOverlay('none'); else setOverlay('menu');
      state.screen = state.running ? 'game' : 'menu';
    }
    syncLanguage();
    updateButtons();
  }

  function syncLanguage() {
    const t = i18n[state.language];
    ui.title.textContent = t.uiTitle;
    ui.subtitle.textContent = t.uiSubtitle;
    ui.labelScore.textContent = t.score;
    ui.labelLives.textContent = t.lives;
    ui.labelCombo.textContent = t.combo;
    ui.labelTime.textContent = t.time;
    ui.menuEyebrow.textContent = t.menuEyebrow;
    ui.menuTitle.textContent = t.menuTitle;
    ui.menuText.textContent = t.menuText;
    ui.hintControls.textContent = t.hintControls;
    ui.hintGoal.textContent = t.hintGoal;
    ui.startBtn.textContent = t.startBtn;
    ui.menuSettingsBtn.textContent = t.menuSettingsBtn;
    ui.settingsTitle.textContent = t.settingsTitle;
    ui.languageLabel.textContent = t.languageLabel;
    ui.languageDesc.textContent = t.languageDesc;
    ui.soundLabel.textContent = t.soundLabel;
    ui.soundDesc.textContent = t.soundDesc;
    ui.audioNote.textContent = t.audioNote;
    ui.saveSettingsBtn.textContent = t.saveSettingsBtn;
    ui.closeSettingsBtn.textContent = t.closeSettingsBtn;
    ui.pauseTitle.textContent = t.pauseTitle;
    ui.pauseText.textContent = t.pauseText;
    ui.resumeBtn.textContent = t.resumeBtn;
    ui.pauseRestartBtn.textContent = t.pauseRestartBtn;
    ui.pauseMenuBtn.textContent = t.pauseMenuBtn;
    ui.playAgainBtn.textContent = t.playAgainBtn;
    ui.resultMenuBtn.textContent = t.resultMenuBtn;
    ui.statusPill.textContent = state.message || t.ready;
    ui.tipPill.textContent = t.controls;
    ui.langRuBtn.textContent = t.languageRu;
    ui.langEnBtn.textContent = t.languageEn;
    ui.soundToggle.textContent = state.soundOn ? t.audioOn : t.audioOff;
    ui.soundToggle.dataset.on = state.soundOn ? 'true' : 'false';
    ui.langRuBtn.setAttribute('aria-pressed', String(state.language === 'ru'));
    ui.langEnBtn.setAttribute('aria-pressed', String(state.language === 'en'));
  }

  function updateButtons() {
    syncLanguage();
  }

  function updateStatus(message) {
    state.message = message;
    ui.statusPill.textContent = message;
  }

  function syncHUD() {
    ui.scoreValue.textContent = formatScore(state.score);
    ui.livesValue.textContent = `${state.lives}/${MAX_LIVES}`;
    ui.comboValue.textContent = `x${state.comboMult.toFixed(2)}`;
    ui.timeValue.textContent = formatTime(Math.max(0, MAX_TIME - state.elapsed));
  }

  function formatScore(n) {
    return Math.max(0, Math.floor(n)).toString();
  }

  function formatTime(sec) {
    const total = Math.max(0, Math.ceil(sec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function showResult(win) {
    const t = i18n[state.language];
    ui.resultBadge.textContent = win ? t.winBadge : t.loseBadge;
    ui.resultTitle.textContent = win ? t.resultWinTitle : t.resultLoseTitle;
    ui.resultText.textContent = win ? t.resultWinText : t.resultLoseText;
    ui.resultStats.innerHTML = [
      statCard(t.score, formatScore(state.score)),
      statCard(t.bestLabel, formatScore(state.bestScore)),
      statCard(t.resultWave, String(waveProgress(state.elapsed))),
      statCard(t.caughtLabel, String(state.totalCaught)),
      statCard(t.bombLabel, String(state.totalBombHits)),
      statCard(t.comboLabel, `x${state.comboBest.toFixed(2)}`),
    ].join('');
  }

  function statCard(label, value) {
    return `<div class="result-stat"><span class="result-stat__label">${escapeHtml(label)}</span><span class="result-stat__value">${escapeHtml(value)}</span></div>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]+/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * state.dpr);
    canvas.height = Math.round(rect.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function initAudio() {
    if (state.audioReady || !state.soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      state.audioCtx = new AudioContextClass();
      state.audioGain = state.audioCtx.createGain();
      state.audioGain.gain.value = 0.09;
      state.audioGain.connect(state.audioCtx.destination);
      state.audioReady = true;
    } catch (_) {
      state.audioReady = false;
    }
  }

  function playTone(kind) {
    if (!state.soundOn || !state.audioReady || !state.audioCtx || !state.audioGain) return;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    const tones = {
      ui: { freq: 520, dur: 0.08, type: 'triangle', gain: 0.08 },
      collect: { freq: 760, dur: 0.08, type: 'sine', gain: 0.09 },
      combo: { freq: 960, dur: 0.12, type: 'triangle', gain: 0.11 },
      hit: { freq: 120, dur: 0.18, type: 'square', gain: 0.12 },
      over: { freq: 84, dur: 0.45, type: 'sawtooth', gain: 0.09 },
    }[kind] || { freq: 440, dur: 0.08, type: 'sine', gain: 0.05 };
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tones.type;
    osc.frequency.setValueAtTime(tones.freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, tones.freq * 0.72), now + tones.dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(tones.gain, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tones.dur);
    osc.connect(gain).connect(state.audioGain);
    osc.start(now);
    osc.stop(now + tones.dur + 0.02);
  }

  function spawnFood() {
    const wave = currentWave(state.elapsed);
    const rarity = wave.rare_chance;
    const p = Math.random();
    let kind = 'fish';
    let value = balance.score_rules.food_common;
    let radius = 17;
    if (p < rarity * 0.2) { kind = 'cookie'; value = balance.score_rules.food_premium; radius = 18; }
    else if (p < rarity) { kind = 'burger'; value = balance.score_rules.food_rare; radius = 18; }
    const x = rand(42, state.width - 42);
    const baseVy = rand(120, 180) * wave.speed_mult;
    state.objects.push({
      type: 'food', kind, x, y: -32, vx: rand(-12, 12), vy: baseVy, rot: rand(0, Math.PI * 2), spin: rand(-1.6, 1.6),
      radius, value, pulse: 0, glow: kind === 'cookie' ? 1.2 : kind === 'burger' ? 1.05 : 0.95,
    });
  }

  function spawnBomb() {
    const wave = currentWave(state.elapsed);
    const x = rand(34, state.width - 34);
    const baseVy = rand(150, 220) * wave.speed_mult;
    state.objects.push({
      type: 'bomb', x, y: -36, vx: rand(-22, 22), vy: baseVy, rot: rand(0, Math.PI * 2), spin: rand(-2.0, 2.0),
      radius: 20, pulse: rand(0, Math.PI * 2), armed: 1,
    });
  }

  function addParticles(x, y, color, count, power, mode = 'burst') {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + rand(-0.4, 0.4);
      const sp = rand(50, 210) * power;
      state.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rand(0, 60), life: rand(0.28, 0.62),
        age: 0, color, size: rand(2, 4.5) * power, mode,
      });
    }
  }

  function addStarBurst(x, y, color) {
    addParticles(x, y, color, 14, 1.0, 'spark');
  }

  function onFoodCatch(obj, px, py) {
    state.totalCaught++;
    state.waveHits++;
    state.comboChain++;
    state.comboMult = balance.combo.tiers[Math.min(balance.combo.tiers.length - 1, Math.max(0, state.comboChain - 1))];
    state.comboBest = Math.max(state.comboBest, state.comboMult);
    state.score += Math.round(obj.value * state.comboMult);
    state.score = Math.max(0, state.score);
    if (state.comboChain > 0 && state.comboChain % 5 === 0) state.score += 50;
    state.player.blink = 0.18;
    state.player.winPulse = Math.min(1, state.player.winPulse + 0.1);
    addStarBurst(px, py, obj.kind === 'cookie' ? '#ffd54a' : obj.kind === 'burger' ? '#ff9b3d' : '#7fe7ff');
    playTone(state.comboChain > 2 ? 'combo' : 'collect');
    updateStatus(`${tr('score')}: ${formatScore(state.score)}`);
  }

  function onBombHit(obj, px, py) {
    if (state.player.hurt > 0) return;
    state.totalBombHits++;
    state.waveBombHits++;
    state.waveHits = 0;
    state.lives = clamp(state.lives - 1, 0, MAX_LIVES);
    state.score = Math.max(balance.score_rules.min_score_floor, state.score + balance.score_rules.bomb_score_penalty);
    state.comboChain = 0;
    state.comboMult = 1;
    state.shake = 0.28;
    state.flash = 0.22;
    state.player.hurt = 1.2;
    addParticles(px, py, '#ff4d5e', 18, 1.15, 'hit');
    playTone('hit');
    if (navigator.vibrate) navigator.vibrate(24);
    if (state.lives <= 0) {
      endGame(false);
      return;
    }
    updateStatus(`${tr('lives')}: ${state.lives}`);
  }

  function processPlayerInput(dt) {
    const p = state.player;
    const moveX = (state.keys.has('right') ? 1 : 0) - (state.keys.has('left') ? 1 : 0);
    const moveY = (state.keys.has('down') ? 1 : 0) - (state.keys.has('up') ? 1 : 0);
    const deadZone = Math.min(state.width, state.height) * 0.1;
    let targetX = p.tx;
    let targetY = p.ty;
    if (state.pointer.active) {
      targetX = state.pointer.x;
      targetY = state.pointer.y;
    } else if (moveX || moveY) {
      targetX += moveX * dt * 420;
      targetY += moveY * dt * 330;
    }
    p.tx = clamp(targetX, 32, state.width - 32);
    p.ty = clamp(targetY, state.height * 0.58, state.height - deadZone);
    p.x = lerp(p.x, p.tx, 1 - Math.pow(0.001, dt));
    p.y = lerp(p.y, p.ty, 1 - Math.pow(0.001, dt));
    p.vx = (p.tx - p.x) * 3.6;
    p.vy = (p.ty - p.y) * 3.6;
    p.tilt = clamp(p.vx / 260, -0.35, 0.35);
    if (Math.abs(moveX) + Math.abs(moveY) > 0.01 || state.pointer.active) {
      p.blink = Math.max(0, p.blink - dt);
    }
  }

  function updateSpawns(dt) {
    const wave = currentWave(state.elapsed);
    state.spawnFoodAt -= dt;
    state.spawnBombAt -= dt;
    while (state.spawnFoodAt <= 0) {
      spawnFood();
      state.spawnFoodAt += rand(wave.food_spawn_sec[0], wave.food_spawn_sec[1]);
    }
    while (state.spawnBombAt <= 0) {
      spawnBomb();
      state.spawnBombAt += rand(wave.bomb_spawn_sec[0], wave.bomb_spawn_sec[1]);
    }
  }

  function updateWaveBonuses(prevElapsed, nowElapsed) {
    while (state.next30Bonus <= nowElapsed) {
      state.score += 20;
      state.next30Bonus += 30;
      addParticles(state.width * 0.5, state.height * 0.14, '#7fe7ff', 10, 0.5, 'spark');
      updateStatus(`+20 ${tr('timeLabel')}`);
    }
    while (state.nextWaveBonusAt <= nowElapsed) {
      state.score += balance.score_rules.wave_clear_bonus;
      if (state.waveBombHits === 0) state.score += balance.score_rules.no_hit_wave_bonus;
      const waveIndex = Math.min(balance.waves.length - 1, Math.floor((state.nextWaveBonusAt - 1) / WAVE_SECONDS));
      state.waveBombHits = 0;
      state.waveHits = 0;
      state.nextWaveBonusAt += WAVE_SECONDS;
      addParticles(state.width * 0.5, state.height * 0.2, '#a56cff', 14, 0.8, 'spark');
      updateStatus(`${tr('waveLabel')} ${waveIndex + 1}`);
    }
  }

  function updateObjects(dt) {
    const p = state.player;
    const px = p.x;
    const py = p.y;
    const catRadius = 28;
    const catRadiusSq = catRadius * catRadius;
    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];
      obj.y += obj.vy * dt;
      obj.x += obj.vx * dt;
      obj.rot += obj.spin * dt;
      if (obj.type === 'food') obj.pulse += dt * 6;
      else obj.pulse += dt * 10;
      if (obj.x < 18 || obj.x > state.width - 18) obj.vx *= -1;
      if (obj.y > state.height + 50) { state.objects.splice(i, 1); continue; }
      const dx = obj.x - px;
      const dy = obj.y - py;
      const r = obj.radius + catRadius;
      if (dx * dx + dy * dy <= r * r) {
        state.objects.splice(i, 1);
        if (obj.type === 'food') onFoodCatch(obj, obj.x, obj.y);
        else onBombHit(obj, obj.x, obj.y);
      }
    }
  }

  function updateParticles(dt) {
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.age += dt;
      if (p.age >= p.life) { state.particles.splice(i, 1); continue; }
      const t = p.age / p.life;
      p.x += p.vx * dt * (p.mode === 'spark' ? 0.5 : 1);
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy += 50 * dt;
      p.alpha = 1 - t;
    }
  }

  function updateGameplay(dt) {
    if (!state.running || state.paused || state.screen !== 'game') return;
    const prevElapsed = state.elapsed;
    state.elapsed += dt;
    state.waveIndex = currentWaveIndex(state.elapsed);
    if (state.elapsed >= MAX_TIME) {
      state.elapsed = MAX_TIME;
      state.score += 500;
      endGame(true);
      return;
    }
    updateWaveBonuses(prevElapsed, state.elapsed);
    processPlayerInput(dt);
    updateSpawns(dt);
    updateObjects(dt);
    updateParticles(dt);
    state.player.hurt = Math.max(0, state.player.hurt - dt);
    state.player.blink = Math.max(0, state.player.blink - dt);
    state.player.winPulse = Math.max(0, state.player.winPulse - dt * 0.4);
    state.shake = Math.max(0, state.shake - dt * 3.5);
    state.flash = Math.max(0, state.flash - dt * 3.8);
    syncHUD();
  }

  function drawBackground(t) {
    const w = state.width;
    const h = state.height;
    ctx.fillStyle = '#081126';
    ctx.fillRect(0, 0, w, h);

    // Kitchen gradients / distant nebula
    const g = ctx.createRadialGradient(w * 0.28, h * 0.2, 20, w * 0.4, h * 0.25, Math.max(w, h) * 0.9);
    g.addColorStop(0, 'rgba(165,108,255,0.16)');
    g.addColorStop(0.35, 'rgba(127,231,255,0.08)');
    g.addColorStop(1, 'rgba(8,17,38,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const floorY = h * 0.84;
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgba(17,27,58,0.85)';
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.fillStyle = 'rgba(127,231,255,0.08)';
    for (let x = -30; x < w + 60; x += 86) ctx.fillRect((x + (t * 24) % 86), floorY + 10, 54, 4);
    ctx.restore();

    // HUD-safe kitchen rails
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = 'rgba(127,231,255,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.12);
    ctx.lineTo(w, h * 0.12);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(165,108,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.14);
    ctx.lineTo(w, h * 0.14);
    ctx.stroke();
    ctx.restore();

    // Stars/parallax
    for (const star of state.stars) {
      const layer = 0.5 + star.z * 1.9;
      const sx = (star.x * w + t * 18 * layer * star.speed) % (w + 40) - 20;
      const sy = (star.y * h + t * 12 * layer * star.speed * 0.6) % (h + 40) - 20;
      const alpha = 0.16 + star.z * 0.72;
      ctx.fillStyle = star.hue === 'violet' ? `rgba(165,108,255,${alpha})` : `rgba(127,231,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, star.size * (0.8 + star.z), 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating dish rails and tiny beacons
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = 'rgba(255,213,74,0.14)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const y = h * (0.2 + i * 0.16);
      ctx.beginPath();
      ctx.moveTo(w * 0.1, y);
      ctx.quadraticCurveTo(w * 0.5, y - 20, w * 0.9, y + 8);
      ctx.stroke();
    }
    ctx.restore();

    if (state.flash > 0) {
      ctx.save();
      ctx.globalAlpha = state.flash * 0.36;
      ctx.fillStyle = '#ff4d5e';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  function drawFood(obj) {
    const scale = 1 + Math.sin(obj.pulse) * 0.04;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.rot);
    ctx.scale(scale, scale);
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, obj.radius * 2.2);
    glow.addColorStop(0, obj.kind === 'cookie' ? 'rgba(255,213,74,0.46)' : obj.kind === 'burger' ? 'rgba(255,155,61,0.40)' : 'rgba(127,231,255,0.40)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, obj.radius * 2.0, 0, Math.PI * 2);
    ctx.fill();

    if (obj.kind === 'fish') {
      ctx.fillStyle = '#7fe7ff';
      ctx.strokeStyle = 'rgba(255,255,255,0.36)';
      ctx.lineWidth = 2;
      roundFish(obj.radius);
    } else if (obj.kind === 'burger') {
      drawBurger(obj.radius);
    } else {
      drawCookie(obj.radius);
    }
    ctx.restore();
  }

  function roundFish(r) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-r * 1.1, 0);
    ctx.quadraticCurveTo(-r * 0.45, -r * 0.9, r * 0.7, -r * 0.4);
    ctx.quadraticCurveTo(r * 1.2, 0, r * 0.72, r * 0.48);
    ctx.quadraticCurveTo(-r * 0.45, r * 0.9, -r * 1.1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(8,17,38,0.92)';
    ctx.beginPath();
    ctx.arc(-r * 0.42, -r * 0.1, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe8c7';
    ctx.beginPath();
    ctx.moveTo(-r * 1.08, 0);
    ctx.lineTo(-r * 1.48, -r * 0.28);
    ctx.lineTo(-r * 1.48, r * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawBurger(r) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-r * 1.0, -r * 0.55, r * 2.0, r * 1.1, r * 0.6);
    ctx.fillStyle = '#ff9b3d';
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(-r * 1.05, -r * 0.15, r * 2.1, r * 0.38, r * 0.18);
    ctx.fillStyle = '#ff4d5e';
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(-r * 0.95, -r * 0.78, r * 1.9, r * 0.54, r * 0.5);
    ctx.fillStyle = '#ffd54a';
    ctx.fill();
    ctx.globalAlpha = 0.36;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawCookie(r) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      const x = Math.cos(a) * (r * 1.05);
      const y = Math.sin(a) * (r * 1.05);
      if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      const b = a + Math.PI / 5;
      ctx.lineTo(Math.cos(b) * (r * 0.46), Math.sin(b) * (r * 0.46));
    }
    ctx.closePath();
    ctx.fillStyle = '#ffd54a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.38)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#7fe7ff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBomb(obj) {
    const bob = Math.sin(obj.pulse) * 1.5;
    ctx.save();
    ctx.translate(obj.x, obj.y + bob);
    ctx.rotate(obj.rot);
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, obj.radius * 2.5);
    glow.addColorStop(0, 'rgba(255,77,94,0.42)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, obj.radius * 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a2037';
    ctx.strokeStyle = '#ff4d5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, obj.radius * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff4d5e';
    for (let i = 0; i < 8; i++) {
      const a = i * (Math.PI * 2 / 8) + obj.rot * 0.4;
      const inner = obj.radius * 0.98;
      const outer = obj.radius * 1.32;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a + 0.06) * outer, Math.sin(a + 0.06) * outer);
      ctx.lineTo(Math.cos(a + 0.13) * inner, Math.sin(a + 0.13) * inner);
      ctx.closePath();
      ctx.fill();
    }

    const fusePulse = 0.5 + 0.5 * Math.sin(obj.pulse * 6);
    ctx.strokeStyle = `rgba(255,213,74,${0.55 + fusePulse * 0.35})`;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(0, -obj.radius * 0.8);
    ctx.quadraticCurveTo(6, -obj.radius * 1.22, 3, -obj.radius * 1.6);
    ctx.stroke();
    ctx.fillStyle = '#ffd54a';
    ctx.beginPath();
    ctx.arc(3, -obj.radius * 1.62, 3.4, 0, Math.PI * 2);
    ctx.fill();

    if (fusePulse > 0.65) {
      ctx.strokeStyle = 'rgba(255,77,94,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, obj.radius * 1.45, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const p of state.particles) {
      const a = p.alpha ?? 1;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.color;
      if (p.mode === 'spark') {
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.fillRect(-p.size, -p.size * 0.28, p.size * 2.2, p.size * 0.56);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawPlayer() {
    const p = state.player;
    const x = p.x;
    const y = p.y + Math.sin(performance.now() * 0.004) * 1.3;
    const winGlow = state.screen === 'result' && state.gameOverReason === 'win' ? 0.24 : 0;
    const hurt = p.hurt > 0 ? 1 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.tilt + (state.shake > 0 ? Math.sin(performance.now() * 0.03) * state.shake * 0.04 : 0));
    ctx.scale(1 + p.winPulse * 0.03, 1 - p.winPulse * 0.03);

    // Tail
    ctx.strokeStyle = 'rgba(255,155,61,0.95)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-18, 16);
    ctx.quadraticCurveTo(-44, 24, -38, 48);
    ctx.stroke();

    // Body
    const bodyGrad = ctx.createLinearGradient(-20, -26, 20, 34);
    bodyGrad.addColorStop(0, hurt ? '#ffbf82' : '#ffb35a');
    bodyGrad.addColorStop(1, '#ff8e2f');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = 'rgba(255,232,199,0.7)';
    ctx.lineWidth = 2;
    roundBody(0, 14, 24, 18);

    // Suit lines
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, 16); ctx.lineTo(16, 16);
    ctx.moveTo(-6, 2); ctx.lineTo(-6, 24);
    ctx.stroke();

    // Helmet glow
    const halo = ctx.createRadialGradient(0, -12, 4, 0, -12, 38);
    halo.addColorStop(0, `rgba(127,231,255,${0.26 + winGlow})`);
    halo.addColorStop(1, 'rgba(127,231,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, -10, 35, 0, Math.PI * 2);
    ctx.fill();

    // Head/helmet
    ctx.fillStyle = 'rgba(255,232,199,0.98)';
    ctx.strokeStyle = 'rgba(127,231,255,0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -10, 23, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ears
    ctx.fillStyle = '#ffe8c7';
    ctx.beginPath();
    ctx.moveTo(-14, -25); ctx.lineTo(-22, -42); ctx.lineTo(-6, -34); ctx.closePath();
    ctx.moveTo(14, -25); ctx.lineTo(22, -42); ctx.lineTo(6, -34); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffb4c3';
    ctx.beginPath();
    ctx.moveTo(-13, -28); ctx.lineTo(-17, -37); ctx.lineTo(-7, -32); ctx.closePath();
    ctx.moveTo(13, -28); ctx.lineTo(17, -37); ctx.lineTo(7, -32); ctx.closePath();
    ctx.fill();

    // Face visor
    const visor = ctx.createLinearGradient(-16, -22, 16, -1);
    visor.addColorStop(0, 'rgba(10,17,40,0.95)');
    visor.addColorStop(1, 'rgba(18,33,68,0.9)');
    ctx.fillStyle = visor;
    ctx.beginPath();
    ctx.ellipse(0, -10, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (p.blink > 0.08) {
      ctx.strokeStyle = '#f5f7ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-7, -11); ctx.lineTo(-3, -11);
      ctx.moveTo(3, -11); ctx.lineTo(7, -11);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#f5f7ff';
      ctx.beginPath();
      ctx.arc(-6, -12, 3.1, 0, Math.PI * 2);
      ctx.arc(6, -12, 3.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7fe7ff';
      ctx.beginPath();
      ctx.arc(-5.2, -12.8, 1.1, 0, Math.PI * 2);
      ctx.arc(6.8, -12.8, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Whisker dots / nose
    ctx.fillStyle = '#ff4d5e';
    ctx.beginPath();
    ctx.arc(0, -8.3, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#ff9b3d';
    ctx.beginPath();
    ctx.roundRect(-18, 24, 9, 12, 4);
    ctx.roundRect(9, 24, 9, 12, 4);
    ctx.fill();

    if (hurt) {
      ctx.globalAlpha = 0.52;
      ctx.fillStyle = '#ff4d5e';
      ctx.beginPath();
      ctx.arc(0, -8, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    if (winGlow) {
      ctx.globalAlpha = winGlow;
      ctx.strokeStyle = '#a56cff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function roundBody(x, y, w, h) {
    ctx.beginPath();
    ctx.roundRect(x - w, y - h, w * 2, h * 2, 10);
    ctx.fill();
    ctx.stroke();
  }

  function drawScene(t) {
    ctx.save();
    if (state.shake > 0) {
      ctx.translate(rand(-8, 8) * state.shake, rand(-6, 6) * state.shake);
    }
    drawBackground(t);
    for (const obj of state.objects) {
      if (obj.type === 'food') drawFood(obj); else drawBomb(obj);
    }
    drawParticles();
    drawPlayer();
    ctx.restore();
  }

  function loop(now) {
    const rawDt = Math.min(0.033, (now - state.lastTime) / 1000 || 0);
    state.lastTime = now;
    if (state.running && state.screen === 'game' && !state.paused) updateGameplay(rawDt);
    drawScene(now * 0.001);
    requestAnimationFrame(loop);
  }

  function applySavedSettings() {
    state.language = load('language', state.language);
    state.soundOn = load('soundOn', state.soundOn ? '1' : '0') !== '0';
    syncLanguage();
  }

  function setLanguage(lang) {
    state.language = lang;
    syncLanguage();
    save('language', lang);
    playTone('ui');
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    save('soundOn', state.soundOn ? '1' : '0');
    if (state.soundOn) initAudio();
    syncLanguage();
    playTone('ui');
  }

  function handlePointerDown(e) {
    if (e.target.closest('button')) return;
    if (state.screen === 'menu') return;
    const rect = canvas.getBoundingClientRect();
    state.pointer.active = true;
    state.pointer.down = true;
    state.pointer.mode = e.pointerType || 'mouse';
    state.pointer.x = clamp((e.clientX - rect.left), 32, rect.width - 32);
    state.pointer.y = clamp((e.clientY - rect.top), rect.height * 0.58, rect.height - 24);
    if (state.screen === 'pause') return;
    if (state.screen === 'settings') return;
    if (state.screen === 'result') return;
    if (state.screen !== 'game') startGame();
    shell.setPointerCapture?.(e.pointerId);
    updateStatus(tr('playHint'));
    initAudio();
  }

  function handlePointerMove(e) {
    const isMouse = e.pointerType === 'mouse';
    if (!state.pointer.active && !isMouse) return;
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = clamp((e.clientX - rect.left), 32, rect.width - 32);
    state.pointer.y = clamp((e.clientY - rect.top), rect.height * 0.58, rect.height - 24);
    if (state.screen === 'game' && isMouse) {
      state.player.tx = state.pointer.x;
      state.player.ty = state.pointer.y;
    }
  }

  function handlePointerUp() {
    state.pointer.active = false;
    state.pointer.down = false;
  }

  function handleKeyDown(e) {
    const mapped = keyMap[e.code];
    if (!mapped) return;
    e.preventDefault();
    if (mapped === 'pause') {
      if (state.screen === 'game') pauseGame();
      else if (state.screen === 'pause') resumeGame();
      return;
    }
    if (mapped === 'restart') {
      if (state.screen === 'game' || state.screen === 'pause' || state.screen === 'result') startGame();
      return;
    }
    state.keys.add(mapped);
    if (state.screen !== 'game') startGame();
  }

  function handleKeyUp(e) {
    const mapped = keyMap[e.code];
    if (!mapped || mapped === 'pause' || mapped === 'restart') return;
    state.keys.delete(mapped);
  }

  function updateFocusPause() {
    if (document.hidden && state.screen === 'game') {
      state.focusPause = true;
      pauseGame();
    }
  }

  ui.startBtn.addEventListener('click', () => startGame());
  ui.menuSettingsBtn.addEventListener('click', openSettings);
  ui.settingsBtn.addEventListener('click', openSettings);
  ui.saveSettingsBtn.addEventListener('click', saveSettings);
  ui.closeSettingsBtn.addEventListener('click', () => {
    playTone('ui');
    if (state.running) { state.screen = 'game'; setOverlay('none'); }
    else { state.screen = 'menu'; setOverlay('menu'); }
  });
  ui.resumeBtn.addEventListener('click', resumeGame);
  ui.pauseBtn.addEventListener('click', () => {
    if (state.screen === 'game') pauseGame(); else if (state.screen === 'pause') resumeGame(); else if (state.screen === 'menu') startGame();
  });
  ui.restartBtn.addEventListener('click', () => startGame());
  ui.pauseRestartBtn.addEventListener('click', () => startGame());
  ui.pauseMenuBtn.addEventListener('click', () => goMenu());
  ui.playAgainBtn.addEventListener('click', () => startGame());
  ui.resultMenuBtn.addEventListener('click', () => goMenu());
  ui.langRuBtn.addEventListener('click', () => setLanguage('ru'));
  ui.langEnBtn.addEventListener('click', () => setLanguage('en'));
  ui.soundToggle.addEventListener('click', () => toggleSound());

  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove, { passive: false });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });
  window.addEventListener('pointercancel', handlePointerUp, { passive: true });
  window.addEventListener('keydown', handleKeyDown, { passive: false });
  window.addEventListener('keyup', handleKeyUp, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', updateFocusPause);
  window.addEventListener('blur', () => {
    if (state.screen === 'game') pauseGame();
  });

  applySavedSettings();
  resize();
  syncLanguage();
  syncHUD();
  goMenu();
  updateStatus(tr('ready'));
  drawScene(0);

  // Public-ish hooks for overlays and results.
  function statLoop() {
    syncHUD();
    requestAnimationFrame(statLoop);
  }
  requestAnimationFrame(statLoop);

  // Auto-init render loop for menu background.
  state.lastTime = performance.now();
  requestAnimationFrame(loop);

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.addEventListener) mq.addEventListener('change', (e) => state.reducedMotion = e.matches);
    else if (mq.addListener) mq.addListener((e) => state.reducedMotion = e.matches);
  }
})();
