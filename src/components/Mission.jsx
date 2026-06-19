import React from 'react';
import { motion } from 'framer-motion';
import { COLORS, FONTS, FONT_SIZES } from '../config/theme';
import { useReveal, fadeUp, stagger } from '../anim';

const pillars = [
  {
    num: '01', tag: 'Mission',
    headline: 'Dominate Every\nMatch We Play',
    body: 'To compete at every level with relentless aggression, ironclad unity, and a winning mentality that never quits — representing Sri Lanka with pride at every ground.',
    accent: COLORS.gold,
  },
  {
    num: '02', tag: 'Vision',
    headline: 'Build a Legacy\nThat Lasts Forever',
    body: 'To become the most feared and respected cricket unit in the region — known not just for trophies, but for the unbreakable spirit that earns them.',
    accent: COLORS.goldLight,
  },
];

const values = [
  { label: 'Unity First',       pct: 95 },
  { label: 'Aggressive Cricket',pct: 90 },
  { label: 'Mental Strength',   pct: 88 },
  { label: 'Team Discipline',   pct: 93 },
];

function ProgressBar({ label, pct, inView }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: FONTS.accent, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.offWhiteText }}>{label}</span>
        <span style={{ fontFamily: FONTS.display, fontSize: '1rem', color: COLORS.gold }}>{pct}%</span>
      </div>
      <div style={{ height: '3px', background: COLORS.border, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`, boxShadow: `0 0 8px ${COLORS.goldGlow}` }}
        />
      </div>
    </div>
  );
}

export default function Mission() {
  const { ref, inView } = useReveal();

  return (
    <section id="mission" ref={ref} style={{ background: COLORS.navy, padding: '8rem clamp(1rem,4vw,3rem)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold}, transparent)` }} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: FONTS.display, fontSize: 'clamp(8rem,20vw,18rem)', color: `${COLORS.gold}06`, letterSpacing: '-0.05em', fontWeight: 700, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase' }}>UNBREAKABLE</div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Purpose & Drive</motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily: FONTS.display, fontSize: FONT_SIZES.h1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.white, marginBottom: '5rem' }}>Mission <span style={{ color: COLORS.gold }}>&</span> Vision</motion.h2>

        <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {pillars.map(({ num, tag, headline, body, accent }) => (
            <motion.div key={num} variants={fadeUp} whileHover={{ y: -6 }} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, padding: '2.5rem', position: 'relative', overflow: 'hidden', transition: 'box-shadow .3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${COLORS.goldGlow}`} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: `linear-gradient(90deg,${accent},transparent)` }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '-10px', fontFamily: FONTS.display, fontSize: '9rem', fontWeight: 700, color: `${accent}08`, lineHeight: 1, userSelect: 'none' }}>{num}</div>
              <span style={{ fontFamily: FONTS.accent, fontSize: '0.65rem', letterSpacing: '0.3em', color: accent, textTransform: 'uppercase' }}>{num} — {tag}</span>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '0.04em', textTransform: 'uppercase', color: COLORS.white, margin: '1.25rem 0', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{headline}</h3>
              <p style={{ fontFamily: FONTS.body, fontSize: '1rem', color: COLORS.muted, lineHeight: 1.8 }}>{body}</p>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <p className="lbl" style={{ marginBottom: '1rem' }}>Our Core Values</p>
            <h3 style={{ fontFamily: FONTS.display, fontSize: FONT_SIZES.h2, textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.white, marginBottom: '2.5rem', lineHeight: 1.1 }}>What Makes Us<br /><span style={{ color: COLORS.gold }}>Unbreakable</span></h3>
            {values.map(v => <ProgressBar key={v.label} {...v} inView={inView} />)}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ padding: '3rem', background: `linear-gradient(135deg,${COLORS.cardBg},${COLORS.navyMid})`, border: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: COLORS.goldGlow, filter: 'blur(40px)' }} />
            <p style={{ fontFamily: FONTS.display, fontSize: 'clamp(1.4rem,3vw,2rem)', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.gold, lineHeight: 1.15, marginBottom: '1.5rem' }}>
              "We play hard. We play together. We play until the last ball."
            </p>
            <p style={{ fontFamily: FONTS.body, color: COLORS.muted, lineHeight: 1.75 }}>No unit is stronger than its weakest link — so we have no weak links. Every player in this team is forged for battle, trained for glory, and loyal to the unit.</p>
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${COLORS.border}` }}>
              <p style={{ fontFamily: FONTS.accent, fontSize: '0.7rem', letterSpacing: '0.2em', color: COLORS.subtle, textTransform: 'uppercase' }}>— Super Phoenix, Team Owner</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
