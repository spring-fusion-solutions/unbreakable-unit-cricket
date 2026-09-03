import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { COLORS, FONTS } from '../config/theme';
import { RESULTS, getSeriesSummary, getOverallStats, getVisibleMatches } from '../config/results';
import { useReveal, fadeUp, stagger } from '../anim';
import {
  FaTrophy, FaShieldAlt, FaChevronLeft, FaChevronRight,
  FaCalendarAlt, FaMapMarkerAlt,
} from 'react-icons/fa';

// ── colour helpers ───────────────────────────────────────────────
const resultColor = (r) =>
  r === 'W' ? COLORS.gold :
  r === 'L' ? '#EF4444'   : COLORS.muted;

const barColor = (pct) =>
  pct >= 60 ? `linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight})`
: pct >= 40 ? 'linear-gradient(90deg,#F59E0B,#FCD34D)'
            : 'linear-gradient(90deg,#EF4444,#F87171)';

// ── Animated donut ───────────────────────────────────────────────
function Donut({ pct, size = 110, stroke = 9, color, label, sub }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const c = size / 2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.45rem' }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
          <motion.circle cx={c} cy={c} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease:[0.22,1,0.36,1], delay:0.3 }} />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:FONTS.display, fontSize: size>100?'1.25rem':'1rem', fontWeight:700, color, lineHeight:1 }}>{pct}%</span>
        </div>
      </div>
      <p style={{ fontFamily:FONTS.display, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.offWhiteText, textAlign:'center' }}>{label}</p>
      {sub && <p style={{ fontFamily:FONTS.body, fontSize:'0.6rem', color:COLORS.muted, textAlign:'center' }}>{sub}</p>}
    </div>
  );
}

// ── Win % bar ────────────────────────────────────────────────────
function WinBar({ pct, won, total }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.35rem' }}>
        <span style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:COLORS.offWhiteText }}>Win Rate</span>
        <span style={{ fontFamily:FONTS.display, fontSize:'0.8rem', fontWeight:700, color:COLORS.gold }}>{won}/{total} · {pct}%</span>
      </div>
      <div style={{ height:'3px', background:COLORS.border, borderRadius:'2px', overflow:'hidden' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:1.2, ease:[0.22,1,0.36,1], delay:0.5 }}
          style={{ height:'100%', borderRadius:'2px', background:barColor(pct) }} />
      </div>
    </div>
  );
}

// ── Series badge ─────────────────────────────────────────────────
function Badge({ type }) {
  const cup = type === 'cup';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'0.3rem',
      padding:'3px 10px',
      background: cup ? `${COLORS.gold}20` : `${COLORS.navyLight}80`,
      border:`1px solid ${cup ? COLORS.gold : COLORS.border}`,
      fontFamily:FONTS.accent, fontSize:'0.58rem', fontWeight:700,
      letterSpacing:'0.2em', textTransform:'uppercase',
      color: cup ? COLORS.gold : COLORS.muted,
    }}>
      {cup ? <FaTrophy size={8}/> : <FaShieldAlt size={8}/>}
      {cup ? 'Cup Match' : 'Friendly'}
    </span>
  );
}

