/* ===== PaduPadan — app.js =====
 * Single-page front-end (hash routing). Semua data disimpan di localStorage.
 * Foto pakaian/outfit digambar sebagai ilustrasi SVG. Untuk memakai foto asli dari Figma,
 * isi properti `img` (URL/path gambar) pada data CLOSET_SEED / OUTFITS di bawah.
 */
'use strict';

/* ---------- util ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem('pp_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('pp_' + k, JSON.stringify(v)); } catch (e) {} }
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const go = p => { location.hash = p; };

/* ---------- icons ---------- */
const P = {
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  wand: '<path d="M5 19L17 7"/><path d="M15 5l4 4"/><path d="M19 3v3M17.5 4.5h3M7 3v2M6 4h2M21 12v2M20 13h2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  folder: '<path d="M3 7h6l2 2h10v11H3z"/><path d="M9.5 15l2.5-1.8 2.5 1.8v3h-5z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  bookmark: '<path d="M7 4h10v16l-5-4-5 4z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  pencil: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
  trash: '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1A3.5 3.5 0 0 1 17 18z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  moon: '<path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z"/>',
  backpack: '<rect x="6" y="7" width="12" height="14" rx="4"/><path d="M9 7V5a3 3 0 0 1 6 0v2M9 14h6"/>',
  shirt: '<path d="M8 4l-5 4 2 4 3-1v9h8v-9l3 1 2-4-5-4a4 4 0 0 1-8 0z"/>',
  briefcase: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6h6v2M3 13h18"/>',
  dots: '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
  hanger: '<path d="M12 9V8a2.5 2.5 0 1 0-2.5-2.5"/><path d="M12 9l9 7a1 1 0 0 1-.6 1.8H3.6A1 1 0 0 1 3 16z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><circle cx="12" cy="17" r=".6"/>',
  logout: '<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
  house: '<path d="M4 11l8-7 8 7v9H4z"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  leaf: '<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19L14 10"/>',
  bow: '<path d="M12 12L4 7v10zM12 12l8-5v10z"/><circle cx="12" cy="12" r="1.8"/>',
  hijab: '<path d="M12 3c4 0 6 3 6 6s-2 6-3 8l-3 3-3-3c-1-2-3-5-3-8s2-6 6-6z"/><ellipse cx="12" cy="10" rx="3" ry="3.6"/>',
  blazer: '<path d="M8 3l-4 4v14h6l2-9 2 9h6V7l-4-4-4 5z"/>',
  cap: '<path d="M4 15a8 8 0 0 1 16 0z"/><path d="M12 7c5 0 8 3 8 8"/><path d="M4 15c-1 2 3 3 8 2"/>',
  pants: '<path d="M7 3h10l2 18h-5l-2-10-2 10H5z"/>',
  dress: '<path d="M9 3l3 4 3-4 1 6 4 12H4L8 9z"/>',
  coat: '<path d="M8 3l-4 4v14h16V7l-4-4-4 5z"/><path d="M12 8v13"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
};
const I = (n, c = '', s = 24) => `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;
const GOOGLE = '<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.9z"/></svg>';
const APPLE = '<svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
const LOGO = '<svg viewBox="0 0 120 64" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-label="PaduPadan"><path d="M62 24v-3c4-.5 7-2.6 7-6.5a6.5 6.5 0 1 0-13 0"/><path d="M62 24L9 46c-5 2.3-3.6 9 1.8 9h98.4c5.4 0 6.8-6.700 1.800-9z"/><text x="60" y="49" text-anchor="middle" font-family="Pacifico,cursive" font-size="17" fill="#fff" stroke="none">PaduPadan</text></svg>';

/* ---------- garment illustrations ---------- */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, v + amt));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join('');
}
function garmentInner(t, c) {
  const d = shade(c, -28);
  switch (t) {
    case 'tee': return `<path d="M34 14L14 26l8 18 11-5v47h34V39l11 5 8-18-20-12Q50 26 34 14z" fill="${c}"/><path d="M34 14Q50 26 66 14" fill="none" stroke="${d}" stroke-width="2"/>`;
    case 'blouse': return `<path d="M34 12L10 30l4 38 12-2 4-24v46h40V42l4 24 12 2 4-38-24-18Q50 24 34 12z" fill="${c}"/><path d="M50 24v64" stroke="${d}" stroke-width="1.5"/><circle cx="50" cy="38" r="1.4" fill="${d}"/><circle cx="50" cy="52" r="1.4" fill="${d}"/><circle cx="50" cy="66" r="1.4" fill="${d}"/><path d="M14 66q6 4 12 0" stroke="${d}" fill="none"/><path d="M74 66q6 4 12 0" stroke="${d}" fill="none"/>`;
    case 'sweater': return `<path d="M34 12L8 32l6 34 14-2 2-20v44h40V44l2 20 14 2 6-34-26-20Q50 24 34 12z" fill="${c}"/><rect x="30" y="80" width="40" height="8" fill="${d}"/><path d="M38 12q12 12 24 0" fill="none" stroke="${d}" stroke-width="3"/>`;
    case 'jacket': return `<path d="M32 12L8 30l5 40 13-2 3-26v46h42V42l3 26 13 2 5-40-24-18Q50 24 32 12z" fill="${c}"/><path d="M50 24v64" stroke="${shade(c, -45)}" stroke-width="2"/><path d="M32 12l10 14 8-2 8 2 10-14" fill="none" stroke="${d}" stroke-width="2"/>`;
    case 'jeans': return `<path d="M30 6h40l16 88H55L50 38l-5 56H14z" fill="${c}"/><path d="M30 6h40v9H30z" fill="${shade(c, -18)}"/><path d="M50 15v23" stroke="${d}" stroke-width="1.4"/>`;
    case 'pants': return `<path d="M32 6h36l8 88H54L50 36l-4 58H24z" fill="${c}"/><path d="M32 6h36v8H32z" fill="${shade(c, -18)}"/>`;
    case 'skirt': return `<path d="M36 8h28l24 84H12z" fill="${c}"/><path d="M36 8h28v8H36z" fill="${d}"/><path d="M40 20l-12 70M50 20v70M60 20l12 70" stroke="${d}" stroke-width="1" opacity=".5"/>`;
    case 'dress': return `<path d="M38 6h6l6 12 6-12h6l2 28 22 60H14l22-60z" fill="${c}"/><path d="M36 34h28" stroke="${d}" stroke-width="2"/>`;
    case 'shoes': return `<path d="M8 56Q30 54 40 42l12 4q8 16 38 18 6 14-4 18H12Q4 78 8 56z" fill="${c}"/><path d="M8 74h84" stroke="${d}" stroke-width="3"/>`;
    case 'scarf': return `<path d="M26 8Q50-2 74 8l-5 76H31z" fill="${c}"/><path d="M34 84v9M42 84v9M50 84v9M58 84v9M66 84v9" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M34 20q16 8 32 0M33 34q17 8 34 0M32 48q18 8 36 0M31 62q19 8 38 0" stroke="${d}" fill="none" stroke-width="2" opacity=".6"/>`;
    case 'bag': return `<path d="M30 42Q30 12 50 12t20 30" fill="none" stroke="${c}" stroke-width="5"/><path d="M20 40h60l4 50H16z" fill="${c}"/>`;
    default: return '';
  }
}
const garment = (t, c, cls = '') => `<svg class="${cls}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">${garmentInner(t, c)}</svg>`;
const flatlay = (list, bg = '#9c9c9c') => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="${bg}"/>${list.map(([t, c, x, y, w, h]) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 100 100">${garmentInner(t, c)}</svg>`).join('')}</svg>`;

function figure(o) {
  const skin = o.skin || '#E8B796', hair = o.hair || '#2B1B17';
  let s = `<svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMid slice"><rect width="100" height="150" fill="${o.bg || '#D8CFC4'}"/>`;
  s += `<ellipse cx="50" cy="146" rx="38" ry="5" fill="#0001"/>`;
  if (o.shorts) s += `<path d="M33 70h34l3 26H53l-3-10-3 10H30z" fill="${o.bottom}"/><rect x="34" y="96" width="9" height="40" fill="${skin}"/><rect x="57" y="96" width="9" height="40" fill="${skin}"/>`;
  else if (o.skirt) s += `<path d="M34 70h32l9 62H25z" fill="${o.bottom}"/>`;
  else s += `<path d="M32 68h36l11 70H55l-5-46-5 46H21z" fill="${o.bottom}"/>`;
  const sh = o.shoe || '#eee';
  s += `<ellipse cx="38" cy="141" rx="10" ry="4.5" fill="${sh}"/><ellipse cx="62" cy="141" rx="10" ry="4.5" fill="${sh}"/>`;
  s += `<path d="M34 38h32l2 36H32z" fill="${o.top}"/><path d="M34 38L24 68l6 3 8-24zM66 38l10 30-6 3-8-24z" fill="${o.outer || o.top}"/>`;
  if (o.outer) s += `<path d="M33 38h12l-3 36H31zM67 38H55l3 36h11z" fill="${o.outer}"/><path d="M45 38l5 8 5-8" fill="${o.top}"/>`;
  s += `<rect x="45" y="29" width="10" height="10" fill="${skin}"/><circle cx="50" cy="22" r="10.5" fill="${skin}"/>`;
  if (o.hijab) s += `<path d="M37 23a13 15 0 0 1 26 0v14c0 5-5 9-13 9s-13-4-13-9z" fill="${o.hijab}"/><ellipse cx="50" cy="24" rx="7" ry="8.5" fill="${skin}"/>`;
  else s += `<path d="M38 22a12 12 0 0 1 24 0c0-5-5-9-12-9s-12 4-12 9z" fill="${hair}"/><path d="M38 22v22h5V24zM62 22v22h-5V24z" fill="${hair}"/>`;
  if (o.cap) s += `<path d="M38 18a12 10 0 0 1 24 0z" fill="${o.cap}"/><path d="M60 18h10" stroke="${o.cap}" stroke-width="3"/>`;
  if (o.bag) s += `<path d="M26 66l-5 26h12l-1-26z" fill="${o.bag}"/>`;
  return s + '</svg>';
}

/* ---------- data ---------- */
const CAT = ['Atasan', 'Bawahan', 'Kerudung', 'Outer', 'Dress'];
const CLOSET_SEED = [
  { id: 1, name: 'Maroon Blouse', cat: 'Atasan', type: 'blouse', color: '#6B2D3A', jenis: 'Kemeja / Blouse', warna: 'Maroon', motif: 'Tekstur Samar', gaya: 'Elegan, Simple, Feminim' },
  { id: 2, name: 'Blue Jeans', cat: 'Bawahan', type: 'jeans', color: '#4C7BA8', jenis: 'Celana Jeans', warna: 'Biru', motif: 'Polos', gaya: 'Casual, Simple' },
  { id: 3, name: 'Denim Pants', cat: 'Bawahan', type: 'pants', color: '#1F2A44', jenis: 'Celana Panjang', warna: 'Navy', motif: 'Polos', gaya: 'Formal, Simple' },
  { id: 4, name: 'Pink Sweater', cat: 'Atasan', type: 'sweater', color: '#F2B8C0', jenis: 'Sweater', warna: 'Pink', motif: 'Polos', gaya: 'Casual, Feminim' },
  { id: 5, name: 'Ocean Blue Viscose', cat: 'Kerudung', type: 'scarf', color: '#A9C1D9', jenis: 'Pashmina', warna: 'Biru Laut', motif: 'Gradasi', gaya: 'Feminim, Elegan' },
  { id: 6, name: 'Maroon Cashmeer Pashmina', cat: 'Kerudung', type: 'scarf', color: '#7A2A33', jenis: 'Pashmina', warna: 'Maroon', motif: 'Paisley', gaya: 'Elegan, Klasik' }
];
const RARE = [
  { n: 'Sweater Rajut', t: 'sweater', c: '#F1E6D0', k: 1 }, { n: 'Jaket Denim', t: 'jacket', c: '#5B86B8', k: 2 },
  { n: 'Pashmina Dubai', t: 'scarf', c: '#D9BD9B', k: 2 }, { n: 'Rok Midi', t: 'skirt', c: '#1d1d1d', k: 3 },
  { n: 'Gamis', t: 'dress', c: '#EAD6BC', k: 4 }
];
const OUT = {
  o1: { id: 'o1', occ: 'Kuliah', name: 'Kuliah Santai', f: { top: '#F3EFE8', bottom: '#C8B8A2', shoe: '#eee', bg: '#CFC6BB', bag: '#2a2a2a' }, pal: ['#B7A592', '#EDE6E6', '#3A2B27', '#222222'], tags: ['Kemeja', 'Celana Kulot', 'Sneakers'], items: [['blouse', '#F3EFE8'], ['jeans', '#C8B8A2'], ['shoes', '#eeeeee']] },
  o2: { id: 'o2', occ: 'Kerja', name: 'Smart Casual', f: { top: '#F1ECE4', outer: '#CDB89A', bottom: '#4B5160', shoe: '#222', bg: '#D9D3CA', bag: '#222' }, pal: ['#C8B596', '#E0D8CC', '#4B5160', '#222222'], tags: ['Blazer', 'Kaos', 'Celana Bahan', 'Loafers'], items: [['jacket', '#CDB89A'], ['tee', '#F1ECE4'], ['pants', '#4B5160'], ['shoes', '#222222']] },
  o3: { id: 'o3', occ: 'Hangout', name: 'Casual | Hangout | Siang', f: { top: '#F4F1EC', outer: '#A9BEDD', bottom: '#5B86B8', shoe: '#f2f2f2', bg: '#C9C0B4', bag: '#1d1d1d' }, pal: ['#92AACB', '#B7BFE4', '#EEE6E6', '#222222'], tags: ['Kemeja', 'Tas', 'Sneakers', 'Kaos', 'Jeans'], items: [['blouse', '#A9BEDD'], ['tee', '#F4F1EC'], ['jeans', '#5B86B8'], ['bag', '#1d1d1d'], ['shoes', '#f2f2f2']] },
  o4: { id: 'o4', occ: 'Santai', name: 'Santai Pastel', f: { top: '#E6A9A6', bottom: '#EADFD3', shoe: '#eee', cap: '#F1E7D6', bg: '#D6C6B8', bag: '#E8E1D5' }, pal: ['#E3B3AC', '#EADFD3', '#EADFD3', '#F4EBDD'], tags: ['Sweater', 'Celana Kulot', 'Topi', 'Sneakers'], items: [['sweater', '#E6A9A6'], ['jeans', '#EADFD3'], ['shoes', '#eeeeee']] },
  o5: { id: 'o5', occ: 'Kuliah', name: 'Hijab Maroon', f: { top: '#6B2D3A', bottom: '#D8D0C4', hijab: '#B77D79', shoe: '#eee', bg: '#CBB9A5' }, pal: ['#6B2D3A', '#D8D0C4', '#B77D79', '#2b2b2b'], tags: ['Blouse', 'Kulot', 'Pashmina'], items: [['blouse', '#6B2D3A'], ['jeans', '#D8D0C4'], ['scarf', '#B77D79']] },
  o6: { id: 'o6', occ: 'Hangout', name: 'Hijab Navy', f: { top: '#F0B7B0', bottom: '#1F2A44', hijab: '#6A2C3C', shoe: '#eee', bg: '#CBB9A5' }, pal: ['#6A2C3C', '#F0B7B0', '#1F2A44', '#EEEEEE'], tags: ['Sweater', 'Celana', 'Pashmina'], items: [['sweater', '#F0B7B0'], ['pants', '#1F2A44'], ['scarf', '#6A2C3C']] },
  o7: { id: 'o7', occ: 'Kuliah', name: 'Biru Muda', f: { top: '#F1F0EE', outer: '#B9C8EA', bottom: '#4F7DB6', shoe: '#f2f2f2', bg: '#B9C4B4' }, pal: ['#B9C8EA', '#F1F0EE', '#4F7DB6', '#222222'], tags: ['Kemeja', 'Jeans'], items: [['blouse', '#B9C8EA'], ['jeans', '#4F7DB6']] },
  o8: { id: 'o8', occ: 'Kerja', name: 'Putih Hitam', f: { top: '#F6F3EF', outer: '#2a2a2a', bottom: '#8B7C6B', shoe: '#eee', bg: '#CDBFB0' }, pal: ['#2a2a2a', '#F6F3EF', '#8B7C6B'], tags: ['Blazer', 'Kaos'], items: [['jacket', '#2a2a2a'], ['tee', '#F6F3EF'], ['pants', '#8B7C6B']] }
};
const MOOD = [OUT.o5.f, { top: '#1d1d1d', bottom: '#6a93c5', shoe: '#fff', bg: '#CBB9A5' }, { top: '#6B4A3A', bottom: '#F1E7D6', shorts: 1, shoe: '#fff', bg: '#D6B8A0' }, { top: '#1d1d1d', outer: '#F4EFE6', bottom: '#4a4034', bg: '#CBB9A5', bag: '#6b4228' }, { top: '#E9DCCB', outer: '#D2B793', bottom: '#2c2c2c', hijab: '#E9DCCB', bg: '#C9B9A6', bag: '#222' }];
const HIST = [
  { id: 1, t: 'Outfit Kuliah', d: '12 Mar 2026', g: 'Kasual', temp: 26, fav: 0, it: [['blouse', '#F3F1EC'], ['pants', '#1d1d1d'], ['shoes', '#f2f2f2']] },
  { id: 2, t: 'Outfit Hangout', d: '10 Mar 2026', g: 'Santai', temp: 28, fav: 1, it: [['tee', '#1B2A4A'], ['skirt', '#F1ECE3'], ['shoes', '#222222']] },
  { id: 3, t: 'Outfit Rapat', d: '6 Mar 2026', g: 'Formal', temp: 24, fav: 0, it: [['jacket', '#1d1d1d'], ['pants', '#1d1d1d'], ['shoes', '#111111']] }
];
const PAL = ['#EADBCF', '#D3C4B8', '#652D3A', '#F2A25F', '#000000', '#D4DDF3', '#6A8CA3', '#1B4875', '#C99A93', '#525766', '#5F7F69', '#A56E9C', '#EBA1E0'];
const ANALYTICS = {
  Minggu: { rate: .52, n: 7, bars: [30, 26, 20, 14, 10] },
  Bulan: { rate: .75, n: 18, bars: [32, 24, 18, 16, 10] },
  Tahun: { rate: .88, n: 54, bars: [28, 25, 20, 17, 10] }
};
const BAR_NAMES = ['Dress', 'Atasan', 'Bawahan', 'Outer', 'Gamis'];
const OCC_ICON = { Kuliah: 'backpack', Kerja: 'briefcase', Hangout: 'house', Formal: 'bag', Lainnya: 'dots' };
const STY_ICON = { Minimalist: 'leaf', Casual: 'shirt', Feminime: 'bow', Edgy: 'hijab', Formal: 'blazer', Streetwear: 'cap', Chic: 'bag' };
const DETECT = [
  { name: 'Kemeja Putih', cat: 'Atasan', gaya: 'Elegan, Simple', desc: 'Kemeja putih lengan panjang berbahan katun.' },
  { name: 'Celana Kulot Krem', cat: 'Bawahan', gaya: 'Casual, Simple', desc: 'Celana kulot warna krem, nyaman dipakai harian.' },
  { name: 'Blouse Coklat', cat: 'Atasan', gaya: 'Feminim, Elegan', desc: 'Blouse coklat dengan potongan longgar.' }
];

/* ---------- state ---------- */
const S = {
  auth: store.get('auth', false),
  user: store.get('user', { name: 'Syahrini', email: 'syahrini@gmail.com', dob: '1980-08-01', h: 155, w: 56, custom: false, avatar: '' }),
  closet: store.get('closet', CLOSET_SEED),
  hist: store.get('hist', HIST),
  today: store.get('today', 'o3'),
  saved: store.get('saved', ['o1']),
  prefs: store.get('prefs', { gaya: ['Minimalis'], warna: [2, 4], tipe: ['Dress'] }),
  mood: store.get('mood', []),
  flow: { occ: 'Kuliah', sty: 'Casual', other: '', styAll: [], filt: 'Semua' },
  filter: { budget: 340000, musim: ['Dingin'], warna: [2, 4, 6], tipe: ['Bawahan', 'Atasan'] },
  draft: null,
  cat: 'Semua', q: ''
};
const save = k => store.set(k, S[k]);
const firstName = () => (S.user.custom ? (S.user.name || 'User').split(' ')[0] : 'User');

/* ---------- ui helpers ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
}
function confirmBox(title, msg, yes, onYes) {
  const m = $('#modal');
  m.innerHTML = `<div class="dlg" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><p>${esc(msg)}</p><div class="btns"><button class="btn outline sm" data-m="no">Batal</button><button class="btn coral sm" data-m="yes">${esc(yes)}</button></div></div>`;
  m.classList.add('show');
  m.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b && e.target !== m) return;
    m.classList.remove('show');
    if (b && b.dataset.m === 'yes') onYes();
  };
}
const header = (title, back, right = '') => `<header class="top">${back ? `<button class="back" data-go="${back}" aria-label="Kembali">${I('back')}</button>` : ''}<h1>${esc(title)}</h1>${right}</header>`;
const palette = (arr, sm) => `<div class="pal ${sm ? 'sm' : ''}">${arr.map(c => `<span class="dot" style="background:${c}"></span>`).join('')}</div>`;
const itemImg = it => it.img ? `<img src="${esc(it.img)}" alt="${esc(it.name)}">` : garment(it.type, it.color);
const outPhoto = o => o.img ? `<img src="${esc(o.img)}" alt="">` : figure(o.f);

/* ---------- views ---------- */
const V = {};

V.splash = () => `<div class="splash" data-go="/login">${LOGO}</div>`;

V.login = () => `<div class="authwrap"><div class="auth">
  <h1>Masuk</h1><p class="sub">Selamat datang kembali!</p>
  <form id="fLogin" novalidate>
    <div class="ain"><input id="lu" type="text" placeholder="Email atau nomor telepon" autocomplete="username"></div>
    <div class="ain"><input id="lp" type="password" placeholder="Password" autocomplete="current-password"><button type="button" data-act="pw" aria-label="Tampilkan password">${I('eye')}</button></div>
    <div class="err" id="lerr" hidden></div>
    <button class="btn rect gray" id="lbtn" type="submit">Masuk</button>
  </form>
  <a class="link" data-act="forgot">Lupa password?</a>
  <div class="or">atau</div>
  <button class="social" data-act="social">${GOOGLE}<span>Masuk dengan Google</span></button>
  <button class="social" data-act="social">${APPLE}<span>Masuk dengan Apple</span></button>
  <div class="foot">Belum punya akun? <b data-go="/register">Daftar</b></div>
</div></div>`;

V.register = () => `<div class="authwrap"><div class="auth">
  <h1>Daftar</h1><p class="sub">Buat akun untuk mulai menggunakan PaduPadan</p>
  <form id="fReg" novalidate>
    <div class="ain"><input id="rn" type="text" placeholder="Nama lengkap" autocomplete="name"></div>
    <div class="ain"><input id="re" type="email" placeholder="Email" autocomplete="email"></div>
    <div class="ain"><input id="rp" type="password" placeholder="Password" autocomplete="new-password"><button type="button" data-act="pw" aria-label="Tampilkan password">${I('eye')}</button></div>
    <div class="ain"><input id="rc" type="password" placeholder="Konfirmasi password" autocomplete="new-password"><button type="button" data-act="pw" aria-label="Tampilkan password">${I('eye')}</button></div>
    <div class="err" id="rerr" hidden></div>
    <button class="btn rect gray" id="rbtn" type="submit">Daftar</button>
  </form>
  <div class="foot">Sudah punya akun? <b data-go="/login">Masuk</b></div>
</div></div>`;

V.home = () => {
  const o = OUT[S.today] || OUT.o3;
  return `<div class="page wide">
  <div class="hello"><div><h1>Halo, ${esc(firstName())} 👋</h1><p>Selamat datang di PaduPadan!</p></div><button class="bell" data-go="/notif" aria-label="Notifikasi">${I('bell', '', 28)}</button></div>
  <div class="hl2"><div>
    <div class="ootd-card" id="ootdCard"><div class="hd"><span>OOTD Hari ini</span><button data-act="hideOotd" aria-label="Tutup">${I('close')}</button></div>
      <div class="ootd-in" data-go="/ootd"><div class="im">${flatlay(ootdFlat())}</div><div class="tx"><b>Simpel &amp; Kasual</b><span>Lihat Outfit →</span></div></div></div>
    <div class="sec-h"><h2>Quick Recommendation</h2></div>
    <div class="qr">
      ${[['Kuliah', 'backpack', '#F4A261'], ['Hangout', 'shirt', '#2A9D8F'], ['Rapat', 'briefcase', '#E9C46A'], ['Lainnya', 'dots', '#E76F51']].map(([n, ic, c]) => `<button data-act="quickGo" data-v="${n}"><span class="sq" style="background:${c}">${I(ic)}</span>${n}</button>`).join('')}
    </div></div>
    <div><div class="sec-h"><h2>Riwayat Kombinasi</h2><a data-go="/history">Lihat Semua</a></div>
    <div class="carousel">${[OUT.o7, OUT.o2, OUT.o4, OUT.o1].map(x => `<div class="hc" data-go="/history"><div>${outPhoto(x)}</div></div>`).join('')}</div></div>
  </div></div>`;
};
const ootdFlat = () => [['jacket', '#1c1c1c', 6, 0, 88, 58], ['tee', '#F4F1EC', 28, 14, 44, 36], ['jeans', '#6A93C3', 26, 38, 48, 64]];

V.ootd = () => `<div class="page">
  ${header('OOTD Hari Ini', '/home')}
  <div class="ootd-split"><div class="ootd-big"><div class="ootd-photo">${flatlay([['jacket', '#1c1c1c', 6, 0, 88, 56], ['tee', '#F4F1EC', 30, 10, 40, 34], ['jeans', '#6A93C3', 24, 30, 52, 64], ['shoes', '#f2f2f2', 28, 86, 44, 14]])}
    <span class="tag-b">Simpel &amp; Kasual</span><div class="wx"><div>${I('cloud', '', 16)}Cuaca</div><div><span style="color:#F4C430">${I('sun', '', 16)}</span>24° C Berawan</div></div></div></div>
  <div><div class="items">
    ${[['Atasan', 'Kaos Putih', 'tee', '#F4F1EC'], ['Bawahan', 'Celana Jeans', 'jeans', '#6A93C3'], ['Outer', 'Kemeja Hitam', 'jacket', '#1c1c1c'], ['Sepatu', 'Sneakers', 'shoes', '#f2f2f2']].map(([a, b, t, c]) => `<div class="it"><div class="th">${garment(t, c)}</div><div><b>${a}</b><span>${b}</span></div></div>`).join('')}
  </div>
  <div class="btns"><button class="btn outline sm" data-go="/outfit/o3">Koreksi</button><button class="btn sm" data-act="wearToday">Pakai Hari Ini</button></div></div></div>
</div>`;

V.quick = () => {
  const f = S.flow;
  return `<div class="page">
  ${header('Quick Recommendation', '/home')}
  <p style="font-size:15px;margin-bottom:14px">Mau memakai outfit untuk?</p>
  <h2 class="h2" style="margin-top:6px">Occasion</h2>
  <div class="qgrid" id="qOcc">${['Kuliah', 'Rapat', 'Hangout', 'Formal'].map(x => `<button class="chip ${f.occ === x ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div>
  <h2 class="h2">Style (Opsional)</h2>
  <div class="qgrid" id="qSty">${['Casual', 'Minimalis', 'Vintage', 'Sporty'].map(x => `<button class="chip ${f.sty === x ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div>
  <h2 class="h2">Cuaca</h2>
  <button class="wxcard" data-go="/weather"><span class="sun">${I('sun', '', 38)}</span><span><b>24° C</b><small>Berawan</small></span><span class="chev">${I('chev')}</span></button>
  <div class="stick"><button class="btn" data-act="quickRec">Rekomendasikan</button></div>
</div>`;
};

V.history = () => `<div class="page wide">
  ${header('Riwayat Kombinasi', '/home')}
  <div class="hist">${S.hist.map(h => `<article class="hcard" data-id="${h.id}"><h3>${esc(h.t)}</h3><div class="dt">${esc(h.d)}</div>
    <div class="r">${h.it.map(([t, c]) => `<div class="th">${garment(t, c)}</div>`).join('')}
    <div class="meta">Gaya: ${esc(h.g)}<br>Suhu: ${h.temp}° C</div>
    <div class="ft"><span>${I('chev')}</span><button class="heart ${h.fav ? 'on' : ''}" data-act="fav" data-id="${h.id}" aria-label="Favorit">${I('heart', h.fav ? 'fill' : '')}</button></div></div></article>`).join('')}</div>
</div>`;

V.notif = () => `<div class="page">
  ${header('Notifikasi', '/home')}
  <div class="nlist">
    <div class="ni"><span class="d">${I('hanger')}</span><div><b>OOTD hari ini sudah siap</b><span>Simpel &amp; Kasual — cocok untuk cuaca berawan 24° C.</span></div></div>
    <div class="ni"><span class="d">${I('shirt')}</span><div><b>5 pakaian jarang dipakai</b><span>Coba padukan Sweater Rajut dan Jaket Denim minggu ini.</span></div></div>
    <div class="ni"><span class="d">${I('cloud')}</span><div><b>Cuaca berawan hari ini</b><span>Suhu 22°–25°. Rekomendasi outfit menyesuaikan cuaca.</span></div></div>
  </div></div>`;

/* ----- closet ----- */
V.closet = () => `<div class="page wide">
  ${header('Koleksi Pakaian', '/home')}
  <div class="search"><input id="cq" type="search" placeholder="Search Pakaian..." value="${esc(S.q)}" aria-label="Cari pakaian">${I('search')}</div>
  <div class="hscroll" id="cCats">${['Semua', 'Atasan', 'Bawahan', 'Kerudung'].map(c => `<button class="chip cream ${S.cat === c ? 'on' : ''}" data-v="${c}">${c}</button>`).join('')}</div>
  <div class="gcloset" id="cGrid"></div>
</div>`;
function closetGrid() {
  const g = $('#cGrid'); if (!g) return;
  const q = S.q.trim().toLowerCase();
  const list = S.closet.filter(i => (S.cat === 'Semua' || i.cat === S.cat) && (!q || (i.name + i.cat + (i.gaya || '')).toLowerCase().includes(q)));
  g.innerHTML = list.length ? list.map(i => `<article class="gc" data-go="/closet/${i.id}"><div class="im">${itemImg(i)}</div><div class="tx"><b>${esc(i.name)}</b><span class="pill">${esc(i.cat)}</span></div></article>`).join('') : '<div class="empty">Pakaian tidak ditemukan.</div>';
}

V.closetDetail = id => {
  const i = S.closet.find(x => String(x.id) === String(id));
  if (!i) return `<div class="page">${header('Detail Pakaian', '/closet')}<p class="muted">Pakaian tidak ditemukan.</p></div>`;
  return `<div class="page">
  ${header('Detail Pakaian', '/closet')}
  <div class="ootd-split"><div><div class="dimg">${itemImg(i)}</div>
  <h2 class="dname">${esc(i.name)}</h2><span class="pill">${esc(i.cat)}</span></div>
  <div><div class="dcard"><h4>Detail Pakaian</h4><dl class="dl">
    <dt>Jenis</dt><i>:</i><dd>${esc(i.jenis || i.cat)}</dd><dt>Warna</dt><i>:</i><dd>${esc(i.warna || '-')}</dd>
    <dt>Motif</dt><i>:</i><dd>${esc(i.motif || '-')}</dd><dt>Gaya</dt><i>:</i><dd>${esc(i.gaya || '-')}</dd></dl></div>
  <div class="row between"><h4 style="font-size:13.5px">Rekomendasi Outfit</h4><a style="font-size:11px;color:#555;cursor:pointer" data-go="/results">Lihat Lainnya →</a></div>
  <div class="recs mt8"><div class="rc" data-go="/outfit/o5"><div class="im">${figure(OUT.o5.f)}</div><div class="tx"><span class="pill">Kuliah</span><br>Casual &amp; Fresh</div></div>
  <div class="rc" data-go="/outfit/o6"><div class="im">${figure(OUT.o6.f)}</div><div class="tx"><span class="pill">Kerudung</span><br>Classic look</div></div></div></div></div>
  <div class="btns mt24"><button class="btn sm" data-go="/edit/${i.id}">Edit ${I('pencil', '', 15)}</button><button class="btn coral sm" data-act="delItem" data-id="${i.id}">Hapus ${I('trash', '', 15)}</button></div>
</div>`;
};

function fieldsHTML(d) {
  return `<label class="field"><span>Nama Pakaian</span><input class="inp" id="fName" placeholder="Contoh : Kemeja Putih" value="${esc(d.name || '')}"></label>
  <label class="field"><span>Kategori</span><select class="inp" id="fCat"><option value="">Pilih Kategori</option>${CAT.map(c => `<option ${d.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
  <label class="field"><span>Gaya</span><input class="inp" id="fGaya" placeholder="Elegan, Simple, Feminim" value="${esc(d.gaya || '')}"></label>
  <label class="field"><span>Deskripsi</span><textarea class="inp" id="fDesc" placeholder="Deskripsi pakaian">${esc(d.desc || '')}</textarea></label>
  <div class="err" id="ferr" hidden></div>`;
}
V.add = () => {
  const d = S.draft || (S.draft = {});
  return `<div class="page">
  ${header('Tambah Pakaian', '/closet')}
  <button class="upload" data-go="/camera" aria-label="Upload foto">${d.img ? `<img src="${esc(d.img)}" alt="Foto pakaian">` : `<span>${I('camera')}Upload Foto</span>`}</button>
  <div class="mt16">${fieldsHTML(d)}</div>
  <button class="btn" data-act="saveItem" data-id="new">Simpan</button>
</div>`;
};
V.camera = () => `<div class="page">
  ${header('Upload Foto', '/add')}
  <div class="cam"><video id="camV" autoplay playsinline muted></video><div class="na" id="camNa">Mengaktifkan kamera…</div><span class="fl">${I('bolt')}</span><button class="shutter" data-act="shutter" aria-label="Ambil foto"></button></div>
  <label class="gallery">atau pilih dari galeri<input id="gal" type="file" accept="image/*" hidden></label>
</div>`;
V.analyzing = () => {
  const img = S.draft && S.draft.img;
  return `<div class="page">
  ${header('Detail Pakaian', '/add')}
  <div class="ai"><b>AI Mengenali Pakaian</b>
    <div class="box">${img ? `<img src="${esc(img)}" alt="">` : garment('blouse', '#6B2D3A')}</div>
    <div><div class="spin"></div><span style="color:#4a6670">Mohon Tunggu Sebentar...</span></div></div>
</div>`;
};
V.edit = id => {
  const i = id === 'new' ? null : S.closet.find(x => String(x.id) === String(id));
  const d = id === 'new' ? (S.draft || {}) : (i || {});
  return `<div class="page">
  ${header('Edit Pakaian', id === 'new' ? '/add' : '/closet/' + id)}
  <div class="photo-wrap">${d.img ? `<img src="${esc(d.img)}" alt="">` : (i ? itemImg(i) : garment('blouse', '#6B2D3A'))}</div>
  ${fieldsHTML(d)}
  <button class="btn" data-act="saveItem" data-id="${esc(id)}">Simpan</button>
</div>`;
};
V.saved = () => `<div class="page"><div class="done"><span>Pakaian Berhasil di simpan</span><div class="tick">${I('check')}</div></div>
  <button class="btn" data-go="/closet">Kembali ke halaman koleksi</button></div>`;

/* ----- recommendation ----- */
const recTabs = a => `<div class="tabs">${[['Untuk hari ini', '/rec'], ['Berdasarkan Acara', '/occasion'], ['Feedback', '/feedback']].map(([t, p], i) => `<button class="chip ${i === a ? 'on' : ''}" data-go="${p}">${t}</button>`).join('')}</div>`;
V.rec = () => `<div class="page wide">
  <header class="top"><h1 style="text-align:center">Rekomendasi Outfit</h1><button class="right" data-go="/filter" aria-label="Filter">${I('gear')}</button></header>
  <div style="max-width:560px;margin:0 auto">${recTabs(0)}
  <div class="mood"><div class="collage"><div class="r1">${['o7', 'o1', 'o8'].map(k => `<div class="ph">${figure(OUT[k].f)}</div>`).join('')}</div>
  <div class="r2">${['o5', 'o6', 'o3'].map(k => `<div class="ph">${figure(OUT[k].f)}</div>`).join('')}</div></div>
  <h2>Kasual &amp; Santai</h2>${palette(['#111111', '#BDBDBD', '#1B4875', '#C8B8AA', '#D8BC9B', '#4D2420', '#CA9D96', '#6D8BA0', '#D2DBF3', '#232B3A', '#FFFFFF', '#652D3A', '#D3C4B8', '#EADBCF'])}
  <button class="btn" data-go="/outfit/o3">Lihat Detail</button></div></div>
</div>`;

V.filter = () => {
  const f = S.filter;
  const m = Math.round((f.budget / 1000000) * 100);
  return `<div class="page">
  ${header('Filter Rekomendasi', '/rec')}
  <h2 class="h2" style="margin-top:4px">Budget</h2>
  <div class="bud"><span class="val" id="bval" style="left:${m}%">Rp ${f.budget.toLocaleString('id-ID')}</span><input id="brg" type="range" min="0" max="1000000" step="10000" value="${f.budget}" aria-label="Budget"><div class="ends"><span>Rp 0</span><span>Rp 1.000.000++</span></div></div>
  <div class="mm"><div>Minimum :<br>Rp 100.000</div><div>Maksimum :<br>Rp 1.000.000</div></div>
  <h2 class="h2">Musim</h2>
  <div class="row gap12" id="fMusim">${['Panas', 'Dingin', 'Hujan'].map(x => `<button class="chip ol ${f.musim.includes(x) ? 'on' : ''}" style="flex:1" data-v="${x}">${f.musim.includes(x) ? I('check', '', 16) : ''}${x}</button>`).join('')}</div>
  <h2 class="h2">Warna Favorit</h2>
  <div class="colors" id="fCol">${colorDots(f.warna)}</div>
  <div class="tipe"><h3>Tipe Pakaian</h3><div class="qgrid" id="fTipe">${['Bawahan', 'Atasan', 'Outer', 'Dress'].map(x => `<button class="chip ${f.tipe.includes(x) ? 'on' : ''}" data-v="${x}">${f.tipe.includes(x) ? I('check', '', 16) : ''}${x}</button>`).join('')}</div></div>
  <div class="btns"><button class="btn outline" data-act="resetFilter">Reset</button><button class="btn" data-act="applyFilter">Terapkan</button></div>
</div>`;
};
const colorDots = sel => PAL.map((c, i) => `<button class="col ${sel.includes(i) ? 'on' : ''}" data-i="${i}" style="background:${c}" aria-label="Warna ${i + 1}">${I('check')}</button>`).join('') + `<label class="col plus" aria-label="Tambah warna">${I('plus')}<input type="color" data-act="addColor"></label>`;

V.occasion = () => `<div class="page">
  ${header('Pilih Occasion', '/rec')}
  ${recTabs(1)}
  <div class="ocgrid" id="oGrid">${['Kuliah', 'Kerja', 'Hangout', 'Formal', 'Lainnya'].map(x => `<button class="oc ${S.flow.occ === x ? 'on' : ''}" data-v="${x}">${I(OCC_ICON[x])}${x}</button>`).join('')}</div>
  <div id="oOther" ${S.flow.occ === 'Lainnya' ? '' : 'hidden'}><h3 class="mt24" style="font-size:16px;margin-bottom:8px">Lainnya :</h3><textarea class="inp" id="oTxt" style="height:110px;border-color:#F7C9A4;box-shadow:0 2px 6px #0002" placeholder="Silahkan tulis deskripsi nya best...">${esc(S.flow.other)}</textarea></div>
  <div class="stick mt24"><button class="btn rect" style="border-radius:12px" data-act="occNext">Lanjut</button></div>
</div>`;
V.style = () => `<div class="page">
  ${header('Pilih Style (Opsional)', '/occasion')}
  <div class="stg" id="sGrid">${Object.keys(STY_ICON).map(x => `<button class="sty ${S.flow.styAll.includes(x) ? 'on' : ''}" data-v="${x}"><span class="bx">${I(STY_ICON[x])}</span>${x}</button>`).join('')}
  <button class="sty add" data-act="addStyle"><span class="bx" style="flex-direction:column">${I('plus', '', 44)}<small style="font-size:12px">Tambah Style</small></span></button></div>
  <div class="stick mt16"><button class="btn rect" style="border-radius:12px" data-go="/weather">Lanjut</button></div>
</div>`;
V.weather = () => `<div class="page">
  ${header('Cuaca Hari Ini', '/style')}
  <div class="wbig"><span class="cl">${I('cloud')}</span><div><h2>Berawan</h2><div class="t">24° C</div><div class="r">22° / 25°</div></div></div>
  <div class="fc">${[['Pagi', 'sun', '#F4C430'], ['Siang', 'sun', '#F4C430'], ['Sore', 'sun', '#F4C430'], ['Malam', 'moon', '#5BA4D6']].map(([n, ic, c]) => `<div><span style="color:${c}">${I(ic, '', 38)}</span>${n}</div>`).join('')}</div>
  <div class="ckrow">${I('check')}<span>Rekomendasi outfit menyesuaikan kondisi cuaca hari ini</span></div>
  <div class="stick mt24"><button class="btn rect" style="border-radius:12px" data-go="/results">Lanjut</button></div>
</div>`;

V.results = () => {
  const f = S.flow, cats = ['Semua', 'Kuliah', 'Kerja', 'Hangout', 'Santai', 'Lainnya...'];
  return `<div class="page wide">
  ${header('Rekomendasi Outfit', '/rec')}
  <div style="max-width:560px"><div class="qgrid" style="grid-template-columns:repeat(3,1fr);gap:10px" id="rCats">${cats.map(c => `<button class="chip ${f.filt === c ? 'on' : ''}" style="height:32px;border-radius:6px;font-size:13px" data-v="${c}">${c}</button>`).join('')}</div>
  <div id="rOther" ${f.filt === 'Lainnya...' ? '' : 'hidden'}><h3 style="font-size:15px;margin:14px 0 6px">Lainnya :</h3><input class="inp" style="border-color:#F7C9A4;border-radius:999px" placeholder="Silahkan tulis deskripsi nya best..."></div></div>
  <div class="ogrid mt16" id="rGrid"></div>
</div>`;
};
function resultsGrid() {
  const g = $('#rGrid'); if (!g) return;
  const f = S.flow.filt;
  const list = Object.values(OUT).filter(o => f === 'Semua' || f === 'Lainnya...' || o.occ === f);
  g.innerHTML = list.length ? list.map(o => `<article class="oc2" data-go="/outfit/${o.id}"><div class="ph">${outPhoto(o)}</div>
    <button class="bm ${S.saved.includes(o.id) ? 'on' : ''}" data-act="bm" data-id="${o.id}" aria-label="Simpan">${I('bookmark')}</button>
    <span class="pill">${o.occ}</span>${palette(o.pal, true)}</article>`).join('') : '<div class="empty" style="grid-column:1/-1">Belum ada rekomendasi untuk kategori ini.</div>';
}

V.outfit = id => {
  const o = OUT[id] || OUT.o3;
  return `<div class="page">
  ${header('Detail', '/results')}
  <div class="dgal"><div class="g"><div class="main" id="oMain">${outPhoto(o)}</div>
    <div class="sd">${[o.f, { ...o.f, bg: '#E3DCD2' }, { ...o.f, bg: '#BFB6AA' }].map(x => `<div class="ph" data-bg="${x.bg}">${figure(x)}</div>`).join('')}</div></div>
    <div class="pal">${o.pal.slice(0, 3).map(c => `<span class="dot" style="background:${c}"></span>`).join('')}</div>
    <h3>${o.id === 'o3' ? 'Casual | Hangout | Siang' : `Casual | ${o.occ} | Siang`}</h3>
    <div class="tg">${o.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    <div class="fl-box">${o.items.map(([t, c]) => `<div>${garment(t, c)}</div>`).join('')}</div>
  </div>
  <div class="btns mt16"><button class="btn outline sm" data-go="/feedback">Suka / Tidak</button><button class="btn outline sm" data-act="correct">Koreksi</button><button class="btn outline sm" data-act="wear" data-id="${o.id}">Pakai Hari Ini</button></div>
  <button class="btn mt12" data-act="toCollection" data-id="${o.id}">Simpan ke Koleksi</button>
</div>`;
};

V.feedback = () => `<div class="page">
  ${header('Feedback', '/rec')}
  ${recTabs(2)}
  <h2 style="text-align:center;font-size:20px;margin-top:26px">Apakah kamu suka outfit ini?</h2>
  <div class="yn" id="yn"><button class="on" data-v="Suka">Suka</button><button data-v="Tidak Suka">Tidak Suka</button></div>
  <div id="why" hidden><div class="ckl">${['Warna kurang cocok', 'Gaya kurang sesuai', 'Item tidak nyaman', 'Lainnya'].map(x => `<label><input type="checkbox" value="${x}">${x}</label>`).join('')}</div>
  <h3 style="font-size:16px;margin-bottom:6px">Lainnya :</h3><textarea class="inp" id="fbTxt" style="height:120px" placeholder="Tulis alasanmu..."></textarea></div>
  <div class="stick mt24"><button class="btn rect" style="border-radius:12px;height:50px" data-act="sendFb">Kirim</button></div>
</div>`;

V.today = () => `<div class="page">
  <div class="donecard"><span class="ico">${I('bag')}</span><p>Outfit hari ini sudah ditambahkan sebagai outfit hari ini!</p><button class="btn" data-go="/ootd">Lihat di OOTD hari ini</button></div></div>`;

/* ----- profile ----- */
const avatar = () => S.user.avatar ? `<img src="${esc(S.user.avatar)}" alt="Foto profil">` : `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#CDB9A6"/><path d="M18 100c0-26 14-38 32-38s32 12 32 38z" fill="#F3EAE0"/><path d="M28 44a22 26 0 0 1 44 0v14c0 10-10 16-22 16s-22-6-22-16z" fill="#F3EAE0"/><ellipse cx="50" cy="46" rx="14" ry="17" fill="#E8B796"/><path d="M40 42q4-3 8 0M52 42q4-3 8 0" stroke="#2b1b17" fill="none" stroke-width="1.5"/><path d="M45 56q5 4 10 0" stroke="#b04a40" fill="none" stroke-width="1.8"/></svg>`;
V.profile = () => `<div class="page">
  ${header('Profil', '/home', `<button class="right" data-go="/settings" aria-label="Pengaturan">${I('gear', '', 22)}</button>`)}
  <div class="pcard"><div class="av">${avatar()}<label aria-label="Ganti foto">${I('camera')}<input type="file" accept="image/*" id="avIn" hidden></label></div><b>${esc(S.user.name)}</b><small>${esc(S.user.email)}</small></div>
  <div class="menu">
    ${[['user', 'Edit Profil', '/profile-edit'], ['hanger', 'Preferensi Gaya', '/prefs'], ['gear', 'Pengaturan', '/settings'], ['help', 'Bantuan', '/help']].map(([ic, t, p]) => `<button class="mi" data-go="${p}">${I(ic)}${t}<span class="ch">${I('chev')}</span></button>`).join('')}
    <button class="mi" data-act="logout">${I('logout')}Logout<span class="ch">${I('chev')}</span></button>
    <button class="mi" data-go="/analytics">${I('star')}Wardrobe Analytics<span class="ch">${I('chev')}</span></button>
  </div></div>`;
V.profileEdit = () => {
  const u = S.user;
  return `<div class="page">
  ${header('Edit Profil', '/profile')}
  <div class="lbl-l">Nama</div><div class="cardf"><input id="pn" value="${esc(u.name)}"></div>
  <div class="lbl-l">Email</div><div class="cardf"><input id="pe" type="email" value="${esc(u.email)}"></div>
  <div class="lbl-l">Tanggal Lahir</div><div class="cardf"><input id="pd" type="date" value="${esc(u.dob)}"></div>
  <div class="lbl-l">Tinggi Badan</div><div class="cardf"><input id="ph" type="number" min="50" max="250" value="${esc(u.h)}"><small>cm</small></div>
  <div class="lbl-l">Berat Badan</div><div class="cardf"><input id="pw" type="number" min="10" max="300" value="${esc(u.w)}"><small>kg</small></div>
  <button class="btn mt24" data-act="saveProfile">Simpan</button></div>`;
};
V.prefs = () => {
  const p = S.prefs;
  const T = [['Atasan', 'shirt'], ['Dress', 'dress'], ['Bawahan', 'pants'], ['Outer', 'coat']];
  return `<div class="page">
  ${header('Preferensi Gaya', '/profile')}
  <h2 class="h2" style="margin-top:2px;color:#111">Gaya Favorit</h2>
  <div class="pgrid" id="pGaya">${['Minimalis', 'Casual', 'Feminim', 'Edgy', 'Vintage', 'Sporty'].map(x => `<button class="chip card ${p.gaya.includes(x) ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div>
  <h2 class="h2" style="color:#111">Warna Favorit</h2><div class="colors" id="pCol">${colorDots(p.warna)}</div>
  <h2 class="h2" style="color:#111">Tipe Pakaian yang Sering Dipakai</h2>
  <div class="tgrid" id="pTipe">${T.map(([n, ic]) => `<button class="tp ${p.tipe.includes(n) ? 'on' : ''}" data-v="${n}">${I(ic)}${n}</button>`).join('')}</div>
  <div class="btns mt24"><button class="btn outline" data-go="/moodboard">Moodboard</button><button class="btn" data-act="savePrefs">Simpan</button></div></div>`;
};
V.moodboard = () => `<div class="page wide">
  ${header('Moodboard Gaya', '/prefs')}
  <p class="desc" style="max-width:560px">Upload referensi gaya atau inspirasi outfit yang kamu sukai. Ini membantu kami memberikan rekomendasi yang lebih sesuai.</p>
  <div class="mgrid" id="mGrid"></div>
  <div style="max-width:560px"><button class="btn mt24" data-act="saveMood">Simpan</button></div></div>`;
function moodGrid() {
  const g = $('#mGrid'); if (!g) return;
  g.innerHTML = MOOD.map(f => `<div class="ph">${figure(f)}</div>`).join('') +
    S.mood.map((src, i) => `<div class="ph"><img src="${esc(src)}" alt="Referensi"><button class="x" data-act="delMood" data-i="${i}" aria-label="Hapus">${I('close')}</button></div>`).join('') +
    `<label class="ph addp">${I('plus')}<span>Tambah<br>Foto</span><input type="file" accept="image/*" id="mIn"></label>`;
  const inp = $('#mIn');
  if (inp) inp.onchange = () => readImg(inp.files[0], 600, src => { S.mood.push(src); save('mood'); moodGrid(); toast('Foto ditambahkan'); });
}
V.analytics = () => `<div class="page">
  ${header('Analitik Wardobe', '/profile')}
  <div class="seg" id="aSeg">${['Minggu', 'Bulan', 'Tahun'].map(x => `<button class="${x === 'Bulan' ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div>
  <div class="stat"><div class="donut"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#D8DDD6" stroke-width="9"/><circle id="aArc" cx="50" cy="50" r="44" fill="none" stroke="#2A9D8F" stroke-width="9" stroke-linecap="round" stroke-dasharray="0 276.5" style="transition:stroke-dasharray .6s"/></svg><b>Tingkat Pemakaian</b><small>dari total koleksi</small></div>
  <div class="it2"><div class="big" id="aN">18</div>Item paling<br>sering dipakai</div></div>
  <h2 class="h2">Kategori Pakaian</h2><div class="bars" id="aBars"></div>
  <button class="insight" data-go="/rare"><span class="cc">${I('dress')}</span><span id="aIns">Dress adalah kategori yang sering kamu pakai!</span><span class="ch">${I('chev')}</span></button></div>`;
function drawAnalytics(k) {
  const a = ANALYTICS[k];
  $('#aArc').setAttribute('stroke-dasharray', `${(a.rate * 276.5).toFixed(1)} 276.5`);
  $('#aN').textContent = a.n;
  $('#aBars').innerHTML = a.bars.map((v, i) => `<div><i style="height:${Math.round(v / 32 * 150)}px"></i>${BAR_NAMES[i]}<br>${v}%</div>`).join('');
}
V.rare = () => `<div class="page">
  ${header('Pakaian Jarang Dipakai', '/analytics')}
  <p class="desc">Berikut adalah pakaian yang jarang kamu pakai dalam 3 bulan terakhir.</p>
  <div class="rare">${RARE.map(r => `<button class="ri" data-go="/closet"><div class="th">${garment(r.t, r.c)}</div><div><b>${r.n}</b><small>Dipakai ${r.k} kali</small></div><span class="ch">${I('chev')}</span></button>`).join('')}</div>
  <button class="btn mt24" data-go="/closet">Lihat Semua</button></div>`;
V.settings = () => `<div class="page">
  ${header('Pengaturan', '/profile')}
  <div class="menu"><button class="mi" data-go="/profile-edit">${I('user')}Akun<span class="ch">${I('chev')}</span></button><button class="mi" data-act="resetData">${I('trash')}Reset data demo<span class="ch">${I('chev')}</span></button></div>
  <button class="btn outline mt24" data-act="logout">Logout</button></div>`;
V.help = () => `<div class="page">
  ${header('Bantuan', '/profile')}
  <div class="nlist">
    <div class="ni"><span class="d">${I('camera')}</span><div><b>Menambah pakaian</b><span>Tekan tombol + lalu foto atau unggah pakaian. AI akan mengenali atributnya dan kamu bisa mengeditnya sebelum disimpan.</span></div></div>
    <div class="ni"><span class="d">${I('wand')}</span><div><b>Mendapat rekomendasi</b><span>Pilih occasion, style opsional, dan cek cuaca. Tekan “Pakai Hari Ini” untuk menetapkan OOTD.</span></div></div>
    <div class="ni"><span class="d">${I('heart')}</span><div><b>Feedback</b><span>Beri Suka / Tidak Suka beserta alasan agar rekomendasi berikutnya lebih sesuai.</span></div></div>
  </div></div>`;

/* ---------- routing ---------- */
const ROUTES = {
  splash: { v: V.splash, auth: 1, noauth: 1 },
  login: { v: V.login, auth: 1 }, register: { v: V.register, auth: 1 },
  home: { v: V.home, nav: 'home' }, ootd: { v: V.ootd, nav: 'home' }, quick: { v: V.quick, nav: 'home' }, history: { v: V.history, nav: 'home' }, notif: { v: V.notif, nav: 'home' },
  closet: { v: V.closet, nav: 'closet' }, add: { v: V.add, nav: 0, tab: 'closet' }, camera: { v: V.camera, nav: 0, tab: 'closet' }, analyzing: { v: V.analyzing, nav: 0, tab: 'closet' },
  edit: { v: V.edit, nav: 0, tab: 'closet' }, saved: { v: V.saved, nav: 0, tab: 'closet' },
  rec: { v: V.rec, nav: 'rec' }, filter: { v: V.filter, nav: 0, tab: 'rec' }, occasion: { v: V.occasion, nav: 0, tab: 'rec' }, style: { v: V.style, nav: 0, tab: 'rec' }, weather: { v: V.weather, nav: 0, tab: 'rec' },
  results: { v: V.results, nav: 'rec' }, outfit: { v: V.outfit, nav: 0, tab: 'rec' }, feedback: { v: V.feedback, nav: 0, tab: 'rec' }, today: { v: V.today, nav: 'rec' },
  profile: { v: V.profile, nav: 'profile' }, 'profile-edit': { v: V.profileEdit, nav: 'profile' }, prefs: { v: V.prefs, nav: 'profile' }, moodboard: { v: V.moodboard, nav: 'profile' },
  analytics: { v: V.analytics, nav: 'profile' }, rare: { v: V.rare, nav: 'profile' }, settings: { v: V.settings, nav: 'profile' }, help: { v: V.help, nav: 'profile' }
};
let stream = null;
function stopCam() { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
let timer = null;

function renderNav(tab) {
  const items = [['home', 'home', 'Beranda', '/home'], ['closet', 'wand', 'Koleksi', '/closet'], ['add', 'plus', 'Tambah', '/add'], ['rec', 'folder', 'Rekomendasi', '/rec'], ['profile', 'user', 'Profil', '/profile']];
  $('#nav').innerHTML = `<div class="brand">${LOGO}</div>` + items.map(([k, ic, l, p]) => k === 'add'
    ? `<button class="nv add" data-go="${p}" aria-label="Tambah pakaian"><span class="circle">${I(ic, '', 26)}</span><span class="lbl">Tambah Pakaian</span></button>`
    : `<button class="nv ${tab === k ? 'on' : ''}" data-go="${p}" ${tab === k ? 'aria-current="page"' : ''}>${I(ic, k === 'closet' ? 'keep' : '')}<span>${l}</span></button>`).join('');
}

function route() {
  clearTimeout(timer); stopCam();
  $('#modal').classList.remove('show');
  let h = location.hash.slice(1) || (S.auth ? '/home' : '/splash');
  const [, seg, param] = h.split('/');
  let key = seg || 'home';
  if (key === 'closet' && param) key = 'closetDetail';
  let r = key === 'closetDetail' ? { v: V.closetDetail, nav: 0, tab: 'closet' } : ROUTES[key];
  if (!r) { go('/home'); return; }
  if (!r.auth && !S.auth) { go('/login'); return; }
  if (r.auth && S.auth && key !== 'splash') { go('/home'); return; }
  const view = $('#view');
  view.innerHTML = r.v(param);
  window.scrollTo(0, 0);
  document.body.classList.toggle('auth', !!r.auth);
  document.body.classList.toggle('nonav', !r.nav && !r.auth);
  renderNav(r.nav || r.tab || '');
  document.title = 'PaduPadan';
  const init = INIT[key];
  if (init) init(param);
}
window.addEventListener('hashchange', route);

/* ---------- image helper ---------- */
function readImg(file, max, cb) {
  if (!file) return;
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', .85));
    };
    im.onerror = () => toast('Gambar tidak dapat dibaca');
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
}
const toggle = (arr, v) => { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); };

/* ---------- per-view init ---------- */
const INIT = {
  splash() { timer = setTimeout(() => go(S.auth ? '/home' : '/login'), 2200); },
  login() {
    const u = $('#lu'), p = $('#lp'), b = $('#lbtn');
    const upd = () => b.classList.toggle('gray', !(u.value.trim() && p.value));
    [u, p].forEach(e => e.addEventListener('input', upd));
    $('#fLogin').addEventListener('submit', e => {
      e.preventDefault();
      const er = $('#lerr');
      if (!u.value.trim() || !p.value) { er.textContent = 'Isi email/nomor telepon dan password.'; er.hidden = false; return; }
      S.auth = true; save('auth'); go('/home');
    });
  },
  register() {
    const f = ['rn', 're', 'rp', 'rc'].map(i => $('#' + i)), b = $('#rbtn');
    const upd = () => b.classList.toggle('gray', !f.every(x => x.value.trim()));
    f.forEach(e => e.addEventListener('input', upd));
    $('#fReg').addEventListener('submit', e => {
      e.preventDefault();
      const er = $('#rerr'); let m = '';
      if (!f.every(x => x.value.trim())) m = 'Semua kolom wajib diisi.';
      else if (!/^\S+@\S+\.\S+$/.test(f[1].value)) m = 'Format email tidak valid.';
      else if (f[2].value.length < 6) m = 'Password minimal 6 karakter.';
      else if (f[2].value !== f[3].value) m = 'Konfirmasi password tidak sama.';
      if (m) { er.textContent = m; er.hidden = false; return; }
      S.user.name = f[0].value.trim(); S.user.email = f[1].value.trim(); S.user.custom = true; save('user');
      S.auth = true; save('auth'); toast('Akun berhasil dibuat'); go('/home');
    });
  },
  quick() {
    $('#qOcc').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; S.flow.occ = b.dataset.v; $$('#qOcc .chip').forEach(c => c.classList.toggle('on', c === b)); };
    $('#qSty').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; S.flow.sty = S.flow.sty === b.dataset.v ? '' : b.dataset.v; $$('#qSty .chip').forEach(c => c.classList.toggle('on', c.dataset.v === S.flow.sty)); };
  },
  closet() {
    closetGrid();
    $('#cq').addEventListener('input', e => { S.q = e.target.value; closetGrid(); });
    $('#cCats').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; S.cat = b.dataset.v; $$('#cCats .chip').forEach(c => c.classList.toggle('on', c === b)); closetGrid(); };
  },
  camera() {
    const v = $('#camV'), na = $('#camNa');
    $('#gal').onchange = e => readImg(e.target.files[0], 900, src => { S.draft = { ...(S.draft || {}), img: src }; go('/analyzing'); });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then(s => {
        if (location.hash.slice(1) !== '/camera') { s.getTracks().forEach(t => t.stop()); return; }
        stream = s; v.srcObject = s; na.style.display = 'none';
      }).catch(() => { na.textContent = 'Kamera tidak tersedia. Gunakan pilihan galeri di bawah.'; });
    } else na.textContent = 'Kamera tidak tersedia. Gunakan pilihan galeri di bawah.';
  },
  analyzing() {
    timer = setTimeout(() => {
      const d = DETECT[Math.floor(Math.random() * DETECT.length)];
      S.draft = { ...S.draft, name: d.name, cat: d.cat, gaya: d.gaya, desc: d.desc };
      go('/edit/new');
    }, 2400);
  },
  filter() {
    const f = S.filter, rg = $('#brg'), bv = $('#bval');
    const upd = () => { f.budget = +rg.value; bv.textContent = 'Rp ' + f.budget.toLocaleString('id-ID'); bv.style.left = (f.budget / 10000) + '%'; };
    rg.addEventListener('input', upd);
    const multi = (sel, key, label) => $(sel).onclick = e => {
      const b = e.target.closest('[data-v]'); if (!b) return; toggle(f[key], b.dataset.v);
      const on = f[key].includes(b.dataset.v); b.classList.toggle('on', on); b.innerHTML = (on ? I('check', '', 16) : '') + b.dataset.v;
    };
    multi('#fMusim', 'musim'); multi('#fTipe', 'tipe');
    bindColors('#fCol', f.warna);
  },
  occasion() {
    $('#oGrid').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; S.flow.occ = b.dataset.v; $$('#oGrid .oc').forEach(c => c.classList.toggle('on', c === b)); $('#oOther').hidden = b.dataset.v !== 'Lainnya'; };
    $('#oTxt').addEventListener('input', e => S.flow.other = e.target.value);
  },
  style() {
    $('#sGrid').onclick = e => { const b = e.target.closest('.sty[data-v]'); if (!b) return; toggle(S.flow.styAll, b.dataset.v); b.classList.toggle('on'); };
  },
  results() {
    resultsGrid();
    $('#rCats').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; S.flow.filt = b.dataset.v; $$('#rCats .chip').forEach(c => c.classList.toggle('on', c === b)); $('#rOther').hidden = b.dataset.v !== 'Lainnya...'; resultsGrid(); };
  },
  outfit() {
    $$('.dgal .sd .ph').forEach(p => p.onclick = () => { $('#oMain').innerHTML = p.innerHTML; });
  },
  feedback() {
    $('#yn').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; $$('#yn button').forEach(x => x.classList.toggle('on', x === b)); $('#why').hidden = b.dataset.v !== 'Tidak Suka'; };
  },
  profile() {
    const i = $('#avIn'); if (i) i.onchange = () => readImg(i.files[0], 300, src => { S.user.avatar = src; save('user'); route(); toast('Foto profil diperbarui'); });
  },
  prefs() {
    const p = S.prefs;
    $('#pGaya').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; toggle(p.gaya, b.dataset.v); b.classList.toggle('on'); };
    $('#pTipe').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; toggle(p.tipe, b.dataset.v); b.classList.toggle('on'); };
    bindColors('#pCol', p.warna);
  },
  moodboard() { moodGrid(); },
  analytics() {
    drawAnalytics('Bulan');
    $('#aSeg').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; $$('#aSeg button').forEach(x => x.classList.toggle('on', x === b)); drawAnalytics(b.dataset.v); };
  }
};
function bindColors(sel, arr) {
  const box = $(sel);
  box.onclick = e => { const b = e.target.closest('.col[data-i]'); if (!b) return; toggle(arr, +b.dataset.i); b.classList.toggle('on'); };
  const ci = box.querySelector('input[type=color]');
  if (ci) ci.onchange = () => { PAL.push(ci.value); arr.push(PAL.length - 1); box.innerHTML = colorDots(arr); bindColors(sel, arr); };
}

