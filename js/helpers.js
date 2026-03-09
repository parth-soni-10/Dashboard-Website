// ── HTML BUILDER HELPERS ──────────────────────────────────────────────────
// These use string concatenation intentionally to avoid the nested-quote
// syntax errors that occur when ternary operators appear inside class=""
// attributes within template literals.

function buildPlatBars(platCounts) {
  if (!platCounts.length) return '<p style="color:var(--text-soft);font-size:13px">No data</p>';
  const maxVal = platCounts[0][1];
  let html = '<div class="plat-bars">';
  platCounts.forEach(function(p, i) {
    const pct       = maxVal ? ((p[1] / maxVal) * 100).toFixed(0) : 0;
    const fillClass = i === 0 ? 'plat-fill top' : 'plat-fill';
    const emoji     = getEmoji(p[0]);
    html += '<div class="plat-row">';
    html += '<div class="plat-name">' + emoji + ' ' + p[0] + '</div>';
    html += '<div class="plat-track"><div class="' + fillClass + '" style="width:' + pct + '%"></div></div>';
    html += '<div class="plat-count">' + p[1] + '</div>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function buildTreemap(genCounts, totalGen) {
  const colClasses = ['col1', 'col2a', 'col2b', 'col3a', 'col3b'];
  const pads       = genCounts.slice(0, 5);
  while (pads.length < 5) pads.push(['—', 0]);
  let html = '';
  pads.forEach(function(g, i) {
    const pct = totalGen && g[1] ? (g[1] / totalGen * 100).toFixed(1) + '%' : '';
    html += '<div class="tm-block ' + colClasses[i] + '">';
    html += '<div class="tm-name">' + g[0] + '</div>';
    html += '<div class="tm-pct">' + pct + '</div>';
    html += '</div>';
  });
  return html;
}

function buildStatSidebar(platCounts, topGenre, totalGen, bestMo, extraLabel, extraVal) {
  const topPlatName  = platCounts[0] ? platCounts[0][0] : '—';
  const topPlatCount = platCounts[0] ? platCounts[0][1] + ' titles' : '';
  const genrePct     = totalGen ? (topGenre[1] / totalGen * 100).toFixed(1) + '%' : '0%';

  let html = '<div class="stat-sidebar">';

  html += '<div class="stat-card a1">';
  html += '<div class="stat-info"><div class="stat-label">Top Platform</div>';
  html += '<div class="stat-val" style="font-size:17px">' + getEmoji(topPlatName) + ' ' + topPlatName + '</div></div>';
  html += '<span class="stat-badge2">' + topPlatCount + '</span>';
  html += '</div>';

  html += '<div class="stat-card a2">';
  html += '<div class="stat-info"><div class="stat-label">Top Genre</div>';
  html += '<div class="stat-val">' + topGenre[0] + '</div></div>';
  html += '<span class="stat-badge2">' + genrePct + '</span>';
  html += '</div>';

  html += '<div class="stat-card a3">';
  html += '<div class="stat-info"><div class="stat-label">Best Month</div>';
  html += '<div class="stat-val">' + bestMo[0] + '</div></div>';
  html += '<span class="stat-badge2">' + bestMo[1] + ' titles</span>';
  html += '</div>';

  html += '<div class="stat-card a4">';
  html += '<div class="stat-info"><div class="stat-label">' + extraLabel + '</div>';
  html += '<div class="stat-val">' + extraVal + '</div></div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function buildKpiRow(shows, movies, st, d, diff, diffPct, cy) {
  // Pre-compute all class names and values to avoid ternaries inside class=""
  const diffCardAccent = diff < 0 ? 'accent-red' : 'accent-gold';
  const diffValClass   = diff < 0 ? 'kpi-val negative' : 'kpi-val';
  const diffBadgeClass = diff < 0 ? 'badge badge-red' : 'badge badge-green';
  const diffSign       = diff >= 0 ? '+' : '';
  const diffHrs        = Math.round(diff / 60);
  const showsPct       = d.length ? (shows / d.length * 100).toFixed(0) : 0;
  const moviesPct      = d.length ? (movies / d.length * 100).toFixed(0) : 0;

  let html = '<div class="kpi-row">';

  html += '<div class="kpi-card a1">';
  html += '<div class="kpi-label">Shows This Year</div>';
  html += '<div class="kpi-val">' + shows + '</div>';
  html += '<div class="kpi-sub"><span class="badge badge-green">' + showsPct + '%</span> of total</div>';
  html += '</div>';

  html += '<div class="kpi-card a2">';
  html += '<div class="kpi-label">Movies This Year</div>';
  html += '<div class="kpi-val">' + movies + '</div>';
  html += '<div class="kpi-sub"><span class="badge badge-gold">' + moviesPct + '%</span> of total</div>';
  html += '</div>';

  html += '<div class="kpi-card a3">';
  html += '<div class="kpi-label">Screentime This Year</div>';
  html += '<div class="kpi-val">' + fmtHrs(st) + '</div>';
  html += '<div class="kpi-sub">Across ' + d.length + ' titles</div>';
  html += '</div>';

  html += '<div class="kpi-card ' + diffCardAccent + ' a4">';
  html += '<div class="kpi-label">Difference YoY</div>';
  html += '<div class="' + diffValClass + '">' + diffSign + diffHrs + ' <small>hrs</small></div>';
  html += '<div class="kpi-sub"><span class="' + diffBadgeClass + '">' + diffSign + diffPct + '%</span> vs last year</div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function buildKpiRowAllTime(d, shows, movies, st) {
  const showsPct  = d.length ? (shows / d.length * 100).toFixed(1) : 0;
  const moviesPct = d.length ? (movies / d.length * 100).toFixed(1) : 0;

  let html = '<div class="kpi-row">';

  html += '<div class="kpi-card a1">';
  html += '<div class="kpi-label">Total Titles</div>';
  html += '<div class="kpi-val">' + d.length + '</div>';
  html += '<div class="kpi-sub">' + shows + ' shows + ' + movies + ' movies</div>';
  html += '</div>';

  html += '<div class="kpi-card accent-gold a2">';
  html += '<div class="kpi-label">Screentime All Time</div>';
  html += '<div class="kpi-val">' + fmtK(Math.round(st / 60)) + '<small> hrs</small></div>';
  html += '<div class="kpi-sub">' + fmtK(Math.round(st)) + ' minutes</div>';
  html += '</div>';

  html += '<div class="kpi-card a3">';
  html += '<div class="kpi-label">Shows (All Time)</div>';
  html += '<div class="kpi-val">' + shows + '</div>';
  html += '<div class="kpi-sub"><span class="badge badge-green">' + showsPct + '%</span> of total</div>';
  html += '</div>';

  html += '<div class="kpi-card a4">';
  html += '<div class="kpi-label">Movies (All Time)</div>';
  html += '<div class="kpi-val">' + movies + '</div>';
  html += '<div class="kpi-sub"><span class="badge badge-gold">' + moviesPct + '%</span> of total</div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function buildDataTableRows(page, start) {
  let html = '';
  page.forEach(function(r, i) {
    // Pre-compute pill class to avoid ternary in class attribute
    const pillClass = r.type.toLowerCase() === 'movie' ? 'type-pill movie' : 'type-pill show';
    const emoji     = getEmoji(r.platform);
    html += '<tr>';
    html += '<td class="row-num">' + (start + i + 1) + '</td>';
    html += '<td style="font-weight:500">' + r.name + '</td>';
    html += '<td><span class="' + pillClass + '">' + r.type + '</span></td>';
    html += '<td>' + (r.genre || '—') + '</td>';
    html += '<td>' + emoji + ' ' + r.platform + '</td>';
    html += '<td style="color:var(--text-soft)">' + fmtDate(r.watchDate) + '</td>';
    html += '</tr>';
  });
  return html;
}

function buildFilterSelect(vals, currentVal, onchangeFn, allLabel) {
  let html = '<div class="df-select"><select onchange="' + onchangeFn + '">';
  vals.forEach(function(v) {
    const label    = v === 'all' ? allLabel : v;
    const selected = v === currentVal ? ' selected' : '';
    html += '<option value="' + v + '"' + selected + '>' + label + '</option>';
  });
  html += '</select></div>';
  return html;
}

function buildHeaderFilter(label, vals, onchangeFn) {
  let html = '<div class="ph-filter"><label>' + label + '&nbsp;</label>';
  html += '<select onchange="' + onchangeFn + '">';
  vals.forEach(function(v) {
    html += '<option value="' + v + '">' + v + '</option>';
  });
  html += '</select></div>';
  return html;
}
