// ── CONFIG ────────────────────────────────────────────────────────────────
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz55DVD1zBnQzDaJ-tHF49wMIzpI6pR_R3k47DPz7yu2fOWM-FdQlKl7MWhVYbaHgU_rQ/exec';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PEMOJI = {
  'Netflix': '🔴',
  'Amazon Prime Video': '🔵',
  'Apple TV+': '⚫',
  'HBO Max': '🟣',
  'Disney+': '🔷',
  'Peacock': '🦚',
  'Hulu': '🟢',
  'Theater': '🎬',
  'Paramount+': '⭐',
  'MUBI': '🎞️'
};

// ── STATE ─────────────────────────────────────────────────────────────────
let rawData        = [];
let currentPage    = 'readme';
let charts         = {};
let curFilters     = { platform: 'all', genre: 'all' };
let allFilters     = { year: 'all', platform: 'all', genre: 'all' };
let datFilters     = { year: 'all', platform: 'all', type: 'all', genre: 'all', month: 'all', search: '' };
let dataPageNum    = 1;
const PER_PAGE     = 25;
let suggLastPick   = null;

// ── DATA LOADING ──────────────────────────────────────────────────────────
async function loadData() {
  try {
    const res  = await fetch(SCRIPT_URL, { redirect: 'follow', mode: 'cors' });
    const json = await res.json();
    rawData = json.map(r => ({
      name:       r.Name       || r.name       || '',
      type:       r.Type       || r.type       || '',
      genre:      r['Details/Genre'] || r.Genre || r.genre || '',
      platform:   r.Platform   || r.platform   || '',
      screentime: parseFloat(r.Screentime || r.screentime || 0) || 0,
      watchDate:  r['Watch Date'] || r.watchDate || '',
      month:      r.Month      || r.month      || '',
      year:       parseInt(r.Year || r.year || 0) || 0
    })).filter(r => r.name && r.year > 0);
  } catch (e) {
    console.warn('Data load failed:', e);
    rawData = [];
  }
  setTimeout(() => {
    document.getElementById('loading').classList.add('hide');
    navigateTo('readme');
  }, 200);
}

// ── UTILS ─────────────────────────────────────────────────────────────────
function maxYear() {
  return rawData.length ? Math.max(...rawData.map(r => r.year)) : new Date().getFullYear();
}

function fmtHrs(m) {
  return (m / 60).toFixed(1).replace(/\.0$/, '') + ' hrs';
}

function fmtK(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();
}

function uniqueVals(key) {
  return [...new Set(rawData.map(r => r[key]).filter(Boolean))].sort();
}

function filterData(d, f) {
  return d.filter(r =>
    (f.year     === 'all' || r.year     == f.year) &&
    (f.platform === 'all' || r.platform === f.platform) &&
    (f.genre    === 'all' || r.genre    === f.genre) &&
    (f.type     === 'all' || r.type     === f.type) &&
    (f.month    === 'all' || r.month    === f.month) &&
    (!f.search  || r.name.toLowerCase().includes(f.search.toLowerCase()))
  );
}

function countBy(arr, key) {
  const m = {};
  arr.forEach(r => { const v = r[key] || 'Unknown'; m[v] = (m[v] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

function countByMonth(arr) {
  const m = {};
  MONTHS.forEach(mo => m[mo] = 0);
  arr.forEach(r => { if (m[r.month] !== undefined) m[r.month]++; });
  return m;
}

function destroyCharts() {
  Object.values(charts).forEach(c => { try { c.destroy(); } catch (e) {} });
  charts = {};
}

function getEmoji(platform) {
  return PEMOJI[platform] || '📺';
}

function fmtDate(s) {
  try {
    const dt = new Date(s);
    return isNaN(dt) ? s : dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return s;
  }
}
