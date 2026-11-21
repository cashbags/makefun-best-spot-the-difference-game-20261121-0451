// The five pictures. Each scene paints one 600x520 picture in local coords;
// the left picture is painted with right=false, the right one with right=true,
// so every difference is a branch on `right`. Both sides share one seed, so
// the seeded decoration (stars, sparks) lands in exactly the same places.
// diffs are [x, y] centres in picture coords; the hit radius lives in config.
export const PW = 600;
export const PH = 520;

function C(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
function Q(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
function T(g, x1, y1, x2, y2, x3, y3, c) {
  g.fillStyle = c; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3);
  g.closePath(); g.fill();
}
function S(g, x1, y1, x2, y2, c, w) {
  g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
}
function stars(g, R, n, ymax) { for (let i = 0; i < n; i += 1) C(g, R() * 600, R() * ymax, 1.4, '#ffe9a8'); }
function burst(g, x, y, c, R) {
  for (let i = 0; i < 9; i += 1) {
    const a = R() * 6.2832, d = 12 + R() * 26;
    C(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 2.6, c);
  }
  C(g, x, y, 3.5, '#ffffff');
}
function boat(g, x, y, hull, sail) {
  Q(g, x, y, 92, 20, hull);
  T(g, x + 46, y - 52, x + 46, y, x + 82, y, sail);
  S(g, x + 46, y - 52, x + 46, y, '#2c2118', 3);
}

function drawLanternMarket(g, R, right) {
  Q(g, 0, 0, 600, 330, '#20264d'); Q(g, 0, 330, 600, 190, '#3b2d2a');
  C(g, 88, 66, 26, '#f6e7b2'); stars(g, R, 22, 180);
  S(g, 0, 96, 600, 96, '#0f1226', 3);
  const cols = ['#ff5a4e', '#ffb347', '#58c98a'];
  for (let i = 0; i < 7; i += 1) C(g, 40 + i * 80, 112, 15, i === 3 ? (right ? '#58c98a' : '#ff5a4e') : cols[i % 3]);
  if (right) C(g, 520, 150, 13, '#ff5a4e');
  if (right) C(g, 300, 50, 3, '#ffffff');
  Q(g, 50, 300, 190, 120, '#5a3a28'); Q(g, 360, 300, 190, 120, '#5a3a28');
  Q(g, 40, 278, 210, 24, '#c94f42'); Q(g, 350, 278, 210, 24, '#c94f42');
  Q(g, 90, 278, 26, 24, right ? '#7fd4a8' : '#f2c94c');
  const jars = ['#e2703a', '#7fb069', '#4a7fa5', '#d9a441'];
  for (let i = 0; i < 4; i += 1) C(g, 90 + i * 40, 340, 12, jars[i]);
  for (let i = 0; i < 3; i += 1) C(g, 400 + i * 40, 340, 12, jars[(i + 2) % 4]);
  if (right) { C(g, 428, 268, 9, '#14141c'); C(g, 444, 272, 7, '#14141c'); }
}

function drawRiverFestival(g, R, right) {
  Q(g, 0, 0, 600, 300, '#1d2b4d'); Q(g, 0, 300, 600, 220, '#1d4e6b');
  C(g, 500, 70, 24, right ? '#ffd76a' : '#f6e7b2'); stars(g, R, 18, 160);
  if (right) C(g, 80, 40, 2.6, '#ffffff');
  burst(g, 150, 120, '#ff8fb0', R); burst(g, 450, 100, '#8fd0ff', R);
  if (right) burst(g, 300, 80, '#ffe066', R);
  Q(g, 180, 250, 240, 16, '#6b4a2f'); Q(g, 200, 266, 14, 60, '#6b4a2f'); Q(g, 386, 266, 14, 60, '#6b4a2f');
  C(g, 300, 242, 6, right ? '#ffd76a' : '#ff5a4e');
  boat(g, 120, 360, '#c94f42', right ? '#7fd4a8' : '#f2c94c');
  boat(g, 360, 400, '#4a7fa5', '#f2c94c');
  if (right) { S(g, 520, 332, 540, 312, '#cfe8ff', 3); C(g, 545, 308, 5, '#cfe8ff'); }
  for (let i = 0; i < 5; i += 1) S(g, 40 + i * 110, 470, 90 + i * 110, 470, '#2a6a8a', 2);
}

function drawTeaGarden(g, R, right) {
  Q(g, 0, 0, 600, 340, '#1e3a2f'); Q(g, 0, 340, 600, 180, '#16324a');
  C(g, 90, 80, 30, '#f6e7b2'); stars(g, R, 16, 150);
  if (right) C(g, 300, 60, 3, '#ffffff');
  Q(g, 60, 120, 16, 200, '#4a3524');
  for (let i = 0; i < 6; i += 1) S(g, 68 + i * 8, 140, 60 + i * 14, 300, '#5d8a4a', 2);
  if (right) C(g, 120, 200, 8, '#ff5a4e');
  Q(g, 360, 180, 180, 140, '#7a4a2f'); T(g, 340, 180, 450, 118, 560, 180, '#a83c32');
  if (right) C(g, 450, 112, 6, '#ffd76a');
  Q(g, 400, 230, 40, 50, right ? '#ffd76a' : '#2c2118'); Q(g, 470, 230, 40, 50, '#2c2118');
  g.strokeStyle = '#8a6a45'; g.lineWidth = 10;
  g.beginPath(); g.arc(300, 430, 90, Math.PI, 0); g.stroke();
  C(g, 200, 440, 8, right ? '#58c98a' : '#ff8f5a'); C(g, 250, 460, 7, '#ffb347');
  if (right) C(g, 330, 455, 7, '#ff8f5a');
  C(g, 520, 480, 12, '#6a6a72'); if (right) C(g, 545, 490, 9, '#55555e');
  if (right) C(g, 550, 360, 6, '#ff8fb0');
  S(g, 60, 380, 110, 380, '#5d8a4a', 3);
}

function drawNightBazaar(g, R, right) {
  Q(g, 0, 0, 600, 300, '#241d33'); Q(g, 0, 300, 600, 220, '#33241f');
  C(g, 520, 64, 22, '#f6e7b2'); stars(g, R, 20, 170);
  S(g, 0, 70, 600, 70, '#0f1226', 3);
  for (let i = 0; i < 8; i += 1) C(g, 35 + i * 75, 82, 9, i === 5 ? (right ? '#58c98a' : '#ffd76a') : (i % 2 ? '#ffd76a' : '#ff8fb0'));
  if (right) C(g, 300, 44, 3, '#ffffff');
  const awn = ['#c94f42', '#4a7fa5', '#7fb069'];
  for (let s = 0; s < 3; s += 1) {
    const x = 30 + s * 195;
    Q(g, x, 300, 165, 120, '#5a3a28');
    Q(g, x - 8, 278, 181, 24, s === 1 && right ? '#d9a441' : awn[s]);
    for (let i = 0; i < 3; i += 1) C(g, x + 30 + i * 50, 345, 11, ['#e2703a', '#7fb069', '#d9a441'][(s + i) % 3]);
  }
  if (right) { Q(g, 470, 380, 60, 14, '#c94f42'); Q(g, 470, 398, 60, 14, '#4a7fa5'); }
  C(g, 120, 450, 14, right ? '#7fb069' : '#8a6a45'); C(g, 300, 460, 12, '#6a6a72');
  if (right) C(g, 300, 448, 5, '#58c98a');
  if (right) C(g, 560, 200, 10, '#ff5a4e');
  if (right) S(g, 40, 180, 90, 180, '#f2c94c', 3);
}

function drawHarborLights(g, R, right) {
  Q(g, 0, 0, 600, 280, '#16233d'); Q(g, 0, 280, 600, 240, '#14324a');
  C(g, 90, 70, 24, '#f6e7b2'); stars(g, R, 18, 160);
  if (right) C(g, 300, 52, 3, '#ffffff');
  Q(g, 480, 120, 34, 220, '#e8e0cc'); Q(g, 474, 100, 46, 22, right ? '#ffd76a' : '#c94f42');
  T(g, 470, 100, 497, 76, 524, 100, '#c94f42');
  g.fillStyle = right ? 'rgba(255, 215, 106, 0.35)' : 'rgba(255, 215, 106, 0.18)';
  g.beginPath(); g.moveTo(480, 110); g.lineTo(240, 60); g.lineTo(240, 170); g.closePath(); g.fill();
  boat(g, 80, 380, right ? '#7fb069' : '#c94f42', '#f2c94c');
  boat(g, 300, 420, '#4a7fa5', right ? '#58c98a' : '#f2c94c');
  if (right) C(g, 420, 350, 6, '#cfe8ff');
  Q(g, 150, 460, 40, 30, right ? '#7fb069' : '#8a6a45'); Q(g, 195, 470, 34, 20, '#6b4a2f');
  if (right) Q(g, 232, 472, 26, 18, '#8a6a45');
  S(g, 200, 90, 216, 98, '#e8e0cc', 2); S(g, 216, 98, 232, 90, '#e8e0cc', 2);
  if (right) { S(g, 360, 80, 376, 88, '#e8e0cc', 2); S(g, 376, 88, 392, 80, '#e8e0cc', 2); }
  for (let i = 0; i < 4; i += 1) S(g, 60 + i * 130, 500, 110 + i * 130, 500, '#2a6a8a', 2);
}

export const SCENES = [
  { name: 'Lantern Market', time: 90, n: 5, paint: drawLanternMarket,
    diffs: [[520, 150], [103, 290], [300, 50], [436, 270], [280, 112]] },
  { name: 'River Festival', time: 80, n: 6, paint: drawRiverFestival,
    diffs: [[176, 343], [300, 242], [300, 80], [535, 318], [500, 70], [80, 40]] },
  { name: 'Tea Garden', time: 70, n: 7, paint: drawTeaGarden,
    diffs: [[420, 255], [200, 440], [545, 490], [120, 200], [550, 360], [300, 60], [450, 112]] },
  { name: 'Night Bazaar', time: 60, n: 8, paint: drawNightBazaar,
    diffs: [[307, 290], [300, 44], [500, 389], [300, 448], [560, 200], [120, 450], [65, 180], [410, 82]] },
  { name: 'Harbor Lights', time: 55, n: 9, paint: drawHarborLights,
    diffs: [[360, 115], [358, 403], [420, 350], [245, 481], [376, 84], [300, 52], [170, 475], [497, 111], [126, 390]] },
];
