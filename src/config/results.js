// ================================================================
//  UNBREAKABLE UNIT CRICKET — MATCH RESULTS DATA
//  Add new series here. The UI updates automatically.
//  seriesType: 'friendly' | 'cup'
// ================================================================

export const RESULTS = [
  {
    id: 'S001',
    seriesType: 'cup',                      // 'friendly' | 'cup'
    opponent: 'WSK Cricket',
    opponentShort: 'WSK',
    season: '2026',
    startDate: '2026-09-03',
    endDate: '2026-09-07',
    venue: 'Wattala Ground',
    matches: [
      { matchNo: 1, date: '2026-09-03', result: 'W', uuScore: '142/6', oppScore: '138/9' },
      { matchNo: 2, date: '2026-09-04', result: 'L', uuScore: '98/10', oppScore: '101/4' },
      { matchNo: 3, date: '2026-09-05', result: 'W', uuScore: '165/7', oppScore: '160/8' },
      { matchNo: 4, date: '2026-09-06', result: 'W', uuScore: '110/5', oppScore: '105/10' },
      { matchNo: 5, date: '2026-09-07', result: 'L', uuScore: '88/10', oppScore: '92/6' },
    ],
  },
  {
    id: 'S002',
    seriesType: 'friendly',
    opponent: 'Marrow CC',
    opponentShort: 'MCC',
    season: '2026',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    venue: 'Boralesgamuwa',
    matches: [
      { matchNo: 1, date: '2026-08-10', result: 'W', uuScore: '155/4', oppScore: '140/8' },
      { matchNo: 2, date: '2026-08-11', result: 'W', uuScore: '178/6', oppScore: '170/7' },
      { matchNo: 3, date: '2026-08-12', result: 'L', uuScore: '90/10', oppScore: '95/5' },
    ],
  },
  {
    id: 'S003',
    seriesType: 'cup',
    opponent: 'Rosvilla CC',
    opponentShort: 'RCC',
    season: '2026',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    venue: 'Colombo North',
    matches: [
      { matchNo: 1, date: '2026-07-20', result: 'L', uuScore: '112/9', oppScore: '115/6' },
      { matchNo: 2, date: '2026-07-21', result: 'W', uuScore: '140/5', oppScore: '135/8' },
      { matchNo: 3, date: '2026-07-22', result: 'W', uuScore: '160/4', oppScore: '150/9' },
      { matchNo: 4, date: '2026-07-23', result: 'W', uuScore: '130/6', oppScore: '125/10' },
      { matchNo: 5, date: '2026-07-24', result: 'L', uuScore: '75/10', oppScore: '80/4' },
    ],
  },
];

// ── Helper: compute series summary from matches ──────────────────
export function getSeriesSummary(series) {
  const won  = series.matches.filter(m => m.result === 'W').length;
  const lost = series.matches.filter(m => m.result === 'L').length;
  const draw = series.matches.filter(m => m.result === 'D').length;
  const total = series.matches.length;
  const winPct = total > 0 ? Math.round((won / total) * 100) : 0;
  const seriesWon = won > lost; // simple majority wins series
  return { won, lost, draw, total, winPct, seriesWon };
}

// ── Helper: overall stats across all series ──────────────────────
export function getOverallStats(results) {
  let totalMatches = 0, totalWins = 0, totalLosses = 0, totalDraws = 0;
  let seriesWon = 0, seriesLost = 0;

  results.forEach(s => {
    const sum = getSeriesSummary(s);
    totalMatches += sum.total;
    totalWins    += sum.won;
    totalLosses  += sum.lost;
    totalDraws   += sum.draw;
    if (sum.seriesWon) seriesWon++; else seriesLost++;
  });

  const matchWinPct   = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
  const seriesWinPct  = results.length  > 0 ? Math.round((seriesWon / results.length) * 100) : 0;
  return { totalMatches, totalWins, totalLosses, totalDraws, seriesWon, seriesLost, matchWinPct, seriesWinPct };
}
