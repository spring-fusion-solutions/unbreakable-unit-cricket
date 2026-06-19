import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { COLORS, FONTS, FONT_SIZES, ASSETS, SOCIAL, TEAM } from '../config/theme';

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: SOCIAL.facebook,  label: 'Facebook'  },
  { icon: FaInstagram, href: SOCIAL.instagram,  label: 'Instagram' },
  { icon: FaTiktok,    href: SOCIAL.tiktok,     label: 'TikTok'    },
  { icon: FaWhatsapp,  href: SOCIAL.whatsapp,   label: 'WhatsApp'  },
];

function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if(!c) return;
    const ctx = c.getContext('2d');
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const pts = Array.from({length:80},()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
      r:Math.random()*1.5+.5, o:Math.random()*.6+.2,
    }));
    let raf;
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,175,55,${p.o})`;
        ctx.fill();
      });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(212,175,55,${.15*(1-d/100)})`;
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }));
      raf=requestAnimationFrame(draw);
    }
    draw();
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight};
    window.addEventListener('resize',resize);
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)};
  },[]);
  return <canvas ref={ref} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',opacity:.7 }} />;
}

function Shield3D({ size = 'clamp(160px,36vw,420px)' }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rotX = useSpring(useTransform(my,[-300,300],[18,-18]),{stiffness:120,damping:20});
  const rotY = useSpring(useTransform(mx,[-300,300],[-18,18]),{stiffness:120,damping:20});

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width/2);
    my.set(e.clientY - r.top  - r.height/2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ perspective:'800px', cursor:'none', userSelect:'none' }}>
      <motion.div style={{
        rotateX:rotX, rotateY:rotY,
        // Size is configurable (accepts CSS clamp or px)
        width: size,
        height: size,
        transformStyle:'preserve-3d',
        animation:'float 4s ease-in-out infinite',
      }}>
        <img src={ASSETS.logo} alt="Unbreakable Unit Logo"
          style={{
            width:'100%', height:'100%', objectFit:'contain',
            filter:`drop-shadow(0 0 40px ${COLORS.goldGlow}) drop-shadow(0 0 80px rgba(11,30,54,.8))`,
          }}
          onError={e => {
            e.target.style.display='none';
            e.target.parentElement.innerHTML=`
              <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 0 40px rgba(212,175,55,.4))">
                <path d="M100 10 L190 45 L190 130 Q190 190 100 225 Q10 190 10 130 L10 45 Z" fill="#0F2744" stroke="#D4AF37" stroke-width="3"/>
                <path d="M100 30 L172 58 L172 128 Q172 178 100 208 Q28 178 28 128 L28 58 Z" fill="#0B1E36" stroke="rgba(212,175,55,.4)" stroke-width="1.5"/>
                <text x="100" y="150" text-anchor="middle" font-family="Teko,sans-serif" font-size="80" font-weight="700" fill="#D4AF37" letter-spacing="-2">UU</text>
                <path d="M95 80 L105 80 L100 120 Z" fill="#D4AF37" opacity=".8"/>
              </svg>`;
          }} />
      </motion.div>
    </motion.div>
  );
}

const fadeUp = (d=0) => ({
  initial:{opacity:0,y:40},
  animate:{opacity:1,y:0},
  transition:{duration:.7,delay:d,ease:[.22,1,.36,1]},
});

