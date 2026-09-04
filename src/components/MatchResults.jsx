import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { COLORS, FONTS } from '../config/theme';
import { RESULTS, SETTINGS, getSeriesSummary, getOverallStats, getVisibleSeries } from '../config/results';
import { useReveal, fadeUp, stagger } from '../anim';
import { FaTrophy, FaShieldAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// ── helpers ──────────────────────────────────────────────────────
const rCol = r => r==='W' ? COLORS.gold : r==='L' ? '#EF4444' : COLORS.muted;
const barGrad = p =>
  p>=60 ? `linear-gradient(90deg,${COLORS.gold},${COLORS.goldLight})`
: p>=40 ? 'linear-gradient(90deg,#F59E0B,#FCD34D)'
        : 'linear-gradient(90deg,#EF4444,#F87171)';

// ── Donut chart ──────────────────────────────────────────────────
function Donut({ pct, size=110, stroke=9, color, label, sub }) {
  const r    = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct/100)*circ;
  const c    = size/2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.45rem' }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke}/>
          <motion.circle cx={c} cy={c} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset:circ }}
            animate={{ strokeDashoffset:off }}
            transition={{ duration:1.4, ease:[0.22,1,0.36,1], delay:0.3 }}/>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:FONTS.display, fontSize:'1.2rem', fontWeight:700, color, lineHeight:1 }}>{pct}%</span>
        </div>
      </div>
      <p style={{ fontFamily:FONTS.display, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.offWhiteText, textAlign:'center' }}>{label}</p>
      {sub && <p style={{ fontFamily:FONTS.body, fontSize:'0.6rem', color:COLORS.muted, textAlign:'center' }}>{sub}</p>}
    </div>
  );
}

// ── Win bar ──────────────────────────────────────────────────────
function WinBar({ pct, won, total }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.35rem' }}>
        <span style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:COLORS.offWhiteText }}>Win Rate</span>
        <span style={{ fontFamily:FONTS.display, fontSize:'0.8rem', fontWeight:700, color:COLORS.gold }}>{won}/{total} · {pct}%</span>
      </div>
      <div style={{ height:'3px', background:COLORS.border, borderRadius:'2px', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
          transition={{ duration:1.2, ease:[0.22,1,0.36,1], delay:0.4 }}
          style={{ height:'100%', borderRadius:'2px', background:barGrad(pct) }}/>
      </div>
    </div>
  );
}

// ── Series type badge ────────────────────────────────────────────
function Badge({ type }) {
  const cup = type==='cup';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'3px 10px',
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

// ── Simple match result pill (no scores, no date) ───────────────
function MatchPill({ match }) {
  const col = rCol(match.result);
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0.6rem 0.85rem', gap:'0.75rem',
      background:`${col}0D`, border:`1px solid ${col}35`,
    }}>
      {/* Match title */}
      <span style={{ fontFamily:FONTS.display, fontSize:'0.85rem', fontWeight:700, color:COLORS.offWhiteText, flex:1 }}>
        {match.matchTitle}
      </span>

      {/* Result badge */}
      <div style={{
        width:'28px', height:'28px', background:col, borderRadius:'2px',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <span style={{ fontFamily:FONTS.display, fontSize:'0.85rem', fontWeight:700,
          color: match.result==='W' ? COLORS.navy : '#fff', lineHeight:1 }}>
          {match.result}
        </span>
      </div>
    </div>
  );
}