/* ---------- actions ---------- */
const ACT = {
  pw(el) {
    const i = el.parentElement.querySelector('input'), show = i.type === 'password';
    i.type = show ? 'text' : 'password'; el.innerHTML = I(show ? 'eyeoff' : 'eye');
  },
  forgot() { toast('Tautan reset password dikirim ke email Anda (demo)'); },
  social() { S.auth = true; save('auth'); go('/home'); },
  hideOotd() { $('#ootdCard').style.display = 'none'; },
  quickGo(el) {
    const v = el.dataset.v; S.flow.occ = v === 'Rapat' ? 'Rapat' : v; if (v === 'Lainnya') { go('/occasion'); return; }
    go('/quick');
  },
  quickRec() {
    const m = { Kuliah: 'Kuliah', Rapat: 'Kerja', Hangout: 'Hangout', Formal: 'Kerja' };
    S.flow.filt = m[S.flow.occ] || 'Semua'; go('/results');
  },
  wearToday() { S.today = 'o3'; save('today'); toast('OOTD hari ini diperbarui'); },
  fav(el, e) { e.stopPropagation(); const h = S.hist.find(x => x.id == el.dataset.id); h.fav = h.fav ? 0 : 1; save('hist'); el.classList.toggle('on', !!h.fav); el.innerHTML = I('heart', h.fav ? 'fill' : ''); },
  delItem(el) {
    confirmBox('Hapus pakaian?', 'Pakaian ini akan dihapus dari koleksi dan tidak dapat dikembalikan.', 'Hapus', () => {
      S.closet = S.closet.filter(x => String(x.id) !== el.dataset.id); save('closet'); toast('Pakaian dihapus'); go('/closet');
    });
  },
  saveItem(el) {
    const n = $('#fName').value.trim(), c = $('#fCat').value, er = $('#ferr');
    if (!n || !c) { er.textContent = 'Nama pakaian dan kategori wajib diisi.'; er.hidden = false; return; }
    const attrs = { name: n, cat: c, gaya: $('#fGaya').value.trim(), desc: $('#fDesc').value.trim() };
    const typeOf = { Atasan: 'blouse', Bawahan: 'pants', Kerudung: 'scarf', Outer: 'jacket', Dress: 'dress' };
    if (el.dataset.id === 'new') {
      const it = { id: Date.now(), ...attrs, jenis: c, type: typeOf[c], color: '#8a6f5b' };
      if (S.draft && S.draft.img) it.img = S.draft.img;
      S.closet.unshift(it); S.draft = null;
    } else {
      const it = S.closet.find(x => String(x.id) === el.dataset.id); Object.assign(it, attrs, { jenis: it.jenis || c });
      it.type = it.type || typeOf[c];
    }
    try { save('closet'); } catch (e) {}
    go('/saved');
  },
  addColor() {},
  resetFilter() { S.filter = { budget: 340000, musim: [], warna: [], tipe: [] }; route(); },
  applyFilter() { toast('Filter diterapkan'); go('/results'); },
  occNext() { go('/style'); },
  addStyle() {
    const n = prompt('Nama style baru:'); if (!n || !n.trim()) return;
    STY_ICON[n.trim()] = 'star'; S.flow.styAll.push(n.trim()); route();
  },
  bm(el, e) {
    e.stopPropagation(); toggle(S.saved, el.dataset.id); save('saved');
    el.classList.toggle('on', S.saved.includes(el.dataset.id)); toast(S.saved.includes(el.dataset.id) ? 'Outfit disimpan' : 'Outfit dihapus dari simpanan');
  },
  correct() { toast('Pilih item lain pada koleksi untuk mengoreksi kombinasi'); setTimeout(() => go('/closet'), 900); },
  wear(el) { S.today = el.dataset.id; save('today'); S.hist.unshift({ id: Date.now(), t: 'Outfit ' + OUT[el.dataset.id].occ, d: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), g: 'Kasual', temp: 24, fav: 0, it: OUT[el.dataset.id].items.slice(0, 3) }); save('hist'); go('/today'); },
  toCollection(el) { if (!S.saved.includes(el.dataset.id)) { S.saved.push(el.dataset.id); save('saved'); } toast('Outfit disimpan ke koleksi'); },
  sendFb() {
    const dis = $('#yn .on').dataset.v === 'Tidak Suka';
    toast(dis ? 'Terima kasih! Rekomendasi berikutnya akan lebih sesuai.' : 'Senang kamu suka outfit ini!');
    setTimeout(() => go('/results'), 800);
  },
  saveProfile() {
    const u = S.user;
    u.name = $('#pn').value.trim() || u.name; u.email = $('#pe').value.trim() || u.email; u.dob = $('#pd').value || u.dob;
    u.h = $('#ph').value; u.w = $('#pw').value; u.custom = true; save('user'); toast('Profil disimpan'); go('/profile');
  },
  savePrefs() { save('prefs'); toast('Preferensi disimpan'); go('/profile'); },
  saveMood() { save('mood'); toast('Moodboard disimpan'); go('/prefs'); },
  delMood(el) { S.mood.splice(+el.dataset.i, 1); save('mood'); moodGrid(); },
  logout() { confirmBox('Keluar dari akun?', 'Anda perlu masuk lagi untuk memakai PaduPadan.', 'Logout', () => { S.auth = false; save('auth'); go('/login'); }); },
  resetData() { confirmBox('Reset data demo?', 'Semua koleksi, riwayat, dan preferensi kembali ke data awal.', 'Reset', () => { try { Object.keys(localStorage).filter(k => k.startsWith('pp_')).forEach(k => localStorage.removeItem(k)); } catch (e) {} location.hash = '/splash'; location.reload(); }); },
  shutter() {
    const v = $('#camV');
    if (stream && v.videoWidth) {
      const c = document.createElement('canvas'), k = Math.min(1, 900 / v.videoWidth);
      c.width = v.videoWidth * k; c.height = v.videoHeight * k; c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      S.draft = { ...(S.draft || {}), img: c.toDataURL('image/jpeg', .85) }; go('/analyzing');
    } else $('#gal').click();
  }
};

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a && ACT[a.dataset.act]) { ACT[a.dataset.act](a, e); if (e.defaultPrevented) return; return; }
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(g.dataset.go); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#modal').classList.remove('show'); });

/* history-card click (kartu riwayat) */
document.addEventListener('click', e => { const c = e.target.closest('.hcard'); if (c && !e.target.closest('[data-act]')) toast('Detail outfit: ' + c.querySelector('h3').textContent); });

route();
