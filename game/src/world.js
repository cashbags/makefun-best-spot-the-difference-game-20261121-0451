// Rules and state, no drawing and no browser in it: levels, the differences
// of the current level, clicks, score, streak, mistakes, lives and timer.
// step() is not used; tick() advances the clock and check() answers a click.
import { HIT_R, LIVES } from './config.js';
import { SCENES } from './scenes.js';

export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_FAIL = 4;
export const EVENT_LEVEL = 8;
export const EVENT_WIN = 16;
export const EVENT_OVER = 32;

export function createWorld(seed) {
  const state = { level: 0, score: 0, lives: LIVES, mistakes: 0, streak: 0, timeLeft: 0, found: [], diffs: [], seed };

  function loadLevel(n) {
    const sc = SCENES[n];
    state.level = n;
    state.diffs = sc.diffs.slice(0, sc.n);
    state.found = state.diffs.map(() => false);
    state.mistakes = 0;
    state.streak = 0;
    state.timeLeft = sc.time;
  }

  function reset() {
    state.score = 0;
    state.lives = LIVES;
    loadLevel(0);
  }

  // px, py are picture-local coords (either picture: the two are the same size).
  function check(px, py) {
    const d = state.diffs;
    for (let i = 0; i < d.length; i += 1) {
      if (state.found[i]) continue;
      const dx = px - d[i][0], dy = py - d[i][1];
      if (dx * dx + dy * dy >= HIT_R * HIT_R) continue;
      state.found[i] = true;
      state.streak += 1;
      state.score += 100 + 10 * (state.streak - 1);
      if (!state.found.every(Boolean)) return EVENT_FOUND;
      state.score += Math.round(state.timeLeft) * 5;
      return state.level === SCENES.length - 1 ? EVENT_FOUND | EVENT_WIN : EVENT_FOUND | EVENT_LEVEL;
    }
    state.mistakes += 1;
    state.streak = 0;
    if (state.mistakes < 3) return EVENT_WRONG;
    state.lives -= 1;
    return state.lives <= 0 ? EVENT_WRONG | EVENT_OVER : EVENT_WRONG | EVENT_FAIL;
  }

  function tick(dt) {
    state.timeLeft -= dt;
    if (state.timeLeft > 0) return 0;
    state.lives -= 1;
    return state.lives <= 0 ? EVENT_OVER : EVENT_FAIL;
  }

  reset();
  return { state, reset, loadLevel, check, tick };
}
