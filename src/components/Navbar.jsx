import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { COLORS, FONTS, NAV_ITEMS, ASSETS, TEAM } from '../config/theme';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 70);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: scrolled ? '64px' : '80px',
          padding: '0 clamp(1rem,4vw,3rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(6,15,28,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
          transition: 'all 0.35s ease',
        }}>

        <button onClick={() => go('#hero')} style={{ background:'none',border:'none',display:'flex',alignItems:'center',gap:'0.6rem',cursor:'pointer' }}>
          <img src={ASSETS.logo} alt="UU Cricket Logo"
            style={{ height:'42px', width:'42px', objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(212,175,55,.5))' }}
            onError={e => e.target.style.display='none'} />
          <div>
            <div style={{ fontFamily:FONTS.display, fontSize:'1.15rem', letterSpacing:'0.12em', color:COLORS.white, lineHeight:1 }}>
              UNBREAKABLE <span style={{ color:COLORS.gold }}>UNIT</span>
            </div>
            <div style={{ fontFamily:FONTS.accent, fontSize:'0.55rem', letterSpacing:'0.3em', color:COLORS.muted, textTransform:'uppercase' }}>Cricket</div>
          </div>
        </button>

        <ul style={{ display:'flex', gap:'2rem', listStyle:'none', alignItems:'center' }} className="desk-nav">
          {NAV_ITEMS.map(n => (
            <li key={n.label}>
              <button onClick={() => go(n.href)} style={{
                background:'none', border:'none', cursor:'pointer',
                fontFamily:FONTS.accent, fontSize:'0.8rem', letterSpacing:'0.18em',
                textTransform:'uppercase', color:COLORS.muted, transition:'color .2s',
                padding:'4px 0',
              }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
              onMouseLeave={e => e.currentTarget.style.color = COLORS.muted}>
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
          onClick={() => go('#contact')}
          className="desk-nav"
          style={{
            fontFamily:FONTS.accent, fontSize:'0.72rem', letterSpacing:'0.18em',
            padding:'10px 26px', background:COLORS.gold, color:COLORS.navy,
            border:'none', fontWeight:700, textTransform:'uppercase',
            boxShadow:`0 0 24px ${COLORS.goldGlow}`,
          }}>
          Join Us
        </motion.button>

        <button onClick={() => setOpen(!open)} className="mob-btn"
          style={{ background:'none', border:'none', color:COLORS.white, fontSize:'1.3rem', display:'none' }}
          aria-label="menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'tween', duration:.28 }}
            style={{
              position:'fixed', top:0, right:0, bottom:0, width:'70vw', maxWidth:'300px',
              zIndex:1001, background:'rgba(6,15,28,.98)', backdropFilter:'blur(20px)',
              borderLeft:`1px solid ${COLORS.border}`,
              display:'flex', flexDirection:'column', padding:'5rem 2rem 2rem',
              gap:'2rem',
            }}>
            {NAV_ITEMS.map(n => (
              <button key={n.label} onClick={() => go(n.href)}
                style={{ background:'none', border:'none', textAlign:'left', cursor:'pointer',
                  fontFamily:FONTS.display, fontSize:'1.8rem', letterSpacing:'0.08em',
                  color:COLORS.white, textTransform:'uppercase', transition:'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
                onMouseLeave={e => e.currentTarget.style.color = COLORS.white}>
                {n.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{"\n        @media(max-width:768px){\n          .desk-nav{display:none!important}\n          .mob-btn{display:block!important}\n        }\n      "}</style>
    </>
  );
}
