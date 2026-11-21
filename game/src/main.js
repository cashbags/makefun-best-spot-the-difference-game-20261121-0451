// Boot and the one loop: input is read every frame, the timer advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between six screens: title, play, paused, level complete, game over, win.
//
// ?seed=N fixes the pictures. ?shot=start|play|end (with &seed=N) stages that
// scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_FAIL, EVENT_FOUND, EVENT_LEVEL, EVENT_OVER, EVENT_WIN, EVENT_WRONG } from './world.js';
import { ACTION_CONFIRM, ACTION_PAUSE, createInput } from './input.js';
import { createRenderer, SCREEN_LEVEL, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(seed);
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score lasts this visit.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best, null);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.reset();
    accumulator = 0;
    screen = SCREEN_PLAY;
    announce('Playing. Find every difference before the timer runs out.');
  }

  function endGame(won) {
    screen = won ? SCREEN_WIN : SCREEN_OVER;
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
    announce(won ? `You found them all! Score ${world.state.score}.` : `Game over. Score ${world.state.score}. Best ${best}.`);
  }

  function failLevel() {
    world.loadLevel(world.state.level);
    screen = SCREEN_PLAY;
    announce(`A life lost. ${world.state.lives} left. Scene restarts.`);
  }

  function handleEvents(events) {
    if (events & EVENT_FOUND) sfx.find();
    if (events & EVENT_WRONG) sfx.wrong();
    if (events & EVENT_WIN) { sfx.level(); endGame(true); return; }
    if (events & EVENT_LEVEL) { sfx.level(); screen = SCREEN_LEVEL; return; }
    if (events & EVENT_OVER) { sfx.over(); endGame(false); return; }
    if (events & EVENT_FAIL) { sfx.wrong(); failLevel(); }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    const actions = input.takeActions();
    if (screen === SCREEN_TITLE || screen === SCREEN_LEVEL || screen === SCREEN_OVER || screen === SCREEN_WIN) {
      input.takeCheck();
      if (actions & ACTION_CONFIRM) {
        if (screen === SCREEN_LEVEL) {
          world.loadLevel(world.state.level + 1);
          screen = SCREEN_PLAY;
        } else startGame();
      }
    } else if (screen === SCREEN_PAUSED) {
      if (actions & (ACTION_PAUSE | ACTION_CONFIRM)) screen = SCREEN_PLAY;
    } else if (screen === SCREEN_PLAY) {
      if (actions & ACTION_PAUSE) {
        screen = SCREEN_PAUSED;
        announce('Paused.');
      } else {
        const check = input.takeCheck();
        if (check) handleEvents(world.check(check.x, check.y));
        while (accumulator >= STEP && screen === SCREEN_PLAY) {
          handleEvents(world.tick(STEP));
          accumulator -= STEP;
        }
      }
    }
    if (screen !== SCREEN_PLAY) accumulator = 0;
    renderer.draw(world.state, screen, best, input.cursor);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Lantern Market. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
