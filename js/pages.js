// ── README ────────────────────────────────────────────────────────────────
function renderReadme() {
  const cy       = maxYear();
  const total    = rawData.length;
  const shows    = rawData.filter(r => r.type.includes('Show') || r.type.includes('Series')).length;
  const movies   = rawData.filter(r => r.type.toLowerCase() === 'movie').length;
  const allST    = rawData.reduce((s, r) => s + r.screentime, 0);
  const cyrData  = rawData.filter(r => r.year === cy);
  const cyrST    = cyrData.reduce((s, r) => s + r.screentime, 0);
  const prevData = rawData.filter(r => r.year === cy - 1);
  const prevST   = prevData.reduce((s, r) => s + r.screentime, 0);
  const diff     = cyrST - prevST;
  const diffPct  = prevST ? ((diff / prevST) * 100).toFixed(1) : 0;
  const topPlat  = countBy(rawData, 'platform')[0];
  const topGenre = countBy(rawData, 'genre')[0];
  const bestMo   = Object.entries(countByMonth(rawData)).sort((a, b) => b[1] - a[1])[0];
  const avgMo    = (total / 12).toFixed(1);
  const today    = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const yoyPct   = prevST ? Math.min((cyrST / prevST) * 100, 100) : 50;

  // Pre-compute badge class — never put ternaries inside class="" attributes
  const diffBadgeClass = diff >= 0 ? 'badge badge-green' : 'badge badge-red';
  const diffSign       = diff >= 0 ? '+' : '';

  document.getElementById('app').innerHTML = `
    <div class="readme-hero">
      <div class="readme-top">
        <div>
          <h1><em>personal media tracker</em>Content Tracking Dashboard</h1>
          <p class="readme-desc">Track and analyse my media consumption across streaming platforms. See genre trends, platform habits, and how my viewing changes over time.</p>
        </div>
        <div class="readme-updated"><strong>${today}</strong>Last updated</div>
      </div>
      <div class="readme-stats">
        <div class="readme-stat">
          <div class="rs-label">Total Titles</div>
          <div class="rs-val">${total}</div>
          <div class="rs-sub">${shows} shows · ${movies} movies</div>
        </div>
        <div class="readme-stat">
          <div class="rs-label">All Time Screentime</div>
          <div class="rs-val">${fmtK(Math.round(allST / 60))}<small> hrs</small></div>
          <div class="rs-sub">${fmtK(Math.round(allST))} mins logged</div>
        </div>
        <div class="readme-stat">
          <div class="rs-label">This Year (${cy})</div>
          <div class="rs-val">${Math.round(cyrST / 60)}<small> hrs</small></div>
          <div class="rs-sub"><span class="rs-accent">${cyrData.length} titles</span> watched in ${cy}</div>
        </div>
        <div class="readme-stat">
          <div class="rs-label">Top Platform</div>
          <div class="rs-val" style="font-size:20px;letter-spacing:-.3px">${topPlat ? getEmoji(topPlat[0]) : ''}${topPlat ? topPlat[0] : '—'}</div>
          <div class="rs-sub">${topPlat ? topPlat[1] + ' titles all time' : ''}</div>
        </div>
      </div>
    </div>

    <div class="readme-main">
      <div>
        <div class="cards-label">What's inside</div>
        <div class="cards-grid">
          <div class="info-card" onclick="navigateTo('current')" style="cursor:pointer">
            <div class="ic-icon">📅</div>
            <div class="ic-body"><h3>Current Year Numbers</h3><p>This year's stats — shows vs movies, platform breakdown, genre split and monthly viewing trend.</p></div>
          </div>
          <div class="info-card" onclick="navigateTo('alltime')" style="cursor:pointer">
            <div class="ic-icon">📈</div>
            <div class="ic-body"><h3>All Time Numbers</h3><p>Complete viewing history across all years. Filter by year, platform or genre to spot long-term patterns.</p></div>
          </div>
          <div class="info-card" onclick="navigateTo('data')" style="cursor:pointer">
            <div class="ic-icon">🗂️</div>
            <div class="ic-body"><h3>Data</h3><p>Full list of every title logged. Search by name, filter by type, genre, platform or month.</p></div>
          </div>
          <div class="info-card" onclick="navigateTo('suggestions')" style="cursor:pointer">
            <div class="ic-icon gold">🎲</div>
            <div class="ic-body"><h3>Suggestion Generator</h3><p>Can't decide what to watch? Spin for a random pick filtered by genre or type.</p></div>
          </div>
        </div>
      </div>
      <div class="readme-sidebar">
        <div class="fact-card">
          <div class="fact-title">Quick Facts</div>
          <div class="fact-row"><div class="fact-l"><span>🎭</span> Top Genre</div><div class="fact-r">${topGenre ? topGenre[0] : '—'}</div></div>
          <div class="fact-row"><div class="fact-l"><span>📆</span> Best Month</div><div class="fact-r">${bestMo ? bestMo[0] : '—'}</div></div>
          <div class="fact-row"><div class="fact-l"><span>📊</span> Avg / Month</div><div class="fact-r">${avgMo} titles</div></div>
          <div class="fact-row"><div class="fact-l"><span>📺</span> Shows</div><div class="fact-r">${total ? (shows / total * 100).toFixed(1) : 0}%</div></div>
          <div class="fact-row"><div class="fact-l"><span>🎬</span> Movies</div><div class="fact-r">${total ? (movies / total * 100).toFixed(1) : 0}%</div></div>
        </div>
        <div class="yoy-card">
          <div class="yoy-title">Year on Year</div>
          <div class="yoy-row">
            <div>
              <div class="yoy-label">This year so far</div>
              <div class="yoy-val">${fmtHrs(cyrST)}</div>
            </div>
            <span class="${diffBadgeClass}">${diffSign}${diffPct}%</span>
          </div>
          <div class="yoy-bar-track"><div class="yoy-bar-fill" style="width:${yoyPct}%"></div></div>
          <div class="yoy-note">vs ${fmtHrs(prevST)} full year ${cy - 1}</div>
        </div>
        <div class="note-card">
          <div class="note-icon">💡</div>
          <div class="note-body"><strong>About Difference</strong>All difference figures compare screentime to the same metric from the previous year.</div>
        </div>
      </div>
    </div>
    <div class="footer">Data loaded live from Google Sheets · ${total} titles</div>
  `;
}

