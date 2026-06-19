import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { COLORS, FONTS, NAV_ITEMS, SOCIAL, ASSETS, TEAM } from '../config/theme';

const socials = [
  { icon:FaFacebookF, href:SOCIAL.facebook,  label:'Facebook'  },
  { icon:FaInstagram, href:SOCIAL.instagram,  label:'Instagram' },
  { icon:FaTiktok,    href:SOCIAL.tiktok,     label:'TikTok'    },
  { icon:FaWhatsapp,  href:SOCIAL.whatsapp,   label:'WhatsApp'  },
];

export default function Footer() {
  const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior:'smooth' });

  return (
    <footer style={{ background:COLORS.navyDeep, borderTop:`1px solid ${COLORS.border}`, padding:'4rem clamp(1rem,4vw,3rem) 2rem' }}>
      <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${COLORS.gold},${COLORS.goldLight},${COLORS.gold},transparent)`, marginBottom:'4rem' }} />

      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'3rem', marginBottom:'3rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
              <img src={ASSETS.logo} alt="UU" style={{ height:'40px', width:'40px', objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(212,175,55,.4))' }} onError={e=>e.target.style.display='none'} />
              <div>
                <div style={{ fontFamily:FONTS.display, fontSize:'1rem', letterSpacing:'0.1em', color:COLORS.white }}>UNBREAKABLE <span style={{ color:COLORS.gold }}>UNIT</span></div>
                <div style={{ fontFamily:FONTS.accent, fontSize:'0.5rem', letterSpacing:'0.3em', color:COLORS.muted, textTransform:'uppercase' }}>Cricket</div>
              </div>
            </div>
            <p style={{ fontFamily:FONTS.body, fontSize:'0.9rem', color:COLORS.muted, lineHeight:1.7, maxWidth:'220px' }}>{TEAM.slogan}</p>
          </div>

          <div>
            <p style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color:COLORS.subtle, marginBottom:'1.25rem' }}>Navigate</p>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {NAV_ITEMS.map(n => (
                <li key={n.label}>
                  <button onClick={()=>go(n.href)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:FONTS.body, fontSize:'0.95rem', color:COLORS.muted, transition:'color .2s', padding:0 }} onMouseEnter={e=>e.currentTarget.style.color=COLORS.gold} onMouseLeave={e=>e.currentTarget.style.color=COLORS.muted}>{n.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color:COLORS.subtle, marginBottom:'1.25rem' }}>Follow Us</p>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              {socials.map(({ icon:Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} whileHover={{ scale:1.15, y:-2 }} style={{ width:'40px', height:'40px', border:`1px solid ${COLORS.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:COLORS.muted, background:COLORS.cardBg, transition:'all .22s' }} onMouseEnter={e=>{ e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.color=COLORS.gold; }} onMouseLeave={e=>{ e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.muted; }}>
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height:'1px', background:`linear-gradient(90deg,transparent,${COLORS.border},transparent)`, marginBottom:'1.75rem' }} />

        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontFamily:FONTS.body, fontSize:'1rem', color:COLORS.subtle }}>© {new Date().getFullYear()} Unbreakable Unit Cricket. All rights reserved.</p>
          <p style={{ fontFamily:FONTS.accent, fontSize:'1rem', letterSpacing:'0.18em', color:COLORS.subtle, textTransform:'uppercase' }}>Owned by Super Phoenix · Sri Lanka</p>
    
        </div>
        <div style={{ display:'flex', width:'100%', justifyContent:'center', marginTop:'1rem' }}>
          <a href='https://wa.me/94762113551' style={{ fontFamily:FONTS.accent, fontSize:'1.15rem', letterSpacing:'0.08em', color:COLORS.subtle, textTransform:'uppercase', textDecoration:'underline', fontWeight:'700' }}>Developed by Abdul Wahhab</a>
        </div>
      </div>
    </footer>
  );
}
