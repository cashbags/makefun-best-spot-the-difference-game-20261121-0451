// Tuning, layout and palette for Lantern Market. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window.
export const FIELD = { width: 1280, height: 720 };
export const STEP = 1 / 60;
export const PIC = { x: 24, y: 76, w: 600, h: 520 };
export const PIC2 = { x: 656, y: 76, w: 600, h: 520 };
export const LIVES = 3;
export const HIT_R = 26;
export const BEST_KEY = 'lantern-market.best';
export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const PALETTE = {
  backdrop: '#0d1020', panel: '#1c2138', text: '#f2ead8', muted: '#9aa3b8',
  gold: '#f2c94c', green: '#58c98a', red: '#ff5a4e', ring: '#58c98a',
};
