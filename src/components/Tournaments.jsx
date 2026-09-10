import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../config/theme';
import { TOURNAMENTS } from '../config/tournaments';
import { useReveal, fadeUp } from '../anim';
import { FaTrophy, FaMedal, FaCalendarAlt, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';
import { MdSportsCricket } from 'react-icons/md';

// ── Config ───────────────────────────────────────────────────────
const POS = {
  champion:    { label:'Champions',   icon:FaTrophy,  color:COLORS.gold,    dim:'#7A5C10' },
  'runners-up':{ label:'Runners Up',  icon:FaMedal,   color:'#94A3B8',      dim:'#3D4F6B' },
};

const AWARDS_META = {
  bestBatsman:  { label:'Best Batsman',       icon:GiCricketBat,       color:COLORS.gold      },
  bestBowler:   { label:'Best Bowler',         icon:MdSportsCricket,    color:'#60A5FA'        },
  manOfSeries:  { label:'Man of the Series',   icon:FaTrophy,           color:COLORS.goldLight },
};

// ── Player circle avatar ─────────────────────────────────────────
function PlayerCircle({ name, photo, awardColor, size = 88 }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const inner = size - 6;

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', position: 'relative', flexShrink: 0,
      background: `conic-gradient(${awardColor} 0deg, ${awardColor}60 90deg, transparent 90deg)`,
      padding: '3px',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
        background: COLORS.navyMid,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {photo && !err ? (
          <img src={photo} alt={name} onError={() => setErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        ) : (
          <span style={{
            fontFamily: FONTS.display, fontSize: size * 0.3, fontWeight: 700,
            color: awardColor, lineHeight: 1,
          }}>{initials}</span>
        )}
      </div>
    </div>
  );
}

// ── Single award pill ────────────────────────────────────────────
function AwardPill({ awardKey, award }) {
  const meta = AWARDS_META[awardKey];
  if (!meta || !award) return null;
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.6rem', flex: '1 1 0', minWidth: '90px',
      }}>
      {/* Circle avatar */}
      <div style={{ position: 'relative' }}>
        <PlayerCircle name={award.name} photo={award.photo} awardColor={meta.color} size={80} />
        {/* Icon badge */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: '24px', height: '24px', borderRadius: '50%',
          background: meta.color,
          border: `2px solid ${COLORS.navyDeep}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={11} color={meta.color === COLORS.gold ? COLORS.navy : '#fff'} />
        </div>
      </div>

      {/* Name */}
      <p style={{
        fontFamily: FONTS.display, fontSize: '0.78rem', fontWeight: 700,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: COLORS.white, textAlign: 'center', lineHeight: 1.2,
      }}>{award.name}</p>

      {/* Award label */}
      <span style={{
        fontFamily: FONTS.accent, fontSize: '0.55rem', fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: meta.color, textAlign: 'center', lineHeight: 1.3,
      }}>{meta.label}</span>
    </motion.div>
  );
}

// ── Tournament card — new design ─────────────────────────────────
function TournamentCard({ t }) {
  const pos     = POS[t.position] ?? POS['runners-up'];
  const PosIcon = pos.icon;
  const champ   = t.position === 'champion';
  const [imgErr, setImgErr] = useState(false);

  // collect only existing awards
  const awards = ['bestBatsman','bestBowler','manOfSeries']
    .filter(k => t[k])
    .map(k => ({ key: k, award: t[k] }));

  return (
    <div style={{ position: 'relative' }}>

      {/* ── MAIN CARD ── */}
      <div style={{
        background: `linear-gradient(160deg, ${COLORS.cardBg} 0%, ${COLORS.navyMid} 100%)`,
        border: `1px solid ${champ ? `${COLORS.gold}50` : COLORS.border}`,
        overflow: 'hidden',
        boxShadow: champ ? `0 8px 60px ${COLORS.gold}15` : 'none',
      }}>

        {/* Top accent line */}
        <div style={{
          height: '3px',
          background: champ
            ? `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold}, transparent)`
            : `linear-gradient(90deg, transparent, #94A3B8, transparent)`,
        }}/>

        {/* ── GROUP PHOTO ── */}
        <div style={{
          position: 'relative', width: '100%',
          height: 'clamp(180px,42vw,300px)',
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
          overflow: 'hidden',
        }}>
          {t.groupPhoto && !imgErr ? (
            <img src={t.groupPhoto} alt={t.title} onError={() => setImgErr(true)}
              style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          ) : (
            <div style={{
              width:'100%', height:'100%',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem',
            }}>
              {/* Decorative rings */}
              <div style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    position:'absolute', borderRadius:'50%',
                    border:`1px solid ${COLORS.gold}${10+i*5}`,
                    width:`${i*100}px`, height:`${i*100}px`,
                  }}/>
                ))}
              </div>
              <PosIcon size={48} color={`${pos.color}60`} style={{ position:'relative', zIndex:1 }}/>
              <p style={{
                fontFamily:FONTS.accent, fontSize:'0.6rem', letterSpacing:'0.25em',
                textTransform:'uppercase', color:COLORS.subtle, position:'relative', zIndex:1,
              }}>Group Photo Coming Soon</p>
            </div>
          )}

          {/* Dark gradient bottom */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'60%',
            background:`linear-gradient(to top, ${COLORS.navyMid}, transparent)`,
          }}/>

          {/* Position badge — over photo top-left */}
          <div style={{
            position:'absolute', top:'14px', left:'14px',
            display:'flex', alignItems:'center', gap:'0.4rem',
            padding:'5px 14px',
            background:`${pos.color}22`,
            border:`1px solid ${pos.color}60`,
            backdropFilter:'blur(8px)',
          }}>
            <PosIcon size={10} color={pos.color}/>
            <span style={{
              fontFamily:FONTS.display, fontSize:'0.68rem', fontWeight:700,
              letterSpacing:'0.16em', textTransform:'uppercase', color:pos.color,
            }}>{pos.label}</span>
          </div>

          {/* Short title over photo bottom-left */}
          <div style={{
            position:'absolute', bottom:'16px', left:'16px', right:'16px',
          }}>
            <p style={{
              fontFamily:FONTS.accent, fontSize:'0.58rem', fontWeight:700,
              letterSpacing:'0.25em', textTransform:'uppercase', color:pos.color,
              marginBottom:'0.3rem',
            }}>{t.shortTitle}</p>
            <h3 style={{
              fontFamily:FONTS.display, fontWeight:700,
              fontSize:'clamp(1rem,4vw,1.45rem)',
              letterSpacing:'0.04em', textTransform:'uppercase',
              color:COLORS.white, lineHeight:1.1, margin:0,
            }}>{t.title}</h3>
          </div>
        </div>

        {/* ── META ROW ── */}
        <div style={{
          display:'flex', flexWrap:'wrap', gap:'1rem',
          padding:'1rem 1.25rem',
          borderBottom: awards.length > 0 ? `1px solid ${COLORS.border}` : 'none',
        }}>
          <span style={{
            fontFamily:FONTS.body, fontSize:'0.75rem', color:COLORS.muted,
            display:'flex', alignItems:'center', gap:'0.35rem',
          }}>
            <FaCalendarAlt size={10} color={pos.color}/>{t.date}
          </span>
          <span style={{
            fontFamily:FONTS.body, fontSize:'0.75rem', color:COLORS.muted,
            display:'flex', alignItems:'center', gap:'0.35rem',
          }}>
            <FaMapMarkerAlt size={10} color={pos.color}/>{t.venue}
          </span>
        </div>

        {/* ── AWARDS ROW — only if any exist ── */}
        {awards.length > 0 && (
          <div style={{ padding:'1.25rem' }}>
            <p style={{
              fontFamily:FONTS.accent, fontSize:'0.58rem', fontWeight:700,
              letterSpacing:'0.25em', textTransform:'uppercase',
              color:COLORS.subtle, marginBottom:'1.25rem', textAlign:'center',
            }}>UU Award Winners</p>

            <div style={{
              display:'flex', gap:'1rem',
              justifyContent: awards.length === 1 ? 'center' : 'space-around',
              flexWrap:'wrap',
            }}>
              {awards.map(({ key, award }) => (
                <AwardPill key={key} awardKey={key} award={award}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN SECTION ─────────────────────────────────────────────────
export default function Tournaments() {
  const { ref, inView } = useReveal(0.08);
  const [idx, setIdx]   = useState(0);
  const maxIdx          = TOURNAMENTS.length - 1;

  if (TOURNAMENTS.length === 0) return null;

  return (
    <section id="tournaments" ref={ref} style={{
      background:`linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
      padding:'8rem clamp(1rem,4vw,3rem)', position:'relative', overflow:'hidden',
    }}>

      {/* bg grid */}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.025,pointerEvents:'none' }}>
        <defs><pattern id="tg" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="48" stroke={COLORS.gold} strokeWidth="1"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#tg)"/>
      </svg>

      {/* Gold top line */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,height:'3px',
        background:`linear-gradient(90deg,transparent,${COLORS.gold},${COLORS.goldLight},${COLORS.gold},transparent)`,
      }}/>

      {/* Gold radial glow */}
      <div style={{
        position:'absolute',top:'20%',left:'50%',transform:'translate(-50%,-50%)',
        width:'600px',height:'300px',borderRadius:'50%',pointerEvents:'none',
        background:`radial-gradient(ellipse,${COLORS.goldGlow} 0%,transparent 70%)`,
      }}/>

      <div style={{ maxWidth:'600px', margin:'0 auto', position:'relative' }}>

        {/* Heading */}
        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{ textAlign:'center', marginBottom:'0.75rem' }}>
          Glory & Honours
        </motion.p>

        <motion.h2 variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{
            fontFamily:FONTS.display, fontSize:'clamp(2rem,6vw,4.5rem)',
            textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em',
            color:COLORS.white, fontWeight:700, marginBottom:'0.75rem',
          }}>
          Tournament <span style={{ color:COLORS.gold }}>History</span>
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}
          style={{
            fontFamily:FONTS.body, color:COLORS.muted, textAlign:'center',
            maxWidth:'420px', margin:'0 auto 3rem', fontSize:'1rem', lineHeight:1.7,
          }}>
          Every trophy lifted, every final fought — the full UU tournament record.
        </motion.p>

        {/* Card with slide animation */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'}>

          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity:0, x:50 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-50 }}
              transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}>
              <TournamentCard t={TOURNAMENTS[idx]}/>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {TOURNAMENTS.length > 1 && (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              gap:'1rem', marginTop:'1.5rem',
            }}>
              <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0}
                style={{
                  width:'38px', height:'38px', background:'none',
                  border:`1px solid ${COLORS.border}`,
                  cursor:idx===0?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:idx===0?COLORS.subtle:COLORS.gold, transition:'all .2s',
                }}
                onMouseEnter={e=>{ if(idx>0){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===0?COLORS.subtle:COLORS.gold; }}>
                <FaChevronLeft size={12}/>
              </button>

              {/* Dots */}
              <div style={{ display:'flex', gap:'6px' }}>
                {TOURNAMENTS.map((_,i)=>(
                  <button key={i} onClick={()=>setIdx(i)}
                    style={{
                      width:i===idx?'24px':'8px', height:'8px',
                      borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
                      background:i===idx?COLORS.gold:COLORS.border,
                      transition:'all .25s',
                    }}/>
                ))}
              </div>

              <button onClick={() => setIdx(i => Math.min(maxIdx,i+1))} disabled={idx===maxIdx}
                style={{
                  width:'38px', height:'38px', background:'none',
                  border:`1px solid ${COLORS.border}`,
                  cursor:idx===maxIdx?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:idx===maxIdx?COLORS.subtle:COLORS.gold, transition:'all .2s',
                }}
                onMouseEnter={e=>{ if(idx<maxIdx){ e.currentTarget.style.background=COLORS.gold; e.currentTarget.style.color=COLORS.navy; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=idx===maxIdx?COLORS.subtle:COLORS.gold; }}>
                <FaChevronRight size={12}/>
              </button>
            </div>
          )}

          <p style={{
            fontFamily:FONTS.accent, fontSize:'0.58rem', letterSpacing:'0.18em',
            textTransform:'uppercase', color:COLORS.subtle,
            textAlign:'center', marginTop:'0.6rem',
          }}>
            {idx+1} / {TOURNAMENTS.length} Tournaments
          </p>
        </motion.div>
      </div>
    </section>
  );
}
