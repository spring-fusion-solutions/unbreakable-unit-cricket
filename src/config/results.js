// ================================================================
//  UNBREAKABLE UNIT CRICKET — MATCH RESULTS DATA
//
//  showNo  →  how many SERIES CARDS show in the slider
//             (hardcoded here — change ONE number to update everywhere)
//             Win % / total stats always use ALL series regardless
//
//  seriesType → 'friendly' | 'cup'
//  preferName → display title on the card
//  matches    → just matchNo, date, result (W/L/D) — no scores needed
// ================================================================

export const SETTINGS = {
  showNo: 10,   // ← slider shows last N series; stats always = ALL
};

export const RESULTS = [
  {
    id:           'S001',
    seriesType:   'cup',
    preferName:   'WSK Cup Challenge',
    opponent:     'WSK Cricket',
    opponentShort:'WSK',
    season:       '2026',
    date:         '2026-09-03',
    venue:        'Wattala Ground',
    matches: [
      { matchNo:1, matchTitle:"Match 1", result:'W' },
      { matchNo:2, matchTitle:"Match 2", result:'L' },
      { matchNo:3, matchTitle:"Match 3", result:'W' },
      { matchNo:4, matchTitle:"Match 4", result:'W' },
      { matchNo:5, matchTitle:"Match 5", result:'L' },
    ],
  },
  {
    id:           'S002',
    seriesType:   'friendly',
    preferName:   'Boralesgamuwa Friendly',
    opponent:     'Marrow CC',
    opponentShort:'MCC',
    season:       '2026',
    date:         '2026-08-10',
    venue:        'Boralesgamuwa',
    matches: [
      { matchNo:1, matchTitle:"Match 1", result:'W' },
      { matchNo:2, matchTitle:"Match 2", result:'W' },
      { matchNo:3, matchTitle:"Match 3", result:'L' },
    ],
  },
  {
    id:           'S003',
    seriesType:   'cup',
    preferName:   'Colombo North Cup',
    opponent:     'Rosvilla CC',
    opponentShort:'RCC',
    season:       '2026',
    date:         '2026-07-20',
    venue:        'Colombo North',
    matches: [
      { matchNo:1, matchTitle:"Match 1", result:'L' },
      { matchNo:2, matchTitle:"Match 2", result:'W' },
      { matchNo:3, matchTitle:"Match 3", result:'W' },
      { matchNo:4, matchTitle:"Match 4", result:'W' },
      { matchNo:5, matchTitle:"Match 5", result:'L' },
    ],
  },
];

// ── Series summary ───────────────────────────────────────────────
export function getSeriesSummary(series) {
  const won   = series.matches.filter(m => m.result === 'W').length;
  const lost  = series.matches.filter(m => m.result === 'L').length;
  const draw  = series.matches.filter(m => m.result === 'D').length;
  const total = series.matches.length;
  const winPct    = total > 0 ? Math.round((won / total) * 100) : 0;
  const seriesWon = won > lost;
  return { won, lost, draw, total, winPct, seriesWon };
}

// ── Overall stats — ALWAYS full RESULTS array ────────────────────
export function getOverallStats(results) {
  let totalMatches=0, totalWins=0, totalLosses=0, totalDraws=0;
  let seriesWon=0, seriesLost=0;
  results.forEach(s => {
    const sum = getSeriesSummary(s);
    totalMatches += sum.total;
    totalWins    += sum.won;
    totalLosses  += sum.lost;
    totalDraws   += sum.draw;
    sum.seriesWon ? seriesWon++ : seriesLost++;
  });
  const matchWinPct  = totalMatches > 0 ? Math.round((totalWins  / totalMatches)  * 100) : 0;
  const seriesWinPct = results.length  > 0 ? Math.round((seriesWon / results.length) * 100) : 0;
  return { totalMatches, totalWins, totalLosses, totalDraws, seriesWon, seriesLost, matchWinPct, seriesWinPct };
}

// ── Slider uses last showNo series only ──────────────────────────
export function getVisibleSeries() {
  return RESULTS.slice(-SETTINGS.showNo);
}