// ── CURRENT YEAR ──────────────────────────────────────────────────────────
function renderCurrentYear() {
  const cy       = maxYear();
  const platforms = ['all', ...uniqueVals('platform')];
  const genres    = ['all', ...uniqueVals('genre')];

  let filterHtml = '';
  filterHtml += '<div class="ph-filter"><label>Platform&nbsp;</label><select onchange="curFilters.platform=this.value;updateCurrentYear()">';
  platforms.forEach(function(p) { filterHtml += '<option value="' + p + '">' + (p === 'all' ? 'All' : p) + '</option>'; });
  filterHtml += '</select></div>';

  filterHtml += '<div class="ph-filter"><label>Genre&nbsp;</label><select onchange="curFilters.genre=this.value;updateCurrentYear()">';
  genres.forEach(function(g) { filterHtml += '<option value="' + g + '">' + (g === 'all' ? 'All' : g) + '</option>'; });
  filterHtml += '</select></div>';

  document.getElementById('app').innerHTML =
    '<div class="page-header">' +
      '<div class="ph-left"><h1>Current Year Numbers</h1><p>' + cy + ' · All months so far</p></div>' +
      '<div class="ph-right">' + filterHtml + '</div>' +
    '</div>' +
    '<div class="main" id="cy-main"></div>' +
    '<div class="footer" id="cy-footer"></div>';

  updateCurrentYear();
}

