// Keyboard cursor + mouse clicks. Arrow keys move the cursor (Shift = fast);
// Enter or Space checks the cursor spot; a mouse click checks where it lands.
// P or Escape pauses. One-shot presses are queued as flags and taken once.
import { FIELD, PIC, PIC2 } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;

const PAUSE = new Set(['KeyP', 'Escape']);
const CONFIRM = new Set(['Space', 'Enter']);

export function createInput(canvas) {
  const cursor = { x: PIC2.x + PIC2.w / 2, y: PIC.y + PIC.h / 2 };
  let actions = 0;
  let check = null;

  function toField(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / FIELD.width, rect.height / FIELD.height);
    return {
      x: (clientX - rect.left - (rect.width - FIELD.width * scale) / 2) / scale,
      y: (clientY - rect.top - (rect.height - FIELD.height * scale) / 2) / scale,
    };
  }

  // Field point -> picture-local coords, or null when outside both pictures.
  function toLocal(p) {
    for (const pic of [PIC, PIC2]) {
      if (p.x >= pic.x && p.x <= pic.x + pic.w && p.y >= pic.y && p.y <= pic.y + pic.h) {
        return { x: ((p.x - pic.x) / pic.w) * 600, y: ((p.y - pic.y) / pic.h) * 520 };
      }
    }
    return null;
  }

  window.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 40 : 10;
    if (event.code === 'ArrowLeft') cursor.x = Math.max(0, cursor.x - step);
    else if (event.code === 'ArrowRight') cursor.x = Math.min(FIELD.width, cursor.x + step);
    else if (event.code === 'ArrowUp') cursor.y = Math.max(0, cursor.y - step);
    else if (event.code === 'ArrowDown') cursor.y = Math.min(FIELD.height, cursor.y + step);
    else if (CONFIRM.has(event.code)) {
      if (!event.repeat) {
        const local = toLocal(cursor);
        if (local) check = local;
        else actions |= ACTION_CONFIRM;
      }
    } else if (PAUSE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_PAUSE;
    } else return;
    event.preventDefault();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const field = toField(event.clientX, event.clientY);
    const local = toLocal(field);
    cursor.x = field.x;
    cursor.y = field.y;
    if (local) check = local;
    else actions |= ACTION_CONFIRM;
  });

  return {
    cursor,
    takeActions() { const taken = actions; actions = 0; return taken; },
    takeCheck() { const taken = check; check = null; return taken; },
  };
}
