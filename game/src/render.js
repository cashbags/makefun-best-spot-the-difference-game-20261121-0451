// Drawing only: the two pictures, the found-difference rings, the HUD and
// the panels. The 1280x720 playfield scales to fit the window, centred.
import { FIELD, FONT, LIVES, PALETTE, PIC, PIC2 } from './config.js';
import { createRandom } from './random.js';
import { PH, PW, SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

const PANEL = { width: 640, top: 150, line: 34, bottom: 76 };

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const fonts = new Map();

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    view.scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    view.x = (canvas.width - FIELD.width * view.scale) / 2;
    view.y = (canvas.height - FIELD.height * view.scale) / 2;
  }

  function text(value, x, y, size, color, align) {
    if (!fonts.has(size)) fonts.set(size, `${size}px ${FONT}`);
    context.font = fonts.get(size);
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(value, x, y);
  }

  function ring(x, y, r, color, width) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.arc(x, y, r, 0, 6.2832);
    context.stroke();
  }

  function drawPicture(state, pic, right) {
    const sc = SCENES[state.level];
    const rng = createRandom(state.seed + state.level * 7919);
    context.save();
    context.beginPath();
    context.rect(pic.x, pic.y, pic.w, pic.h);
    context.clip();
    context.translate(pic.x, pic.y);
    context.scale(pic.w / PW, pic.h / PH);
    sc.paint(context, rng, right);
    context.restore();
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.strokeRect(pic.x, pic.y, pic.w, pic.h);
    for (let i = 0; i < state.diffs.length; i += 1) {
      if (!state.found[i]) continue;
      const dx = pic.x + (state.diffs[i][0] / PW) * pic.w;
      const dy = pic.y + (state.diffs[i][1] / PH) * pic.h;
      ring(dx, dy, 24, PALETTE.ring, 4);
      ring(dx, dy, 15, PALETTE.ring, 2);
    }
  }

  function drawHud(state) {
    const sc = SCENES[state.level];
    const found = state.found.filter(Boolean).length;
    const left = state.diffs.length - found;
    context.textBaseline = 'top';
    text(`Level ${state.level + 1} · ${sc.name}`, 24, 18, 26, PALETTE.text, 'left');
    text(`Found ${found}/${state.diffs.length} · ${left} left`, 640, 18, 26, PALETTE.gold, 'center');
    text(`Score ${state.score}`, 1256, 18, 26, PALETTE.text, 'right');
    const frac = Math.max(0, state.timeLeft / sc.time);
    context.fillStyle = '#333a52';
    context.fillRect(24, 52, 1232, 10);
    context.fillStyle = frac > 0.25 ? PALETTE.green : PALETTE.red;
    context.fillRect(24, 52, 1232 * frac, 10);
    text(`Lives ${'♥'.repeat(state.lives)}${'♡'.repeat(LIVES - state.lives)}`, 24, 612, 22, PALETTE.text, 'left');
    text(state.streak > 1 ? `Streak x${state.streak}` : 'Click a difference — or move with ← → ↑ ↓ and press Enter', 640, 612, 22, PALETTE.muted, 'center');
    text(`Best ${state.best}`, 1256, 612, 22, PALETTE.text, 'right');
  }

  function drawPanel(title, lines, prompt) {
    const height = PANEL.top + lines.length * PANEL.line + PANEL.bottom;
    const x = (FIELD.width - PANEL.width) / 2;
    const y = (FIELD.height - height) / 2;
    context.fillStyle = PALETTE.panel;
    context.fillRect(x, y, PANEL.width, height);
    context.textBaseline = 'alphabetic';
    text(title, FIELD.width / 2, y + 78, 46, PALETTE.text, 'center');
    for (let index = 0; index < lines.length; index += 1) {
      text(lines[index], FIELD.width / 2, y + PANEL.top + index * PANEL.line, 22, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 40, 24, PALETTE.gold, 'center');
  }

  function drawCursor(cursor) {
    if (!cursor) return;
    ring(cursor.x, cursor.y, 14, PALETTE.gold, 3);
    context.strokeStyle = PALETTE.gold;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(cursor.x - 22, cursor.y); context.lineTo(cursor.x - 8, cursor.y);
    context.moveTo(cursor.x + 8, cursor.y); context.lineTo(cursor.x + 22, cursor.y);
    context.moveTo(cursor.x, cursor.y - 22); context.lineTo(cursor.x, cursor.y - 8);
    context.moveTo(cursor.x, cursor.y + 8); context.lineTo(cursor.x, cursor.y + 22);
    context.stroke();
  }

  function draw(state, screen, best, cursor) {
    state.best = best;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawPicture(state, PIC, false);
    drawPicture(state, PIC2, true);
    if (screen === SCREEN_TITLE) {
      drawPanel('Lantern Market', [
        'Spot the difference — two pictures, side by side.',
        'Find every difference before the timer runs out.',
        '3 wrong clicks in a level cost a life. 5 lantern-lit scenes.',
        `Best ${best}`,
      ], 'Press Space or click to start');
      return;
    }
    drawHud(state);
    if (screen === SCREEN_PLAY) drawCursor(cursor);
    else if (screen === SCREEN_PAUSED) drawPanel('Paused', ['The lanterns will wait for you.'], 'Press P to resume');
    else if (screen === SCREEN_LEVEL) {
      drawPanel('Scene complete!', [`Score ${state.score}`, `Next: ${SCENES[state.level + 1].name}`], 'Press Space for the next scene');
    } else if (screen === SCREEN_WIN) {
      drawPanel('You found them all!', [`Final score ${state.score}`, `Best ${best}`, 'All five scenes cleared.'], 'Press Space to play again');
    } else if (screen === SCREEN_OVER) {
      drawPanel('Game over', [`Score ${state.score}`, `Best ${best}`], 'Press Space to play again');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, view };
}
