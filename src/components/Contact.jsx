import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { COLORS, FONTS, FONT_SIZES, SOCIAL } from '../config/theme';
import { useReveal, fadeUp, fadeLeft, fadeRight } from '../anim';

const socials = [
  { icon:FaFacebookF, href:SOCIAL.facebook,  label:'Facebook',  c:'#1877F2' },
  { icon:FaInstagram, href:SOCIAL.instagram,  label:'Instagram', c:'#E1306C' },
  { icon:FaTiktok,    href:SOCIAL.tiktok,     label:'TikTok',    c:'#FFFFFF' },
  { icon:FaWhatsapp,  href:SOCIAL.whatsapp,   label:'WhatsApp',  c:'#25D366' },
];

const contacts = [
  { icon:FaMapMarkerAlt, label:'Location', value:'Sri Lanka' },
  { icon:FaEnvelope,     label:'Email',    value:'info@unbreakableunit.lk' },
  { icon:FaPhone,        label:'WhatsApp', value:'+94 XX XXX XXXX' },
];

function Field({ label, type='text', name, placeholder, multiline, rows=5 }) {
  const [focus, setFocus] = useState(false);
  const base = {
    width:'100%', background:'rgba(11,30,54,0.8)',
    border:`1px solid ${focus ? COLORS.gold : COLORS.border}`,
    color:COLORS.white, fontFamily:FONTS.body, fontSize:'1rem',
    padding:'14px 16px', outline:'none', transition:'border-color .22s',
    resize:'none',
  };
  return (
    <div style={{ marginBottom:'1.25rem' }}>
      <label style={{ display:'block', fontFamily:FONTS.accent, fontSize:'0.68rem', letterSpacing:'0.22em', textTransform:'uppercase', color: focus ? COLORS.gold : COLORS.muted, marginBottom:'0.5rem', transition:'color .22s' }}>{label}</label>
      {multiline
        ? <textarea rows={rows} name={name} placeholder={placeholder} style={base} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
        : <input type={type} name={name} placeholder={placeholder} style={base} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
      }
    </div>
  );
}

export default function Contact() {
  const { ref, inView } = useReveal();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  return (
    <section id="contact" ref={ref} style={{ background:COLORS.navyDeep, padding:'8rem clamp(1rem,4vw,3rem)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%', background:`radial-gradient(circle, ${COLORS.goldGlow} 0%, transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>

        <motion.p className="lbl" variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'} style={{ textAlign:'center', marginBottom:'0.75rem' }}>Get In Touch</motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'} style={{ fontFamily:FONTS.display, fontSize:FONT_SIZES.h1, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em', color:COLORS.white, marginBottom:'1rem' }}>Contact <span style={{ color:COLORS.gold }}>The Unit</span></motion.h2>
        <motion.p variants={fadeUp} initial="hidden" animate={inView?'show':'hidden'} style={{ fontFamily:FONTS.body, color:COLORS.muted, textAlign:'center', maxWidth:'480px', margin:'0 auto 5rem', lineHeight:1.7 }}>Challenge us to a match, partner with us, or join the unit - reach out and we'll respond.</motion.p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:'4rem', alignItems:'start' }}>
          <motion.div variants={fadeLeft} initial="hidden" animate={inView?'show':'hidden'}>
            <div style={{ width:'50px', height:'3px', background:`linear-gradient(90deg,${COLORS.gold},transparent)`, marginBottom:'2.5rem' }} />

            {contacts.map(({ icon:Icon, label, value }) => (
              <div key={label} style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.75rem' }}>
                <div style={{ width:'42px', height:'42px', flexShrink:0, background:`${COLORS.gold}18`, border:`1px solid ${COLORS.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:COLORS.gold }}>
                  <Icon size={16} />
                </div>
                <div>
                  <p style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.22em', textTransform:'uppercase', color:COLORS.muted, marginBottom:'0.2rem' }}>{label}</p>
                  <p style={{ fontFamily:FONTS.body, color:COLORS.white, fontWeight:500 }}>{value}</p>
                </div>
              </div>
            ))}

            <p style={{ fontFamily:FONTS.accent, fontSize:'0.65rem', letterSpacing:'0.22em', textTransform:'uppercase', color:COLORS.subtle, marginBottom:'1rem', marginTop:'2rem' }}>Follow The Unit</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              {socials.map(({ icon:Icon, href, label, c }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} whileHover={{ scale:1.15, y:-3 }} style={{ width:'42px', height:'42px', border:`1px solid ${COLORS.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:COLORS.muted, background:COLORS.cardBg, transition:'all .22s' }} onMouseEnter={e=>{ e.currentTarget.style.borderColor=c; e.currentTarget.style.color=c; }} onMouseLeave={e=>{ e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.muted; }}>
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeRight} initial="hidden" animate={inView?'show':'hidden'}>
            {sent ? (
              <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} style={{ padding:'3.5rem', textAlign:'center', border:`1px solid ${COLORS.borderStrong}`, background:`${COLORS.gold}08` }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⚡</div>
                <h3 style={{ fontFamily:FONTS.display, fontSize:'2rem', letterSpacing:'0.1em', color:COLORS.gold, textTransform:'uppercase', marginBottom:'0.75rem' }}>Message Received</h3>
                <p style={{ fontFamily:FONTS.body, color:COLORS.muted }}>One of our team will get back to you. The unit stands ready.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit}>
                <Field label="Full Name"      name="name"    placeholder="Your name" />
                <Field label="Email"          name="email"   type="email" placeholder="your@email.com" />
                <Field label="Subject"        name="subject" placeholder="Match challenge, sponsorship..." />
                <Field label="Message"        name="message" placeholder="Tell us more..." multiline />
                <motion.button type="submit" disabled={loading} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }} style={{ width:'100%', padding:'16px', background: loading ? COLORS.subtle : COLORS.gold, border:'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:FONTS.display, fontSize:'1.1rem', letterSpacing:'0.18em', textTransform:'uppercase', color:COLORS.navy, fontWeight:700, transition:'background .25s', boxShadow: loading ? 'none' : `0 0 30px ${COLORS.goldGlow}` }}>{loading ? 'Sending...' : 'Send Message'}</motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