function updateCurrentYear() {
  const cy       = maxYear();
  const base     = rawData.filter(r => r.year === cy);
  const d        = filterData(base, curFilters);
  const prev     = rawData.filter(r => r.year === cy - 1);
  const shows    = d.filter(r => r.type.includes('Show') || r.type.includes('Series')).length;
  const movies   = d.filter(r => r.type.toLowerCase() === 'movie').length;
  const st       = d.reduce((s, r) => s + r.screentime, 0);
  const prevST   = prev.reduce((s, r) => s + r.screentime, 0);
  const diff     = st - prevST;
  const diffPct  = prevST ? ((diff / prevST) * 100).toFixed(1) : 'N/A';
  const platCounts = countBy(d, 'platform').slice(0, 8);
  const genCounts  = countBy(d, 'genre').slice(0, 5);
  const totalGen   = genCounts.reduce((s, g) => s + g[1], 0);
  const topGenre   = genCounts[0] || ['—', 0];
  const bestMo     = Object.entries(countByMonth(d)).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
  const moData     = countByMonth(d);
  const moLabels   = MONTHS.filter(m => moData[m] > 0);
  const moVals     = moLabels.map(m => moData[m]);

  destroyCharts();

  const body = document.getElementById('cy-main');
  if (!body) return;

  body.innerHTML =
    buildKpiRow(shows, movies, st, d, diff, diffPct, cy) +

    '<div class="charts-row">' +
      '<div class="chart-card a5">' +
        '<div class="chart-title">By Platform</div>' +
        buildPlatBars(platCounts) +
      '</div>' +
      '<div class="chart-card a6">' +
        '<div class="chart-title">Titles by Month</div>' +
        '<div class="chart-canvas-wrap"><canvas id="cy-monthly"></canvas></div>' +
      '</div>' +
    '</div>' +

    '<div class="bottom-row">' +
      '<div class="chart-card" style="animation:fadeUp .5s ease .3s both">' +
        '<div class="chart-title">By Genre</div>' +
        '<div class="treemap">' + buildTreemap(genCounts, totalGen) + '</div>' +
      '</div>' +
      buildStatSidebar(platCounts, topGenre, totalGen, bestMo, 'Total in ' + cy, d.length) +
    '</div>';

  const footer = document.getElementById('cy-footer');
  if (footer) footer.textContent = 'Live from Google Sheets · ' + cy + ' data';

  initLineChart('cy-monthly', moLabels, moVals);
}

// ── ALL TIME ──────────────────────────────────────────────────────────────
function renderAllTime() {
  const years     = ['all', ...[...new Set(rawData.map(r => r.year))].filter(Boolean).sort((a, b) => b - a).map(y => y.toString())];
  const platforms = ['all', ...uniqueVals('platform')];
  const genres    = ['all', ...uniqueVals('genre')];

  let filterHtml = '';
  filterHtml += '<div class="ph-filter"><label>Year&nbsp;</label><select onchange="allFilters.year=this.value;updateAllTime()">';
  years.forEach(function(y) { filterHtml += '<option value="' + y + '">' + (y === 'all' ? 'All Years' : y) + '</option>'; });
  filterHtml += '</select></div>';

  filterHtml += '<div class="ph-filter"><label>Platform&nbsp;</label><select onchange="allFilters.platform=this.value;updateAllTime()">';
  platforms.forEach(function(p) { filterHtml += '<option value="' + p + '">' + (p === 'all' ? 'All' : p) + '</option>'; });
  filterHtml += '</select></div>';

  filterHtml += '<div class="ph-filter"><label>Genre&nbsp;</label><select onchange="allFilters.genre=this.value;updateAllTime()">';
  genres.forEach(function(g) { filterHtml += '<option value="' + g + '">' + (g === 'all' ? 'All' : g) + '</option>'; });
  filterHtml += '</select></div>';

  document.getElementById('app').innerHTML =
    '<div class="page-header">' +
      '<div class="ph-left"><h1>All Time Numbers</h1><p>Complete viewing history · all years</p></div>' +
      '<div class="ph-right">' + filterHtml + '</div>' +
    '</div>' +
    '<div class="main" id="at-main"></div>' +
    '<div class="footer" id="at-footer"></div>';

  updateAllTime();
}