// ── MATCH CARD (new design — large, vertical, with score bar) ────
function MatchCard({ match, opponent }) {
  const isW = match.result === 'W';
  const isL = match.result === 'L';
  const accentCol = resultColor(match.result);

  // parse scores to get run diff
  const uuRuns  = parseInt(match.uuScore)  || 0;
  const oppRuns = parseInt(match.oppScore) || 0;
  const maxRuns = Math.max(uuRuns, oppRuns, 1);
  const uuPct   = Math.round((uuRuns  / maxRuns) * 100);
  const oppPct  = Math.round((oppRuns / maxRuns) * 100);

  return (
    <div style={{
      width: '210px', flexShrink: 0,
      background: COLORS.cardBg,
      border: `1px solid ${accentCol}40`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
      boxShadow: isW ? `0 0 20px ${COLORS.gold}18` : isL ? '0 0 20px rgba(239,68,68,0.1)' : 'none',
    }}>
      {/* Top accent line */}
      <div style={{ height:'3px', background: accentCol, flexShrink:0 }} />

      {/* Result stamp */}
      <div style={{
        position:'absolute', top:'14px', right:'14px',
        width:'36px', height:'36px', borderRadius:'50%',
        background: accentCol,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 0 14px ${accentCol}60`,
      }}>
        <span style={{ fontFamily:FONTS.display, fontSize:'1rem', fontWeight:700, color: isW ? COLORS.navy : '#fff', lineHeight:1 }}>
          {match.result}
        </span>
      </div>

      {/* Match number + date */}
      <div style={{ padding:'14px 14px 10px' }}>
        <span style={{ fontFamily:FONTS.accent, fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase', color:COLORS.muted }}>
          Match {match.matchNo}
        </span>
        <p style={{ fontFamily:FONTS.body, fontSize:'0.68rem', color:COLORS.subtle, marginTop:'2px' }}>
          {match.date}
        </p>
      </div>

      {/* Score rows with bars */}
      <div style={{ padding:'0 14px 14px', flex:1, display:'flex', flexDirection:'column', gap:'10px' }}>
        {/* UU row */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
            <span style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.gold }}>UU</span>
            <span style={{ fontFamily:FONTS.body, fontSize:'0.78rem', fontWeight:600, color:COLORS.offWhiteText }}>{match.uuScore}</span>
          </div>
          <div style={{ height:'4px', background:`${COLORS.border}`, borderRadius:'2px', overflow:'hidden' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${uuPct}%` }}
              transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
              style={{ height:'100%', borderRadius:'2px', background:COLORS.gold }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <div style={{ flex:1, height:'1px', background:COLORS.border }} />
          <span style={{ fontFamily:FONTS.accent, fontSize:'0.52rem', letterSpacing:'0.12em', color:COLORS.subtle }}>VS</span>
          <div style={{ flex:1, height:'1px', background:COLORS.border }} />
        </div>

        {/* OPP row */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
            <span style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.muted }}>{opponent}</span>
            <span style={{ fontFamily:FONTS.body, fontSize:'0.78rem', color:COLORS.muted }}>{match.oppScore}</span>
          </div>
          <div style={{ height:'4px', background:`${COLORS.border}`, borderRadius:'2px', overflow:'hidden' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${oppPct}%` }}
              transition={{ duration:0.9, ease:[0.22,1,0.36,1], delay:0.08 }}
              style={{ height:'100%', borderRadius:'2px', background:'#EF4444' }} />
          </div>
        </div>
      </div>

      {/* Bottom outcome label */}
      <div style={{
        padding:'8px 14px',
        background: `${accentCol}12`,
        borderTop:`1px solid ${accentCol}30`,
        textAlign:'center',
      }}>
        <span style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:accentCol, fontWeight:700 }}>
          {isW ? '🏏 UU Won' : isL ? 'UU Lost' : 'Draw'}
        </span>
      </div>
    </div>
  );
}

// ── HORIZONTAL SLIDER ────────────────────────────────────────────
function MatchSlider({ series }) {
  const visible = getVisibleMatches(series);   // respects showNo
  const all     = series.matches;              // always full list for stats
  const total   = all.length;
  const showing = visible.length;
  const trackRef   = useRef(null);
  const [idx, setIdx] = useState(0);

  const CARD_W  = 210 + 12; // card width + gap
  const maxIdx  = Math.max(0, showing - 1);

  const slideTo = (i) => {
    const clamped = Math.max(0, Math.min(i, maxIdx));
    setIdx(clamped);
    if (trackRef.current) {
      animate(trackRef.current, { x: -(clamped * CARD_W) }, { type:'spring', stiffness:260, damping:28 });
    }
  };

  return (
    <div>
      {/* Showing note */}
      {showing < total && (
        <p style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', color:COLORS.muted, marginBottom:'0.75rem' }}>
          Showing last {showing} of {total} matches
        </p>
      )}

      {/* Slider container */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        {/* Fade edges */}
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'24px', background:`linear-gradient(to right,${COLORS.navyDeep},transparent)`, zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'24px', background:`linear-gradient(to left,${COLORS.navyDeep},transparent)`, zIndex:2, pointerEvents:'none' }} />

        {/* Track */}
        <div ref={trackRef} style={{ display:'flex', gap:'12px', willChange:'transform' }}>
          {visible.map(m => <MatchCard key={m.matchNo} match={m} opponent={series.opponentShort} />)}
        </div>
      </div>

      {/* Nav row */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'1rem' }}>
        {/* Prev */}
        <button onClick={() => slideTo(idx - 1)} disabled={idx === 0}
          style={{
            width:'32px', height:'32px', background:'none', border:`1px solid ${COLORS.border}`,
            cursor: idx===0 ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color: idx===0 ? COLORS.subtle : COLORS.gold, transition:'all .2s', flexShrink:0,
          }}
          onMouseEnter={e=>{ if(idx>0){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===0?COLORS.subtle:COLORS.gold; }}>
          <FaChevronLeft size={11}/>
        </button>

        {/* Dots */}
        <div style={{ display:'flex', gap:'5px', flex:1, justifyContent:'center', flexWrap:'wrap' }}>
          {visible.map((_, i) => (
            <button key={i} onClick={() => slideTo(i)}
              style={{
                width: i===idx ? '18px' : '7px',
                height:'7px', borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
                background: i===idx ? COLORS.gold : COLORS.border,
                transition:'all .25s',
              }} />
          ))}
        </div>

        {/* Next */}
        <button onClick={() => slideTo(idx + 1)} disabled={idx === maxIdx}
          style={{
            width:'32px', height:'32px', background:'none', border:`1px solid ${COLORS.border}`,
            cursor: idx===maxIdx ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color: idx===maxIdx ? COLORS.subtle : COLORS.gold, transition:'all .2s', flexShrink:0,
          }}
          onMouseEnter={e=>{ if(idx<maxIdx){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===maxIdx?COLORS.subtle:COLORS.gold; }}>
          <FaChevronRight size={11}/>
        </button>
      </div>
    </div>
  );
}

// ── SERIES CARD ──────────────────────────────────────────────────
function SeriesCard({ series }) {
  const [open, setOpen] = useState(false);
  const sum = getSeriesSummary(series);     // uses ALL matches
  const rc  = sum.seriesWon ? COLORS.gold : '#EF4444';

  return (
    <motion.div variants={fadeUp} style={{
      background: COLORS.cardBg,
      border:`1px solid ${sum.seriesWon ? COLORS.border : 'rgba(239,68,68,0.22)'}`,
      overflow:'hidden',
    }}>
      {/* ── Card header ── */}
      <div style={{ padding:'1.5rem', borderBottom:`1px solid ${COLORS.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>

          {/* Left */}
          <div style={{ flex:1, minWidth:'160px' }}>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.6rem', flexWrap:'wrap' }}>
              <Badge type={series.seriesType} />
              <span style={{ fontFamily:FONTS.accent, fontSize:'0.58rem', letterSpacing:'0.15em', color:COLORS.muted, textTransform:'uppercase' }}>
                {series.season}
              </span>
            </div>

            {/* preferName as headline */}
            <h3 style={{
              fontFamily:FONTS.display, fontSize:'clamp(1rem,2.5vw,1.35rem)',
              fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase',
              color:COLORS.white, marginBottom:'0.2rem',
            }}>
              {series.preferName}
            </h3>
            <p style={{ fontFamily:FONTS.body, fontSize:'0.78rem', color:COLORS.gold, marginBottom:'0.2rem' }}>
              UU vs {series.opponent}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginTop:'0.4rem' }}>
              <span style={{ fontFamily:FONTS.body, fontSize:'0.7rem', color:COLORS.muted, display:'flex', alignItems:'center', gap:'0.25rem' }}>
                <FaMapMarkerAlt size={10}/> {series.venue}
              </span>
              <span style={{ fontFamily:FONTS.body, fontSize:'0.7rem', color:COLORS.muted, display:'flex', alignItems:'center', gap:'0.25rem' }}>
                <FaCalendarAlt size={10}/> {series.startDate}
              </span>
            </div>
          </div>

          {/* Right — result */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.4rem' }}>
            <div style={{
              padding:'4px 14px',
              background:`${rc}15`, border:`1px solid ${rc}50`,
              display:'flex', alignItems:'center', gap:'0.4rem',
            }}>
              {sum.seriesWon && <FaTrophy size={10} color={COLORS.gold}/>}
              <span style={{ fontFamily:FONTS.display, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:rc }}>
                {sum.seriesWon ? 'Series Won' : 'Series Lost'}
              </span>
            </div>
            <span style={{ fontFamily:FONTS.display, fontSize:'0.68rem', color:COLORS.muted, letterSpacing:'0.08em' }}>
              {sum.won}W · {sum.lost}L{sum.draw > 0 ? ` · ${sum.draw}D` : ''}
            </span>
          </div>
        </div>

        {/* Win bar — stats from ALL matches */}
        <div style={{ marginTop:'1rem' }}>
          <WinBar pct={sum.winPct} won={sum.won} total={sum.total} />
        </div>
      </div>

      {/* ── Toggle button ── */}
      <button onClick={() => setOpen(!open)}
        style={{
          width:'100%', padding:'0.7rem 1.5rem',
          background:'none', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          fontFamily:FONTS.accent, fontSize:'0.62rem', letterSpacing:'0.2em',
          textTransform:'uppercase', color:COLORS.muted, transition:'color .2s',
        }}
        onMouseEnter={e=>e.currentTarget.style.color=COLORS.gold}
        onMouseLeave={e=>e.currentTarget.style.color=COLORS.muted}>
        <span>
          Match Slider · {series.matches.length} match{series.matches.length>1?'es':''}
          {series.matches.length > (series.showNo ?? series.matches.length)
            ? ` (showing last ${series.showNo})` : ''}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:.25 }}>
          <FaChevronRight size={10} style={{ transform:'rotate(90deg)' }}/>
        </motion.span>
      </button>

      {/* ── Slider (expandable) ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:.35, ease:[0.22,1,0.36,1] }}
            style={{ overflow:'hidden' }}>
            <div style={{ padding:'0 1.5rem 1.5rem' }}>
              <MatchSlider series={series} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── OVERALL STATS (always from ALL data) ─────────────────────────
function OverallStats({ inView }) {
  const s = getOverallStats(RESULTS); // full dataset always
  const pills = [
    { label:'Total Series',  value:RESULTS.length,     col:COLORS.offWhiteText },
    { label:'Series Won',    value:s.seriesWon,         col:COLORS.gold         },
    { label:'Series Lost',   value:s.seriesLost,        col:'#EF4444'           },
    { label:'Total Matches', value:s.totalMatches,      col:COLORS.offWhiteText },
    { label:'Matches Won',   value:s.totalWins,         col:COLORS.gold         },
    { label:'Matches Lost',  value:s.totalLosses,       col:'#EF4444'           },
  ];
  return (
    <motion.div variants={fadeUp} style={{
      background:`linear-gradient(135deg,${COLORS.cardBg},${COLORS.navyMid})`,
      border:`1px solid ${COLORS.border}`, padding:'clamp(1.5rem,4vw,2.5rem)', marginBottom:'3rem',
    }}>
      {/* Donuts */}
      <div style={{
        display:'flex', flexWrap:'wrap', gap:'2.5rem',
        justifyContent:'center', alignItems:'center',
        paddingBottom:'2rem', borderBottom:`1px solid ${COLORS.border}`, marginBottom:'2rem',
      }}>
        <Donut pct={s.seriesWinPct} size={110} stroke={9}
          color={s.seriesWinPct>=50 ? COLORS.gold : '#EF4444'}
          label="Series Win%" sub={`${s.seriesWon} of ${RESULTS.length} series`} />
        <Donut pct={s.matchWinPct} size={110} stroke={9}
          color={s.matchWinPct>=50 ? COLORS.gold : '#EF4444'}
          label="Match Win%" sub={`${s.totalWins} of ${s.totalMatches} matches`} />
      </div>
      {/* Pills */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:'1px', background:COLORS.border }}>
        {pills.map(({ label, value, col }) => (
          <div key={label} style={{ background:COLORS.cardBg, padding:'1.25rem 0.5rem', textAlign:'center' }}>
            <div style={{ fontFamily:FONTS.display, fontSize:'clamp(1.5rem,4vw,2.2rem)', fontWeight:700, color:col, lineHeight:1, marginBottom:'0.3rem' }}>
              {value}
            </div>
            <div style={{ fontFamily:FONTS.accent, fontSize:'0.56rem', letterSpacing:'0.15em', textTransform:'uppercase', color:COLORS.muted }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Filter tabs ──────────────────────────────────────────────────
function Tabs({ active, onChange }) {
  const tabs = [
    { key:'all',       label:'All Series'   },
    { key:'cup',       label:'Cup Matches'  },
    { key:'friendly',  label:'Friendly'     },
  ];
  return (
    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          style={{
            fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.18em',
            textTransform:'uppercase', padding:'8px 20px', fontWeight:700,
            background: active===t.key ? COLORS.gold : 'transparent',
            color:      active===t.key ? COLORS.navy  : COLORS.muted,
            border:`1px solid ${active===t.key ? COLORS.gold : COLORS.border}`,
            cursor:'pointer', transition:'all .22s',
          }}
          onMouseEnter={e=>{ if(active!==t.key){ e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.color=COLORS.offWhiteText; }}}
          onMouseLeave={e=>{ if(active!==t.key){ e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.muted; }}}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── MAIN SECTION ─────────────────────────────────────────────────
export default function MatchResults() {
  const { ref, inView } = useReveal(0.08);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? RESULTS : RESULTS.filter(s => s.seriesType === filter);

  return (
    <section id="results" ref={ref} style={{
      background:`linear-gradient(180deg,${COLORS.navyDeep} 0%,${COLORS.navy} 100%)`,
      padding:'8rem clamp(1rem,4vw,3rem)', position:'relative', overflow:'hidden',
    }}>
      {/* bg grid */}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.025,pointerEvents:'none' }}>
        <defs><pattern id="rg" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="48" stroke={COLORS.gold} strokeWidth="1"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#rg)"/>
      </svg>
      {/* gold top bar */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:'3px', background:`linear-gradient(90deg,transparent,${COLORS.gold},${COLORS.goldLight},${COLORS.gold},transparent)` }} />

      <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative' }}>

        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ textAlign:'center', marginBottom:'0.75rem' }}>On the Field</motion.p>

        <motion.h2 variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ fontFamily:FONTS.display, fontSize:'clamp(2rem,5vw,4.5rem)', textAlign:'center',
            textTransform:'uppercase', letterSpacing:'0.05em', color:COLORS.white,
            fontWeight:700, marginBottom:'0.75rem' }}>
          Match <span style={{ color:COLORS.gold }}>Results</span>
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ fontFamily:FONTS.body, color:COLORS.muted, textAlign:'center',
            maxWidth:'500px', margin:'0 auto 3.5rem', fontSize:'1rem', lineHeight:1.7 }}>
          Every series. Every match. Win % and stats always calculated from the full record.
        </motion.p>

        {/* Overall stats — always full data */}
        <OverallStats inView={inView} />

        {/* Legend */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {[{col:COLORS.gold,label:'Win (W)'},{col:'#EF4444',label:'Loss (L)'},{col:COLORS.muted,label:'Draw (D)'}].map(({col,label})=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <div style={{ width:'10px',height:'10px',background:col,borderRadius:'2px' }}/>
              <span style={{ fontFamily:FONTS.accent,fontSize:'0.62rem',letterSpacing:'0.15em',textTransform:'uppercase',color:COLORS.muted }}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}>
          <Tabs active={filter} onChange={setFilter} />
        </motion.div>

        {/* Series cards */}
        <motion.div variants={stagger} initial="hidden" animate={inView?'show':'hidden'}
          style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{ padding:'4rem', textAlign:'center', border:`1px solid ${COLORS.border}`, background:COLORS.cardBg }}>
                <p style={{ fontFamily:FONTS.display, fontSize:'1rem', letterSpacing:'0.1em', color:COLORS.muted, textTransform:'uppercase' }}>
                  No results found
                </p>
              </motion.div>
            ) : filtered.map((s,i)=>(
              <motion.div key={s.id}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:.35,delay:i*.08}}>
                <SeriesCard series={s} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.p variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.18em',
            color:COLORS.subtle, textAlign:'center', marginTop:'2.5rem', textTransform:'uppercase' }}>
          Stats always calculated from full match record · Slider shows last {Math.max(...RESULTS.map(r=>r.showNo??r.matches.length))} matches
        </motion.p>
      </div>
    </section>
  );
}
