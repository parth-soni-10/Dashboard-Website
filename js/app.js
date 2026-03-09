// ── ROUTER ────────────────────────────────────────────────────────────────
function navigateTo(page) {
  destroyCharts();
  currentPage = page;
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === page);
  });
  document.getElementById('app').innerHTML = '';

  const pages = {
    readme:      renderReadme,
    current:     renderCurrentYear,
    alltime:     renderAllTime,
    data:        renderData,
    suggestions: renderSuggestions
  };

  const render = pages[page] || renderReadme;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── INIT ──────────────────────────────────────────────────────────────────
loadData();
