import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS, FONT_SIZES, ASSETS } from '../config/theme';
import { useReveal, fadeUp, stagger } from '../anim';

function PlayerCard({ player, index }) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div variants={fadeUp} custom={index} style={{ perspective: '1000px', cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', width: '100%', paddingTop: '140%', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          {!imgError ? (
            <img src={player.image} alt={player.name} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${COLORS.navyMid}, ${COLORS.cardBg})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: FONTS.display, fontSize: '4rem', fontWeight: 700, color: COLORS.gold, letterSpacing: '0.05em' }}>{initials}</span>
            </div>
          )}

          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${COLORS.navyDeep} 0%, ${COLORS.navyDeep}80 30%, transparent 60%)` }} />

          <div style={{ position: 'absolute', top: '-10px', right: '8px', fontFamily: FONTS.display, fontSize: '6.5rem', fontWeight: 700, color: `${COLORS.gold}22`, lineHeight: 1, userSelect: 'none', letterSpacing: '-0.02em' }}>{player.number}</div>

          <div style={{ position: 'absolute', top: '12px', left: '12px', background: COLORS.gold, padding: '4px 10px', fontFamily: FONTS.display, fontSize: '1rem', fontWeight: 700, color: COLORS.navy, letterSpacing: '0.08em' }}>#{player.number}</div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
            <p style={{ fontFamily: FONTS.accent, fontSize: '0.65rem', letterSpacing: '0.22em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: '0.3rem' }}>{player.speciality}</p>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.white, marginBottom: '0.2rem', lineHeight: 1.1 }}>{player.name}</h3>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.muted }}>{player.role}</p>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '18px', height: '1px', background: COLORS.gold }} />
              <span style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.2em', color: COLORS.subtle, textTransform: 'uppercase' }}>tap to flip</span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})` }} />
        </div>

        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `linear-gradient(135deg, ${COLORS.cardBg} 0%, ${COLORS.navyMid} 100%)`, border: `1px solid ${COLORS.borderStrong}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: FONTS.display, fontSize: '10rem', fontWeight: 700, color: `${COLORS.gold}08`, lineHeight: 1, userSelect: 'none' }}>{player.number}</div>

          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display, fontSize: '1.6rem', color: COLORS.navy, fontWeight: 700, marginBottom: '1.25rem', boxShadow: `0 0 24px ${COLORS.goldGlow}` }}>{initials}</div>

          <span style={{ fontFamily: FONTS.accent, fontSize: '0.65rem', letterSpacing: '0.3em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{player.speciality}</span>

          <h3 style={{ fontFamily: FONTS.display, fontSize: '1.6rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.white, marginBottom: '0.4rem' }}>{player.name}</h3>

          <p style={{ fontFamily: FONTS.body, color: COLORS.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{player.role}</p>

          <div style={{ padding: '0.6rem 1.4rem', border: `1px solid ${COLORS.gold}`, fontFamily: FONTS.display, fontSize: '2rem', fontWeight: 700, color: COLORS.gold, letterSpacing: '0.05em', background: `${COLORS.gold}10` }}>#{player.number}</div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '18px', height: '1px', background: COLORS.subtle }} />
            <span style={{ fontFamily: FONTS.accent, fontSize: '0.58rem', letterSpacing: '0.2em', color: COLORS.subtle, textTransform: 'uppercase' }}>tap to flip back</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Squad() {
  const { ref, inView } = useReveal(0.08);

  return (
    <section id="squad" ref={ref} style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`, padding: '8rem clamp(1rem,4vw,3rem)', position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.03,pointerEvents:'none' }}>
        <defs>
          <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="48" stroke={COLORS.gold} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>

      <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>
        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ textAlign:'center', marginBottom:'0.75rem' }}>The Lineup</motion.p>

        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily:FONTS.display, fontSize:FONT_SIZES.h1, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em', color:COLORS.white, marginBottom:'0.75rem' }}>
          Meet the <span style={{ color:COLORS.gold }}>Unit</span>
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily:FONTS.body, color:COLORS.muted, textAlign:'center', maxWidth:'480px', margin:'0 auto 4rem', fontSize:'1rem', lineHeight:1.7 }}>
          Eleven warriors. One heartbeat. <strong style={{color:COLORS.gold}}>Tap a card</strong> to flip and explore each player.
        </motion.p>

        <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'1.25rem' }}>
          {ASSETS.squad.map((p, i) => (
            <PlayerCard key={p.id} player={p} index={i} />
          ))}
        </motion.div>

        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily:FONTS.accent, fontSize:'0.68rem', letterSpacing:'0.18em', color:COLORS.subtle, textAlign:'center', marginTop:'3rem', textTransform:'uppercase' }}>
          Squad · 2024–25 Season
        </motion.p>
      </div>
    </section>
  );
}
