// ================================================================
//  UNBREAKABLE UNIT CRICKET — TOURNAMENT DATA
//
//  position   : 'champion' | 'runners-up'
//  groupPhoto : hosted URL to team group photo
//
//  awards — ALL optional, only add if winner is from UU
//  just name + photo — no stats needed
// ================================================================

export const TOURNAMENTS = [
  {
    id:         'T001',
    title:      'Thaju Championship 2026',
    shortTitle: 'Thaju Cup 2026',
    position:   'champion',
    date:       '2026-09-06',
    venue:      'FRSC Indoor Stadium, Wattala',
    groupPhoto: 'assets/tournaments/thaju_cup_2026/champion_pic.jpeg',   // ← paste hosted group photo URL here

    bestBatsman: {
      name:  'Naazir',
      photo: 'assets/tournaments/thaju_cup_2026/best_batsman.jpeg',
    },
    manOfSeries: {
      name:  'Santhosh',
      photo: 'assets/tournaments/thaju_cup_2026/man_of_series.jpeg',
    },
  },
  {
    id:         'T002',
    title:      'Colombo Challengers Cup 2026',
    shortTitle: 'CCC 2026',
    position:   'runners-up',
    date:       '2026-07-28',
    venue:      'Colombo North Ground',
    groupPhoto: '',

    // Only bestBowler won from UU — other two not added
    bestBowler: {
      name:  'Chain Breaker',
      photo: 'https://i.pravatar.cc/400?img=39',
    },
  },
];
