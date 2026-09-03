import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../config/theme';
import { RESULTS, getSeriesSummary, getOverallStats } from '../config/results';
import { useReveal, fadeUp, stagger } from '../anim';
import { FaTrophy, FaShieldAlt, FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';

// ── Animated radial donut chart ─────────────────────────────────
function DonutChart({ pct, size = 80, stroke = 7, color, label, sublabel }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const cx = size / 2, cy = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={`${COLORS.border}`} strokeWidth={stroke} />
          {/* Progress */}
          <motion.circle cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontFamily: FONTS.display, fontSize: size > 90 ? '1.3rem' : '1rem', fontWeight: 700, color, lineHeight: 1 }}>
            {pct}%
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.display, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.offWhiteText }}>{label}</p>
        {sublabel && <p style={{ fontFamily: FONTS.body, fontSize: '0.62rem', color: COLORS.muted }}>{sublabel}</p>}
      </div>
    </div>
  );
}

// ── Win percentage bar ──────────────────────────────────────────
function WinBar({ pct, won, total, inView }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontFamily: FONTS.accent, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.offWhiteText }}>
          Win Rate
        </span>
        <span style={{ fontFamily: FONTS.display, fontSize: '0.85rem', fontWeight: 700, color: COLORS.gold }}>
          {won}/{total} · {pct}%
        </span>
      </div>
      <div style={{ height: '4px', background: `${COLORS.border}`, borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{
            height: '100%', borderRadius: '2px',
            background: pct >= 60
              ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`
              : pct >= 40
                ? `linear-gradient(90deg, #F59E0B, #FCD34D)`
                : `linear-gradient(90deg, #EF4444, #F87171)`,
          }}
        />
      </div>
    </div>
  );
}

// ── Series type badge ───────────────────────────────────────────
function SeriesBadge({ type }) {
  const isCup = type === 'cup';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '3px 10px',
      background: isCup ? `${COLORS.gold}22` : `${COLORS.navyLight}`,
      border: `1px solid ${isCup ? COLORS.gold : COLORS.border}`,
      fontFamily: FONTS.accent, fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: isCup ? COLORS.gold : COLORS.muted,
    }}>
      {isCup ? <FaTrophy size={9} /> : <FaShieldAlt size={9} />}
      {isCup ? 'Cup Match' : 'Friendly'}
    </span>
  );
}

// ── Single match result pill ────────────────────────────────────
function MatchPill({ match }) {
  const isW = match.result === 'W';
  const isL = match.result === 'L';
  const color = isW ? COLORS.gold : isL ? '#EF4444' : COLORS.muted;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      style={{
        padding: '0.85rem 1rem',
        background: `${color}10`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.75rem', cursor: 'default',
        transition: 'all 0.2s',
      }}>
      {/* Match number */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.2em', color: COLORS.muted, textTransform: 'uppercase' }}>Match</p>
        <p style={{ fontFamily: FONTS.display, fontSize: '1rem', fontWeight: 700, color: COLORS.offWhiteText, lineHeight: 1 }}>{match.matchNo}</p>
      </div>

      {/* Date */}
      <div style={{ flexShrink: 0, display: 'none' }} className="match-date">
        <p style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.muted }}>{match.date}</p>
      </div>

      {/* Scores */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.12em', color: COLORS.gold, textTransform: 'uppercase', width: '18px' }}>UU</span>
          <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 600, color: COLORS.offWhiteText }}>{match.uuScore}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.12em', color: COLORS.muted, textTransform: 'uppercase', width: '18px' }}>OPP</span>
          <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.muted }}>{match.oppScore}</span>
        </div>
      </div>

      {/* Result badge */}
      <div style={{
        width: '32px', height: '32px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: color, borderRadius: '2px',
      }}>
        <span style={{ fontFamily: FONTS.display, fontSize: '0.9rem', fontWeight: 700, color: isW ? COLORS.navy : COLORS.white, lineHeight: 1 }}>
          {match.result}
        </span>
      </div>
    </motion.div>
  );
}