// ── Series card (shown inside the slider) ───────────────────────
function SeriesCard({ series }) {
  const [open, setOpen] = useState(false);
  const sum = getSeriesSummary(series);
  const rc  = sum.seriesWon ? COLORS.gold : '#EF4444';

  return (
    <div style={{
      background:COLORS.cardBg,
      border:`1px solid ${sum.seriesWon ? COLORS.border : 'rgba(239,68,68,0.22)'}`,
      overflow:'hidden', height:'100%', display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ padding:'1.5rem', borderBottom:`1px solid ${COLORS.border}`, flex:'0 0 auto' }}>
        {/* Badge + season row */}
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.55rem', flexWrap:'wrap' }}>
          <Badge type={series.seriesType}/>
          <span style={{ fontFamily:FONTS.accent, fontSize:'0.56rem', letterSpacing:'0.15em', color:COLORS.muted, textTransform:'uppercase' }}>{series.season}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily:FONTS.display, fontSize:'clamp(1rem,4vw,1.3rem)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:COLORS.white, marginBottom:'0.2rem' }}>
          {series.preferName}
        </h3>
        <p style={{ fontFamily:FONTS.body, fontSize:'0.75rem', color:COLORS.gold, marginBottom:'0.5rem' }}>
          UU vs {series.opponent}
        </p>

        {/* Meta row */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginBottom:'0.75rem' }}>
          <span style={{ fontFamily:FONTS.body, fontSize:'0.68rem', color:COLORS.muted, display:'flex', alignItems:'center', gap:'0.25rem' }}>
            <FaMapMarkerAlt size={9}/>{series.venue}
          </span>
          <span style={{ fontFamily:FONTS.body, fontSize:'0.68rem', color:COLORS.muted, display:'flex', alignItems:'center', gap:'0.25rem' }}>
            <FaCalendarAlt size={9}/>{series.date}
          </span>
        </div>

        {/* Result badge row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0' }}>
          <div style={{ padding:'4px 12px', background:`${rc}15`, border:`1px solid ${rc}50`, display:'flex', alignItems:'center', gap:'0.35rem' }}>
            {sum.seriesWon && <FaTrophy size={9} color={COLORS.gold}/>}
            <span style={{ fontFamily:FONTS.display, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:rc }}>
              {sum.seriesWon ? 'Series Won' : 'Series Lost'}
            </span>
          </div>
          <span style={{ fontFamily:FONTS.display, fontSize:'0.68rem', color:COLORS.muted, letterSpacing:'0.08em' }}>
            {sum.won}W · {sum.lost}L{sum.draw>0 ? ` · ${sum.draw}D` : ''}
          </span>
        </div>

        {/* Win bar */}
        <WinBar pct={sum.winPct} won={sum.won} total={sum.total}/>
      </div>

      {/* Match toggle */}
      <button onClick={() => setOpen(!open)}
        style={{
          width:'100%', padding:'0.65rem 1.5rem', background:'none', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.2em',
          textTransform:'uppercase', color:COLORS.muted, transition:'color .2s', flex:'0 0 auto',
        }}
        onMouseEnter={e=>e.currentTarget.style.color=COLORS.gold}
        onMouseLeave={e=>e.currentTarget.style.color=COLORS.muted}>
        <span>Matches · {series.matches.length}</span>
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:.25 }}>
          <FaChevronRight size={10} style={{ transform:'rotate(90deg)' }}/>
        </motion.span>
      </button>

      {/* Match pills — expandable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:.3, ease:[0.22,1,0.36,1] }}
            style={{ overflow:'hidden' }}>
            <div style={{ padding:'0 1.25rem 1.25rem', display:'flex', flexDirection:'column', gap:'6px' }}>
              {series.matches.map(m => <MatchPill key={m.matchNo} match={m}/>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SERIES SLIDER ────────────────────────────────────────────────
function SeriesSlider({ series, filter }) {
  const filtered   = filter==='all' ? series : series.filter(s=>s.seriesType===filter);
  const trackRef   = useRef(null);
  const wrapRef    = useRef(null);
  const [idx, setIdx] = useState(0);
  const GAP = 16;

  // compute card width from wrapper — full width on mobile, 480px max on desktop
  const getCardW = () => {
    if (!wrapRef.current) return 340;
    const w = wrapRef.current.offsetWidth;
    return w < 520 ? w : Math.min(w * 0.82, 480);
  };

  const maxIdx = Math.max(0, filtered.length - 1);

  const slideTo = (i) => {
    const c = Math.max(0, Math.min(i, maxIdx));
    setIdx(c);
    if (trackRef.current) {
      const cardW = getCardW();
      animate(trackRef.current, { x: -(c * (cardW + GAP)) }, { type:'spring', stiffness:280, damping:30 });
    }
  };

  // reset on filter change
  React.useEffect(() => {
    setIdx(0);
    if (trackRef.current) animate(trackRef.current, { x:0 }, { duration:0 });
  }, [filter]);

  // re-slide on window resize so position stays correct
  React.useEffect(() => {
    const onResize = () => {
      if (trackRef.current) {
        const cardW = getCardW();
        animate(trackRef.current, { x: -(idx * (cardW + GAP)) }, { duration:0 });
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [idx]);

  if (filtered.length === 0) {
    return (
      <div style={{ padding:'4rem', textAlign:'center', border:`1px solid ${COLORS.border}`, background:COLORS.cardBg }}>
        <p style={{ fontFamily:FONTS.display, fontSize:'1rem', letterSpacing:'0.1em', color:COLORS.muted, textTransform:'uppercase' }}>
          No results found
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapRef}>
      {/* Track wrapper */}
      <div style={{ overflow:'hidden', position:'relative' }}>
        {/* Right fade */}
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'32px', zIndex:2, pointerEvents:'none',
          background:`linear-gradient(to left,${COLORS.navyDeep},transparent)` }}/>

        <motion.div ref={trackRef}
          style={{ display:'flex', gap:`${GAP}px`, willChange:'transform', alignItems:'stretch' }}>
          {filtered.map(s => (
            <div key={s.id} style={{
              // full width on mobile, capped on desktop — computed via CSS clamp
              width: 'clamp(280px, 82vw, 480px)',
              flexShrink: 0,
            }}>
              <SeriesCard series={s}/>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'1.25rem' }}>
        <button onClick={() => slideTo(idx-1)} disabled={idx===0}
          style={{
            width:'36px', height:'36px', background:'none', border:`1px solid ${COLORS.border}`,
            cursor:idx===0?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color:idx===0?COLORS.subtle:COLORS.gold, transition:'all .2s', flexShrink:0,
          }}
          onMouseEnter={e=>{ if(idx>0){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===0?COLORS.subtle:COLORS.gold; }}>
          <FaChevronLeft size={12}/>
        </button>

        {/* Dots */}
        <div style={{ display:'flex', gap:'6px', flex:1, justifyContent:'center', flexWrap:'wrap' }}>
          {filtered.map((_,i) => (
            <button key={i} onClick={() => slideTo(i)}
              style={{
                width:i===idx?'22px':'8px', height:'8px',
                borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
                background:i===idx?COLORS.gold:COLORS.border,
                transition:'all .25s',
              }}/>
          ))}
        </div>

        <button onClick={() => slideTo(idx+1)} disabled={idx===maxIdx}
          style={{
            width:'36px', height:'36px', background:'none', border:`1px solid ${COLORS.border}`,
            cursor:idx===maxIdx?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color:idx===maxIdx?COLORS.subtle:COLORS.gold, transition:'all .2s', flexShrink:0,
          }}
          onMouseEnter={e=>{ if(idx<maxIdx){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===maxIdx?COLORS.subtle:COLORS.gold; }}>
          <FaChevronRight size={12}/>
        </button>
      </div>

      {/* Position */}
      <p style={{ fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:COLORS.subtle, textAlign:'center', marginTop:'0.6rem' }}>
        {idx+1} / {filtered.length}
        {filtered.length < RESULTS.length ? ` · showing last ${SETTINGS.showNo} series` : ''}
      </p>
    </div>
  );
}

// ── Overall stats banner ─────────────────────────────────────────
function OverallStats() {
  // always getOverallStats(RESULTS) — full dataset
  const s = getOverallStats(RESULTS);
  const pills = [
    { label:'Total Series',  value:RESULTS.length,  col:COLORS.offWhiteText },
    { label:'Series Won',    value:s.seriesWon,      col:COLORS.gold         },
    { label:'Series Lost',   value:s.seriesLost,     col:'#EF4444'           },
    { label:'Total Matches', value:s.totalMatches,   col:COLORS.offWhiteText },
    { label:'Matches Won',   value:s.totalWins,      col:COLORS.gold         },
    { label:'Matches Lost',  value:s.totalLosses,    col:'#EF4444'           },
  ];
  return (
    <motion.div variants={fadeUp}
      style={{ background:`linear-gradient(135deg,${COLORS.cardBg},${COLORS.navyMid})`,
        border:`1px solid ${COLORS.border}`, padding:'clamp(1.5rem,4vw,2.5rem)', marginBottom:'3rem' }}>

      {/* Donuts — stack on mobile, row on desktop */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center', alignItems:'center',
        paddingBottom:'2rem', borderBottom:`1px solid ${COLORS.border}`, marginBottom:'2rem' }}>
        <Donut pct={s.seriesWinPct} size={100} stroke={8}
          color={s.seriesWinPct>=50?COLORS.gold:'#EF4444'}
          label="Series Win%" sub={`${s.seriesWon} of ${RESULTS.length} series`}/>
        <Donut pct={s.matchWinPct} size={100} stroke={8}
          color={s.matchWinPct>=50?COLORS.gold:'#EF4444'}
          label="Match Win%" sub={`${s.totalWins} of ${s.totalMatches} matches`}/>
      </div>

      {/* Stat pills — 2 cols on mobile, 6 on desktop */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(90px,1fr))', gap:'1px', background:COLORS.border }}>
        {pills.map(({ label, value, col }) => (
          <div key={label} style={{ background:COLORS.cardBg, padding:'1rem 0.4rem', textAlign:'center' }}>
            <div style={{ fontFamily:FONTS.display, fontSize:'clamp(1.3rem,5vw,2rem)', fontWeight:700, color:col, lineHeight:1, marginBottom:'0.3rem' }}>
              {value}
            </div>
            <div style={{ fontFamily:FONTS.accent, fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:COLORS.muted, lineHeight:1.3 }}>
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
  return (
    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
      {[{k:'all',l:'All Series'},{k:'cup',l:'Cup Matches'},{k:'friendly',l:'Friendly'}].map(({k,l}) => (
        <button key={k} onClick={()=>onChange(k)}
          style={{
            fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.18em',
            textTransform:'uppercase', padding:'8px 20px', fontWeight:700,
            background:active===k?COLORS.gold:'transparent',
            color:active===k?COLORS.navy:COLORS.muted,
            border:`1px solid ${active===k?COLORS.gold:COLORS.border}`,
            cursor:'pointer', transition:'all .22s',
          }}
          onMouseEnter={e=>{ if(active!==k){ e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.color=COLORS.offWhiteText; }}}
          onMouseLeave={e=>{ if(active!==k){ e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.muted; }}}>
          {l}
        </button>
      ))}
    </div>
  );
}

// ── MAIN SECTION ─────────────────────────────────────────────────
export default function MatchResults() {
  const { ref, inView } = useReveal(0.08);
  const [filter, setFilter] = useState('all');

  // getVisibleSeries() = last showNo from RESULTS
  const sliderSeries = getVisibleSeries();

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
      <div style={{ position:'absolute',top:0,left:0,right:0,height:'3px',
        background:`linear-gradient(90deg,transparent,${COLORS.gold},${COLORS.goldLight},${COLORS.gold},transparent)` }}/>

      <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative' }}>

        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ textAlign:'center', marginBottom:'0.75rem' }}>On the Field</motion.p>

        <motion.h2 variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ fontFamily:FONTS.display, fontSize:'clamp(2rem,5vw,4.5rem)',
            textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em',
            color:COLORS.white, fontWeight:700, marginBottom:'0.75rem' }}>
          Match <span style={{ color:COLORS.gold }}>Results</span>
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ fontFamily:FONTS.body, color:COLORS.muted, textAlign:'center',
            maxWidth:'500px', margin:'0 auto 3.5rem', fontSize:'1rem', lineHeight:1.7 }}>
          Every series. Every match. Stats always from the full record — slider shows last {SETTINGS.showNo}.
        </motion.p>

        {/* Stats banner — always full RESULTS */}
        <motion.div variants={stagger} initial="hidden" animate={inView?'show':'hidden'}>
          <OverallStats/>
        </motion.div>

        {/* Filter */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}>
          <Tabs active={filter} onChange={setFilter}/>
        </motion.div>

        {/* Series SLIDER — uses sliderSeries (last showNo) */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}>
          <SeriesSlider series={sliderSeries} filter={filter}/>
        </motion.div>

      </div>
    </section>
  );
}