function updateAllTime() {
  const d          = filterData(rawData, allFilters);
  const shows      = d.filter(r => r.type.includes('Show') || r.type.includes('Series')).length;
  const movies     = d.filter(r => r.type.toLowerCase() === 'movie').length;
  const st         = d.reduce((s, r) => s + r.screentime, 0);
  const platCounts = countBy(d, 'platform').slice(0, 8);
  const genCounts  = countBy(d, 'genre').slice(0, 5);
  const totalGen   = genCounts.reduce((s, g) => s + g[1], 0);
  const topGenre   = genCounts[0] || ['—', 0];
  const bestMo     = Object.entries(countByMonth(d)).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
  const yearsSet   = [...new Set(d.map(r => r.year))].filter(Boolean);
  const avgMo      = yearsSet.length ? (d.length / (yearsSet.length * 12)).toFixed(1) : '—';
  const moData     = countByMonth(d);

  destroyCharts();

  const body = document.getElementById('at-main');
  if (!body) return;

  body.innerHTML =
    buildKpiRowAllTime(d, shows, movies, st) +

    '<div class="charts-row">' +
      '<div class="chart-card a5">' +
        '<div class="chart-title">By Platform</div>' +
        buildPlatBars(platCounts) +
      '</div>' +
      '<div class="chart-card a6">' +
        '<div class="chart-title">Total Count by Month (All Years)</div>' +
        '<div class="chart-canvas-wrap"><canvas id="at-monthly"></canvas></div>' +
      '</div>' +
    '</div>' +

    '<div class="bottom-row">' +
      '<div class="chart-card" style="animation:fadeUp .5s ease .3s both">' +
        '<div class="chart-title">By Genre</div>' +
        '<div class="treemap">' + buildTreemap(genCounts, totalGen) + '</div>' +
      '</div>' +
      buildStatSidebar(platCounts, topGenre, totalGen, bestMo, 'Avg Per Month', avgMo + ' titles/mo') +
    '</div>';

  const footer = document.getElementById('at-footer');
  if (footer) footer.textContent = d.length + ' titles · ' + yearsSet.length + ' year' + (yearsSet.length !== 1 ? 's' : '') + ' of data';

  initLineChart('at-monthly', MONTHS, MONTHS.map(m => moData[m]));
}

// ── DATA TAB ──────────────────────────────────────────────────────────────
function renderData() {
  const years     = ['all', ...[...new Set(rawData.map(r => r.year))].filter(Boolean).sort((a, b) => b - a).map(y => y.toString())];
  const platforms = ['all', ...uniqueVals('platform')];
  const genres    = ['all', ...uniqueVals('genre')];
  const types     = ['all', ...uniqueVals('type')];
  const months    = ['all', ...MONTHS.filter(m => rawData.some(r => r.month === m))];

  let filterHtml = '';
  filterHtml += buildFilterSelect(years,     'all', "datFilters.year=this.value;dataPageNum=1;updateDataTable()",     'All Years');
  filterHtml += buildFilterSelect(platforms, 'all', "datFilters.platform=this.value;dataPageNum=1;updateDataTable()", 'All Platforms');
  filterHtml += buildFilterSelect(types,     'all', "datFilters.type=this.value;dataPageNum=1;updateDataTable()",     'All Types');
  filterHtml += buildFilterSelect(genres,    'all', "datFilters.genre=this.value;dataPageNum=1;updateDataTable()",    'All Genres');
  filterHtml += buildFilterSelect(months,    'all', "datFilters.month=this.value;dataPageNum=1;updateDataTable()",    'All Months');
  filterHtml += '<div class="df-divider"></div>';
  filterHtml += '<div class="df-search">';
  filterHtml += '<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#7a9e8a" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="#7a9e8a" stroke-width="1.5" stroke-linecap="round"/></svg>';
  filterHtml += '<input id="df-search" type="text" placeholder="Search by name…" oninput="datFilters.search=this.value;dataPageNum=1;updateDataTable()">';
  filterHtml += '</div>';

  document.getElementById('app').innerHTML =
    '<div class="page-header">' +
      '<div class="ph-left"><h1>All Shows &amp; Movies</h1><p>Your complete watchlist · sorted by watch date</p></div>' +
      '<div class="ph-right">' +
        '<div class="ph-pill">📺 <strong id="dh-shows">—</strong> shows</div>' +
        '<div class="ph-pill">🎬 <strong id="dh-movies">—</strong> movies</div>' +
        '<div class="ph-pill">Total: <strong id="dh-total">—</strong></div>' +
      '</div>' +
    '</div>' +
    '<div class="data-filters">' + filterHtml + '</div>' +
    '<div class="data-main">' +
      '<div class="data-header-row"><div class="data-count" id="dat-count"></div></div>' +
      '<div id="dat-table"></div>' +
      '<div class="pagination" id="dat-pag"></div>' +
    '</div>' +
    '<div class="footer" id="dat-footer"></div>';

  updateDataTable();
}

