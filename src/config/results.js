// ================================================================
//  UNBREAKABLE UNIT CRICKET — MATCH RESULTS DATA
//  ── seriesType : 'friendly' | 'cup'
//  ── showNo     : how many RECENT matches to show in the slider
//                  (stats/win% always calculated from ALL matches)
//  ── preferName : friendly display name for the series
//  ── All 5 matches in one day = same date, different matchNo
// ================================================================

export const RESULTS = [
  {
    id:           'S001',
    seriesType:   'cup',
    preferName:   'WSK Cup Challenge',       // ← custom display name
    showNo:       10,                        // show last N matches in slider
    opponent:     'WSK Cricket',
    opponentShort:'WSK',
    season:       '2026',
    startDate:    '2026-09-03',
    endDate:      '2026-09-03',              // same day — 5 matches in one day
    venue:        'Wattala Ground',
    matches: [
      { matchNo:1, date:'2026-09-03', result:'W', uuScore:'142/6',  oppScore:'138/9'  },
      { matchNo:2, date:'2026-09-03', result:'L', uuScore:'98/10',  oppScore:'101/4'  },
      { matchNo:3, date:'2026-09-03', result:'W', uuScore:'165/7',  oppScore:'160/8'  },
      { matchNo:4, date:'2026-09-03', result:'W', uuScore:'110/5',  oppScore:'105/10' },
      { matchNo:5, date:'2026-09-03', result:'L', uuScore:'88/10',  oppScore:'92/6'   },
    ],
  },
  {
    id:           'S002',
    seriesType:   'friendly',
    preferName:   'Boralesgamuwa Friendly',
    showNo:       10,
    opponent:     'Marrow CC',
    opponentShort:'MCC',
    season:       '2026',
    startDate:    '2026-08-10',
    endDate:      '2026-08-10',
    venue:        'Boralesgamuwa',
    matches: [
      { matchNo:1, date:'2026-08-10', result:'W', uuScore:'155/4',  oppScore:'140/8'  },
      { matchNo:2, date:'2026-08-10', result:'W', uuScore:'178/6',  oppScore:'170/7'  },
      { matchNo:3, date:'2026-08-10', result:'L', uuScore:'90/10',  oppScore:'95/5'   },
    ],
  },
  {
    id:           'S003',
    seriesType:   'cup',
    preferName:   'Colombo North Cup',
    showNo:       10,
    opponent:     'Rosvilla CC',
    opponentShort:'RCC',
    season:       '2026',
    startDate:    '2026-07-20',
    endDate:      '2026-07-20',
    venue:        'Colombo North',
    matches: [
      { matchNo:1, date:'2026-07-20', result:'L', uuScore:'112/9',  oppScore:'115/6'  },
      { matchNo:2, date:'2026-07-20', result:'W', uuScore:'140/5',  oppScore:'135/8'  },
      { matchNo:3, date:'2026-07-20', result:'W', uuScore:'160/4',  oppScore:'150/9'  },
      { matchNo:4, date:'2026-07-20', result:'W', uuScore:'130/6',  oppScore:'125/10' },
      { matchNo:5, date:'2026-07-20', result:'L', uuScore:'75/10',  oppScore:'80/4'   },
    ],
  },
];

// ── Series summary — always from ALL matches (for win %) ─────────
export function getSeriesSummary(series) {
  const won   = series.matches.filter(m => m.result === 'W').length;
  const lost  = series.matches.filter(m => m.result === 'L').length;
  const draw  = series.matches.filter(m => m.result === 'D').length;
  const total = series.matches.length;
  const winPct    = total > 0 ? Math.round((won / total) * 100) : 0;
  const seriesWon = won > lost;
  return { won, lost, draw, total, winPct, seriesWon };
}

// ── Overall stats — always across ALL series/matches ─────────────
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
  const matchWinPct  = totalMatches > 0 ? Math.round((totalWins  / totalMatches)  * 100) : 0;
  const seriesWinPct = results.length  > 0 ? Math.round((seriesWon / results.length) * 100) : 0;
  return { totalMatches, totalWins, totalLosses, totalDraws, seriesWon, seriesLost, matchWinPct, seriesWinPct };
}

// ── Get visible matches for slider (last showNo, stats still all) ─
export function getVisibleMatches(series) {
  const n = series.showNo ?? series.matches.length;
  // take the last N matches (most recent = highest matchNo)
  return series.matches.slice(-n);
}