export default function Hero() {
  const go = (href) => document.querySelector(href)?.scrollIntoView({behavior:'smooth'});

  return (
    <section id="hero" style={{
      position:'relative', minHeight:'100vh',
      background:`linear-gradient(135deg, ${COLORS.navyDeep} 0%, ${COLORS.navy} 50%, ${COLORS.navyMid} 100%)`,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      overflow:'hidden', padding:'6rem 2rem 4rem',
    }}>
      <ParticleField />

      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:'600px', height:'600px', borderRadius:'50%',
        background:`radial-gradient(circle, ${COLORS.goldGlow} 0%, transparent 65%)`,
        pointerEvents:'none',
      }} />

      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.04,pointerEvents:'none' }}>
        {Array.from({length:24},(_,i)=>(
          <line key={i} x1={-200+i*120} y1="0" x2={-200+i*120+400} y2="100%"
            stroke={COLORS.gold} strokeWidth="1"/>
        ))}
      </svg>

      <div style={{
        position:'relative', zIndex:2, maxWidth:'1200px', width:'100%', margin:'0 auto',
        display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'center',
      }} className="hero-grid">

        <div>
          <motion.p className="lbl" {...fadeUp(0)} style={{ marginBottom:'1.5rem' }}>
            Est. {TEAM.founded} &nbsp;·&nbsp; {TEAM.location} &nbsp;·&nbsp; Owned by {TEAM.owner}
          </motion.p>

          <motion.h1 {...fadeUp(.1)} style={{
            fontFamily:FONTS.display, fontSize:FONT_SIZES.hero, fontWeight:700,
            lineHeight:.5, textTransform:'uppercase', letterSpacing:'0.01em',
            color:COLORS.white, marginBottom:'0.5rem',
          }}>
            Unbreak<span style={{
              background:`linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text',
            }}>able</span>
          </motion.h1>

          <motion.h1 {...fadeUp(.18)} style={{
            fontFamily:FONTS.display, fontSize:FONT_SIZES.hero, fontWeight:700,
            lineHeight:.5, textTransform:'uppercase', letterSpacing:'-0.01em',
            color:COLORS.white, marginBottom:'2rem',
            textShadow:`0 0 60px ${COLORS.goldGlow}`,
          }}>
            Unit
          </motion.h1>

          <motion.div {...fadeUp(.24)} style={{
            display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem',
          }}>
            <div style={{ height:'2px', width:'60px', background:`linear-gradient(90deg, ${COLORS.gold}, transparent)` }} />
            <p style={{
              fontFamily:FONTS.accent, fontSize:'0.78rem', letterSpacing:'0.28em',
              color:COLORS.gold, textTransform:'uppercase',
            }}>One Unit · Unbreakable</p>
          </motion.div>

          <motion.p {...fadeUp(.3)} style={{
            fontFamily:FONTS.body, fontSize:'clamp(1rem,2vw,1.2rem)',
            color:COLORS.muted, maxWidth:'520px', lineHeight:1.75, marginBottom:'2.5rem',
          }}>
            {TEAM.tagline || `We don't just play cricket - we break limits, shatter records, and stand unbreakable as one unit.`}
          </motion.p>

          <motion.div {...fadeUp(.36)} style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'3rem' }}>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.96 }}
              onClick={() => go('#squad')}
              style={{
                fontFamily:FONTS.accent, fontSize:'0.78rem', letterSpacing:'0.18em',
                padding:'14px 36px', background:COLORS.gold, color:COLORS.navy,
                border:'none', fontWeight:700, textTransform:'uppercase',
                boxShadow:`0 0 30px ${COLORS.goldGlow}`,
                cursor:'pointer', animation:'pulse-gold 2.5s ease-in-out infinite',
              }}>
              Meet The Squad
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.96 }}
              onClick={() => go('#contact')}
              style={{
                fontFamily:FONTS.accent, fontSize:'0.78rem', letterSpacing:'0.18em',
                padding:'14px 36px', background:'transparent', color:COLORS.white,
                border:`1px solid ${COLORS.border}`, textTransform:'uppercase',
                cursor:'pointer', transition:'border-color .2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=COLORS.gold}
              onMouseLeave={e=>e.currentTarget.style.borderColor=COLORS.border}>
              Join The Unit
            </motion.button>
          </motion.div>

          {/* Mobile-only shield shown above the Follow links */}
          <div className="mobile-shield" style={{ display:'none' }}>
            <Shield3D size={'clamp(220px,48vw,520px)'} />
          </div>

          <motion.div {...fadeUp(.42)} style={{ display:'flex', gap:'0.85rem', alignItems:'center' }}>
            <span style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.2em', color:COLORS.subtle, textTransform:'uppercase' }}>Follow</span>
            {SOCIAL_LINKS.map(({ icon:Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} whileHover={{ y:-3, scale:1.15 }}
                style={{
                  width:'40px', height:'40px', border:`1px solid ${COLORS.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:COLORS.muted, fontSize:'0.95rem', background:COLORS.cardBg,
                  transition:'all .22s',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.color=COLORS.gold; e.currentTarget.style.boxShadow=`0 0 16px ${COLORS.goldGlow}`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.muted; e.currentTarget.style.boxShadow='none'; }}>
                <Icon />
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,scale:.7,rotateY:30}} animate={{opacity:1,scale:1,rotateY:0}}
          transition={{duration:.9,delay:.2,ease:[.22,1,.36,1]}}>
          <Shield3D />
        </motion.div>
      </div>

      <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:2 }}
        style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', cursor:'pointer' }}
        onClick={() => go('#about')}>
        <div style={{
          width:'26px', height:'42px', border:`2px solid ${COLORS.border}`,
          borderRadius:'13px', display:'flex', alignItems:'flex-start',
          justifyContent:'center', padding:'5px',
        }}>
          <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:1.5 }}
            style={{ width:'4px', height:'8px', background:COLORS.gold, borderRadius:'2px' }} />
        </div>
      </motion.div>

      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        background:`linear-gradient(90deg, ${COLORS.navyDeep}, ${COLORS.navy}, ${COLORS.navyDeep})`,
        borderTop:`1px solid ${COLORS.border}`, padding:'10px 0', overflow:'hidden',
      }}>
        <div className="marquee-track" style={{ display:'flex', gap:'0' }}>
          {Array.from({length:2},(_,i)=>(
            <div key={i} style={{ display:'flex', whiteSpace:'nowrap' }}>
              {['UNBREAKABLE UNIT','ONE UNIT','BUILT TO LAST','FORGED IN UNITY','CRICKET','UNBREAKABLE'].map((t,j)=>(
                <span key={j} style={{
                  fontFamily:FONTS.display, fontSize:'0.85rem', letterSpacing:'0.3em',
                  color: j%2===0 ? COLORS.gold : COLORS.muted,
                  padding:'0 2.5rem', textTransform:'uppercase',
                }}>
                  {t} <span style={{ color:COLORS.border, margin:'0 1rem' }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{"\n        @media(max-width:768px){\n          .hero-grid{ grid-template-columns:1fr !important; text-align:center; }\n          .hero-grid > div:last-child{ display:none; }\n          .mobile-shield{ display:block; margin:0 auto 1.25rem; max-width:90%; }\n          .mobile-shield > div{ margin:0 auto; }\n          .hero-grid h1{ white-space:normal; overflow-wrap:break-word; }\n        }\n        @media(max-width:420px){\n          .hero-grid h1{ font-size:clamp(3rem,8.5vw,5.5rem) !important; }\n          .hero-grid h1:first-of-type{ margin-bottom:0.5rem !important; }\n        }\n      "}</style>
    </section>
  );
}
