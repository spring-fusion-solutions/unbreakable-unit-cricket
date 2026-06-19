export const COLORS = {
  navy:        '#0B1E36',
  navyDeep:    '#060F1C',
  navyMid:     '#0F2744',
  navyLight:   '#163456',
  slate:       '#2C3E50',
  slateLight:  '#354B61',
  offWhite:    '#F4F6F9',
  cardBg:      '#0E1F33',
  gold:        '#D4AF37',
  goldLight:   '#F0CC55',
  goldDark:    '#A8861F',
  goldGlow:    'rgba(212,175,55,0.35)',
  white:       '#FFFFFF',
  offWhiteText:'#E2E8F0',
  muted:       '#7B92B2',
  subtle:      '#2D4A6A',
  border:      'rgba(212,175,55,0.2)',
  borderStrong:'rgba(212,175,55,0.6)',
  overlay:     'rgba(6,15,28,0.85)',
};

export const FONTS = {
  display: "'Teko', 'Barlow Condensed', sans-serif",
  heading: "'Barlow Condensed', sans-serif",
  body:    "'Barlow', sans-serif",
  accent:  "'Barlow Condensed', sans-serif",
};

export const FONT_SIZES = {
  hero:  'clamp(4rem, 10vw, 9rem)',
  h1:    'clamp(2.5rem, 6vw, 5rem)',
  h2:    'clamp(1.8rem, 3.5vw, 3rem)',
  h3:    'clamp(1.2rem, 2vw, 1.7rem)',
  body:  '1.05rem',
  small: '0.875rem',
  label: '0.7rem',
};

export const ASSETS = {
  logo: '/assets/logo.png',
  squad: [
    { id: 1,  name: 'Super Phoenix',  role: 'Captain / Owner',    number: '01', speciality: 'All-Rounder',  image: 'https://i.pravatar.cc/400?img=33' },
    { id: 2,  name: 'Striker Alpha',  role: 'Opening Batsman',    number: '07', speciality: 'Power Hitter', image: 'https://i.pravatar.cc/400?img=34' },
    { id: 3,  name: 'Thunder Bolt',   role: 'Fast Bowler',        number: '09', speciality: 'Pace Attack',  image: 'https://i.pravatar.cc/400?img=35' },
    { id: 4,  name: 'Iron Wall',      role: 'Wicket Keeper',      number: '04', speciality: 'Guardian',     image: 'https://i.pravatar.cc/400?img=36' },
    { id: 5,  name: 'Spin Master',    role: 'Leg Spinner',        number: '17', speciality: 'Spin Attack',  image: 'https://i.pravatar.cc/400?img=37' },
    { id: 6,  name: 'Anchor Unit',    role: 'Middle Order',       number: '06', speciality: 'Stabiliser',   image: 'https://i.pravatar.cc/400?img=38' },
    { id: 7,  name: 'Chain Breaker',  role: 'Opening Bowler',     number: '11', speciality: 'Swing Wizard', image: 'https://i.pravatar.cc/400?img=39' },
    { id: 8,  name: 'Gold Rush',      role: 'Pinch Hitter',       number: '24', speciality: 'Finisher',     image: 'https://i.pravatar.cc/400?img=40' },
    { id: 9,  name: 'Shield Bearer',  role: 'Middle Order',       number: '03', speciality: 'Defender',     image: 'https://i.pravatar.cc/400?img=41' },
    { id: 10, name: 'Storm Rider',    role: 'All-Rounder',        number: '21', speciality: 'Versatile',    image: 'https://i.pravatar.cc/400?img=42' },
    { id: 11, name: 'Last Stand',     role: 'Tail Ender',         number: '33', speciality: 'Resilient',    image: 'https://i.pravatar.cc/400?img=43' },
  ],
};

export const SOCIAL = {
  facebook:  'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok:    'https://tiktok.com',
  whatsapp:  'https://wa.me/94XXXXXXXXX',
};

export const NAV_ITEMS = [
  { label: 'Home',    href: '#hero'    },
  { label: 'About',   href: '#about'   },
  { label: 'Mission', href: '#mission' },
  { label: 'Squad',   href: '#squad'   },
  { label: 'Contact', href: '#contact' },
];

export const TEAM = {
  name:    'Unbreakable Unit',
  cricket: 'Cricket',
  slogan:  'Forged in Unity. Built to Last.',
  owner:   'Super Phoenix',
  founded: '2024',
  location:'Sri Lanka',
};
