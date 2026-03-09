// ── CHARTS ────────────────────────────────────────────────────────────────

function initLineChart(canvasId, labels, data) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  if (charts[canvasId]) {
    try { charts[canvasId].destroy(); } catch (e) {}
  }
  charts[canvasId] = new Chart(el, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data:                 data,
        fill:                 true,
        tension:              .4,
        borderColor:          '#2d6a4f',
        borderWidth:          2.5,
        pointRadius:          5,
        pointBackgroundColor: '#fff',
        pointBorderColor:     '#2d6a4f',
        pointBorderWidth:     2.5,
        backgroundColor: function(ctx) {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          g.addColorStop(0, 'rgba(45,106,79,0.18)');
          g.addColorStop(1, 'rgba(45,106,79,0)');
          return g;
        }
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d1f16',
          titleColor:      '#fff',
          bodyColor:       'rgba(255,255,255,.7)',
          padding:         10,
          cornerRadius:    8,
          displayColors:   false,
          callbacks: {
            label: function(ctx) {
              return ctx.raw + ' title' + (ctx.raw !== 1 ? 's' : '');
            }
          }
        }
      },
      scales: {
        x: {
          grid:  { display: false },
          ticks: { font: { family: 'DM Sans', size: 11 }, color: '#7a9e8a' }
        },
        y: {
          grid:        { color: '#e0ede6', lineWidth: .8 },
          ticks:       { font: { family: 'DM Sans', size: 11 }, color: '#7a9e8a' },
          beginAtZero: true
        }
      }
    }
  });
}