// ── Series card ─────────────────────────────────────────────────
function SeriesCard({ series, index, inView }) {
  const [expanded, setExpanded] = useState(false);
  const sum = getSeriesSummary(series);
  const resultColor = sum.seriesWon ? COLORS.gold : '#EF4444';

  return (
    <motion.div variants={fadeUp}
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${sum.seriesWon ? COLORS.border : 'rgba(239,68,68,0.2)'}`,
        overflow: 'hidden',
      }}>

      {/* Card header */}
      <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>

          {/* Left — series info */}
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <SeriesBadge type={series.seriesType} />
              <span style={{ fontFamily: FONTS.accent, fontSize: '0.6rem', letterSpacing: '0.15em', color: COLORS.muted, textTransform: 'uppercase' }}>
                {series.season}
              </span>
            </div>
            <h3 style={{
              fontFamily: FONTS.display, fontSize: 'clamp(1.1rem,2.5vw,1.4rem)',
              fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: COLORS.white, marginBottom: '0.25rem',
            }}>
              UU vs {series.opponent}
            </h3>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.muted }}>
              {series.venue} · {series.startDate}
              {series.endDate !== series.startDate ? ` – ${series.endDate}` : ''}
            </p>
          </div>

          {/* Right — series result */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{
              padding: '4px 14px',
              background: `${resultColor}18`,
              border: `1px solid ${resultColor}50`,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              {sum.seriesWon ? <FaTrophy size={11} color={COLORS.gold} /> : null}
              <span style={{
                fontFamily: FONTS.display, fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: resultColor,
              }}>
                {sum.seriesWon ? 'Series Won' : 'Series Lost'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span style={{ fontFamily: FONTS.display, fontSize: '0.72rem', color: COLORS.muted, letterSpacing: '0.08em' }}>
                {sum.won}W · {sum.lost}L{sum.draw > 0 ? ` · ${sum.draw}D` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Win bar */}
        <div style={{ marginTop: '1rem' }}>
          <WinBar pct={sum.winPct} won={sum.won} total={sum.total} inView={inView} />
        </div>
      </div>

      {/* Match-by-match toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '0.75rem 1.5rem',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: FONTS.accent, fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: COLORS.muted,
          transition: 'color 0.2s',
          borderTop: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
        onMouseLeave={e => e.currentTarget.style.color = COLORS.muted}>
        <span>Match by Match · {series.matches.length} matches</span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <FaChevronDown size={11} />
        </motion.span>
      </button>

      {/* Expandable match grid */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '0 1.5rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.6rem',
            }}>
              {series.matches.map(m => <MatchPill key={m.matchNo} match={m} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Overall stats banner ────────────────────────────────────────
function OverallStats({ inView }) {
  const stats = getOverallStats(RESULTS);

  const statItems = [
    { label: 'Total Series',   value: RESULTS.length,        color: COLORS.gold      },
    { label: 'Series Won',     value: stats.seriesWon,       color: COLORS.gold      },
    { label: 'Total Matches',  value: stats.totalMatches,    color: COLORS.offWhiteText },
    { label: 'Matches Won',    value: stats.totalWins,       color: COLORS.gold      },
    { label: 'Matches Lost',   value: stats.totalLosses,     color: '#EF4444'        },
  ];

  return (
    <motion.div variants={fadeUp}
      style={{
        background: `linear-gradient(135deg, ${COLORS.cardBg}, ${COLORS.navyMid})`,
        border: `1px solid ${COLORS.border}`,
        padding: 'clamp(1.5rem,4vw,2.5rem)',
        marginBottom: '3rem',
      }}>
      {/* Top row — donuts */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '2.5rem',
        justifyContent: 'center', alignItems: 'center',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${COLORS.border}`,
        marginBottom: '2rem',
      }}>
        <DonutChart pct={stats.seriesWinPct} size={110} stroke={9}
          color={stats.seriesWinPct >= 50 ? COLORS.gold : '#EF4444'}
          label="Series Win%" sublabel={`${stats.seriesWon} of ${RESULTS.length} series`} />

        <DonutChart pct={stats.matchWinPct} size={110} stroke={9}
          color={stats.matchWinPct >= 50 ? COLORS.gold : '#EF4444'}
          label="Match Win%" sublabel={`${stats.totalWins} of ${stats.totalMatches} matches`} />
      </div>

      {/* Bottom row — stat pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))',
        gap: '1px',
        background: COLORS.border,
      }}>
        {statItems.map(({ label, value, color }) => (
          <div key={label} style={{
            background: COLORS.cardBg, padding: '1.25rem 0.75rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, color, lineHeight: 1, marginBottom: '0.3rem' }}>
              {value}
            </div>
            <div style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Filter tabs ─────────────────────────────────────────────────
function FilterTabs({ active, onChange }) {
  const tabs = [
    { key: 'all',      label: 'All Series' },
    { key: 'cup',      label: 'Cup Matches' },
    { key: 'friendly', label: 'Friendly'    },
  ];
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          style={{
            fontFamily: FONTS.accent, fontSize: '0.68rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', padding: '8px 20px',
            background: active === t.key ? COLORS.gold : 'transparent',
            color: active === t.key ? COLORS.navy : COLORS.muted,
            border: `1px solid ${active === t.key ? COLORS.gold : COLORS.border}`,
            cursor: 'pointer', fontWeight: 700, transition: 'all 0.22s',
          }}
          onMouseEnter={e => { if (active !== t.key) { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.offWhiteText; } }}
          onMouseLeave={e => { if (active !== t.key) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; } }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Main section ────────────────────────────────────────────────
export default function MatchResults() {
  const { ref, inView } = useReveal(0.08);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? RESULTS
    : RESULTS.filter(s => s.seriesType === filter);

  return (
    <section id="results" ref={ref} style={{
      background: `linear-gradient(180deg, ${COLORS.navyDeep} 0%, ${COLORS.navy} 100%)`,
      padding: '8rem clamp(1rem,4vw,3rem)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Diagonal grid bg */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025, pointerEvents: 'none' }}>
        <defs>
          <pattern id="rg" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="48" stroke={COLORS.gold} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rg)" />
      </svg>

      {/* Gold top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold}, transparent)`,
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>

        {/* Heading */}
        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          On the Field
        </motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{
            fontFamily: FONTS.display, fontSize: 'clamp(2rem,5vw,4.5rem)',
            textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em',
            color: COLORS.white, fontWeight: 700, marginBottom: '0.75rem',
          }}>
          Match <span style={{ color: COLORS.gold }}>Results</span>
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{
            fontFamily: FONTS.body, color: COLORS.muted, textAlign: 'center',
            maxWidth: '500px', margin: '0 auto 3.5rem', fontSize: '1rem', lineHeight: 1.7,
          }}>
          Every match. Every series. Full match-by-match breakdown with win percentages.
        </motion.p>

        {/* Overall stats */}
        <OverallStats inView={inView} />

        {/* Legend */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { color: COLORS.gold, label: 'Win (W)' },
            { color: '#EF4444',   label: 'Loss (L)' },
            { color: COLORS.muted,label: 'Draw (D)' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', background: color, borderRadius: '2px' }} />
              <span style={{ fontFamily: FONTS.accent, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <FilterTabs active={filter} onChange={setFilter} />
        </motion.div>

        {/* Series cards */}
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  padding: '4rem', textAlign: 'center',
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.cardBg,
                }}>
                <GiCricketBat size={32} color={COLORS.muted} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: FONTS.display, fontSize: '1rem', letterSpacing: '0.1em', color: COLORS.muted, textTransform: 'uppercase' }}>
                  No results found
                </p>
              </motion.div>
            ) : (
              filtered.map((series, i) => (
                <motion.div key={series.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}>
                  <SeriesCard series={series} index={i} inView={inView} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom note */}
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{
            fontFamily: FONTS.accent, fontSize: '0.62rem', letterSpacing: '0.18em',
            color: COLORS.subtle, textAlign: 'center', marginTop: '2.5rem', textTransform: 'uppercase',
          }}>
          Results updated after each match · All times local
        </motion.p>
      </div>
    </section>
  );
}
