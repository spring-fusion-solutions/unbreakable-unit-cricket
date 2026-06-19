import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS, FONTS, FONT_SIZES, ASSETS, TEAM } from '../config/theme';
import { useReveal, fadeUp, fadeLeft, fadeRight, stagger } from '../anim';

function Counter({ target, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        tick();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const stats = [
  { value: 11,  suffix: '',   label: 'Elite Players'    },
  { value: 100, suffix: '%',  label: 'Team Spirit'      },
  { value: 2024,suffix: '',   label: 'Founded'          },
  { value: 1,   suffix: '🏆', label: 'Goal — Victory'  },
];

const values = [
  { icon: '⚡', title: 'Aggressive Play',  body: 'We attack every delivery, every over. No mercy — only victory.' },
  { icon: '🛡️', title: 'Unbreakable Bond', body: 'Off the field as one. On the field as eleven. Always the unit.' },
  { icon: '🏆', title: 'Championship DNA', body: 'Every training session, every game — we play like the final.' },
];

export default function About() {
  const { ref, inView } = useReveal();

  return (
    <section id="about" ref={ref} style={{
      background: `linear-gradient(180deg, ${COLORS.navyDeep} 0%, ${COLORS.navy} 100%)`,
      padding: '8rem clamp(1rem,4vw,3rem)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: '-20%', width: '60%', height: '100%', background: `linear-gradient(135deg, transparent 40%, ${COLORS.slate}20 100%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Our Story</motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ fontFamily: FONTS.display, fontSize: FONT_SIZES.h1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.white, marginBottom: '5rem' }}>
          More Than a Team -
          <span style={{ color: COLORS.gold }}> A Unit</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <motion.div variants={fadeLeft} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <div style={{ width: '50px', height: '3px', background: `linear-gradient(90deg,${COLORS.gold},transparent)`, marginBottom: '2rem' }} />
            <p style={{ fontFamily: FONTS.body, fontSize: '1.15rem', color: COLORS.offWhiteText, lineHeight: 1.85, marginBottom: '1.5rem' }}>
              <strong style={{ color: COLORS.gold }}>Unbreakable Unit Cricket</strong> was born from a simple conviction — that the right group of people, united by purpose, can't be defeated.
            </p>
            <p style={{ fontFamily: FONTS.body, fontSize: '1.05rem', color: COLORS.muted, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Owned and founded by <strong style={{ color: COLORS.white }}>Super Phoenix</strong>, our team from Sri Lanka is built on aggressive cricket, steel discipline, and a brotherhood that refuses to fracture under pressure.
            </p>
            <p style={{ fontFamily: FONTS.body, fontSize: '1.05rem', color: COLORS.muted, lineHeight: 1.8 }}>
              Every player in this unit is a champion. Together, we are <em style={{ color: COLORS.gold }}>unbreakable</em>.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {values.map(({ icon, title, body }) => (
              <motion.div key={title} variants={fadeRight} whileHover={{ x: 6, borderColor: COLORS.gold }} style={{ padding: '1.5rem', background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, display: 'flex', gap: '1.25rem', alignItems: 'flex-start', transition: 'border-color .25s', cursor: 'default' }}>
                <div style={{ width: '44px', height: '44px', flexShrink: 0, background: `${COLORS.gold}18`, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{icon}</div>
                <div>
                  <h4 style={{ fontFamily: FONTS.heading, fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.white, marginBottom: '0.3rem' }}>{title}</h4>
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: COLORS.muted, lineHeight: 1.65 }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1px', background: COLORS.border, border: `1px solid ${COLORS.border}` }}>
          {stats.map(({ value, suffix, label }) => (
            <motion.div key={label} variants={fadeUp} whileHover={{ background: `${COLORS.gold}10` }} style={{ background: COLORS.cardBg, padding: '2.5rem 1.5rem', textAlign: 'center', transition: 'background .25s' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 'clamp(2.5rem,5vw,4rem)', color: COLORS.gold, lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                <Counter target={value} suffix={suffix} />
              </div>
              <div style={{ fontFamily: FONTS.accent, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