function updateDataTable() {
  const d = filterData(rawData, datFilters).sort((a, b) => {
    if (!a.watchDate && !b.watchDate) return 0;
    if (!a.watchDate) return 1;
    if (!b.watchDate) return -1;
    return new Date(b.watchDate) - new Date(a.watchDate);
  });

  const shows  = d.filter(r => r.type.includes('Show') || r.type.includes('Series')).length;
  const movies = d.filter(r => r.type.toLowerCase() === 'movie').length;
  const ge = id => document.getElementById(id);

  if (ge('dh-shows'))  ge('dh-shows').textContent  = shows;
  if (ge('dh-movies')) ge('dh-movies').textContent = movies;
  if (ge('dh-total'))  ge('dh-total').textContent  = d.length;

  const totalPages = Math.max(1, Math.ceil(d.length / PER_PAGE));
  if (dataPageNum > totalPages) dataPageNum = 1;
  const start = (dataPageNum - 1) * PER_PAGE;
  const page  = d.slice(start, start + PER_PAGE);

  const countEl = ge('dat-count');
  if (countEl) countEl.innerHTML = '<strong>' + d.length + '</strong> title' + (d.length !== 1 ? 's' : '') + ' found';

  const tableEl = ge('dat-table');
  if (!tableEl) return;

  if (!d.length) {
    tableEl.innerHTML = '<div class="empty-state"><span>🔍</span>No titles match your filters</div>';
    ge('dat-pag').innerHTML = '';
    return;
  }

  tableEl.innerHTML =
    '<table>' +
      '<thead><tr><th>#</th><th>Name</th><th>Type</th><th>Genre</th><th>Platform</th><th>Watch Date</th></tr></thead>' +
      '<tbody>' + buildDataTableRows(page, start) + '</tbody>' +
    '</table>';

  const pagEl = ge('dat-pag');
  if (pagEl) {
    const prevDisabled = dataPageNum <= 1         ? ' disabled' : '';
    const nextDisabled = dataPageNum >= totalPages ? ' disabled' : '';
    pagEl.innerHTML =
      '<div class="pag-info">Showing ' + (start + 1) + '–' + Math.min(start + PER_PAGE, d.length) + ' of ' + d.length + '</div>' +
      '<div class="pag-btns">' +
        '<button class="pag-btn" onclick="dataPageNum--;updateDataTable()"' + prevDisabled + '>← Prev</button>' +
        '<button class="pag-btn" onclick="dataPageNum++;updateDataTable()"' + nextDisabled + '>Next →</button>' +
      '</div>';
  }

  const footEl = ge('dat-footer');
  if (footEl) footEl.textContent = 'Live from Google Sheets · ' + rawData.length + ' total titles';
}

// ── SUGGESTIONS ───────────────────────────────────────────────────────────
function renderSuggestions() {
  const genres = [...new Set(rawData.map(r => r.genre).filter(Boolean))].sort();
  const types  = [...new Set(rawData.map(r => r.type).filter(Boolean))].sort();

  let genOpts = '<option value="all">All Genres</option>';
  genres.forEach(function(g) { genOpts += '<option value="' + g + '">' + g + '</option>'; });

  let typeOpts = '<option value="all">All Types</option>';
  types.forEach(function(t) { typeOpts += '<option value="' + t + '">' + t + '</option>'; });

  document.getElementById('app').innerHTML = `
    <div class="page-header">
      <div class="ph-left"><h1>Suggestion Generator</h1><p>Spin for a random pick from your watchlist</p></div>
    </div>
    <div class="sugg-page">
      <div class="sugg-inner">
        <div class="sugg-filters">
          <div>
            <div class="sf-label">Genre</div>
            <select id="sg-genre" class="sf-select" onchange="updateSuggCount()">${genOpts}</select>
          </div>
          <div>
            <div class="sf-label">Type</div>
            <select id="sg-type" class="sf-select" onchange="updateSuggCount()">${typeOpts}</select>
          </div>
        </div>
        <div class="result-card" id="sugg-card">
          <div class="result-tag">Your Pick</div>
          <div class="result-name empty" id="sugg-name"><span>🎬</span>Hit spin to get a suggestion</div>
          <div class="result-meta" id="sugg-meta"></div>
        </div>
        <button class="spin-btn" id="sugg-spin" onclick="suggSpin(event)">
          <span class="sbi">🎲</span> Spin for a Suggestion
        </button>
        <button class="try-btn" id="sugg-try" onclick="suggTryAgain()" disabled>
          <span class="arr">↻</span> Not feeling it — try another
        </button>
        <div class="sugg-count" id="sugg-count"></div>
      </div>
    </div>
  `;

  updateSuggCount();
}

function getSuggFiltered() {
  const g = document.getElementById('sg-genre') ? document.getElementById('sg-genre').value : 'all';
  const t = document.getElementById('sg-type')  ? document.getElementById('sg-type').value  : 'all';
  return rawData.filter(r => (g === 'all' || r.genre === g) && (t === 'all' || r.type === t));
}

function updateSuggCount() {
  const pool = getSuggFiltered();
  const el   = document.getElementById('sugg-count');
  if (el) el.innerHTML = '<strong>' + pool.length + '</strong> title' + (pool.length !== 1 ? 's' : '') + ' available';
}

function suggSpin(e) {
  const btn  = document.getElementById('sugg-spin');
  const pool = getSuggFiltered();
  if (!pool.length) { showSuggResult(null); return; }
  btn.disabled = true;
  btn.classList.add('spinning');
  addRipple(btn, e);
  let f = 0;
  const iv = setInterval(() => {
    const t  = pool[Math.floor(Math.random() * pool.length)];
    const ne = document.getElementById('sugg-name');
    if (ne) { ne.textContent = t.name; ne.className = 'result-name'; }
    const me = document.getElementById('sugg-meta');
    if (me) me.innerHTML = '';
    if (++f >= 7) {
      clearInterval(iv);
      const excl  = suggLastPick ? suggLastPick.name : null;
      const avail = pool.filter(r => r.name !== excl);
      const pick  = (avail.length ? avail : pool)[Math.floor(Math.random() * (avail.length || pool.length))];
      suggLastPick = pick;
      showSuggResult(pick);
      btn.disabled = false;
      btn.classList.remove('spinning');
      const tryBtn = document.getElementById('sugg-try');
      if (tryBtn) tryBtn.disabled = false;
    }
  }, 80);
}

function suggTryAgain() {
  const pool  = getSuggFiltered();
  const excl  = suggLastPick ? suggLastPick.name : null;
  const avail = pool.filter(r => r.name !== excl);
  const pick  = (avail.length ? avail : pool)[Math.floor(Math.random() * (avail.length || pool.length))];
  suggLastPick = pick;
  showSuggResult(pick, true);
}

function showSuggResult(item, animate = true) {
  const ne = document.getElementById('sugg-name');
  const me = document.getElementById('sugg-meta');
  if (!ne || !me) return;
  if (!item) {
    ne.className = 'result-name empty';
    ne.innerHTML = '<span>😕</span>No matches — try different filters';
    me.innerHTML = '';
    return;
  }
  ne.className = 'result-name' + (animate ? ' spinning' : '');
  if (animate) ne.addEventListener('animationend', () => ne.classList.remove('spinning'), { once: true });
  ne.textContent = item.name;
  me.innerHTML =
    '<span class="rm-badge plat">' + getEmoji(item.platform) + ' ' + item.platform + '</span>' +
    '<span class="rm-badge type">' + (item.type === 'Movie' ? '🎬' : '📺') + ' ' + item.type + '</span>' +
    '<span class="rm-badge genre">🏷️ ' + item.genre + '</span>';
  burstConfetti();
}

function burstConfetti() {
  const card = document.getElementById('sugg-card');
  if (!card) return;
  const cols = ['#40916c', '#f4a261', '#74c69d', '#ffd166', '#2d6a4f'];
  for (let i = 0; i < 12; i++) {
    const dot  = document.createElement('div');
    dot.className = 'confetti-dot';
    const a    = (i / 12) * 360;
    const dist = 40 + Math.random() * 50;
    dot.style.cssText = 'left:50%;top:50%;background:' + cols[i % cols.length] + ';--dx:' + (Math.cos(a * Math.PI / 180) * dist) + 'px;--dy:' + (Math.sin(a * Math.PI / 180) * dist) + 'px;animation-delay:' + (i * .02) + 's;';
    card.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
}

function addRipple(btn, e) {
  const r2 = btn.getBoundingClientRect();
  const rp = document.createElement('div');
  rp.className  = 'ripple';
  rp.style.left = (e.clientX - r2.left - 30) + 'px';
  rp.style.top  = (e.clientY - r2.top - 30)  + 'px';
  btn.appendChild(rp);
  rp.addEventListener('animationend', () => rp.remove());
}
