'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// ============================================================
// 🖼️  SET YOUR IMAGES HERE
const BG_IMAGE   = '/demon-slayer-bg.jpg';
const CHAR_IMAGE = '/tanjiro.png';         // optional side character
const USE_CHAR   = false;                  // set true if you have a side character PNG
// ============================================================

const links = [
  {
    title: 'Sociabuzz — Support Stream and Life',
    url: 'https://sociabuzz.com/yonatanyl/tribe',
    kanji: '水', subtitle: 'Water Breathing', form: 'Tenth Form · Constant Flux',
    color: { bg: 'rgba(40,150,220,0.15)', border: 'rgba(40,150,220,0.45)', accent: '#3ab4f2', glow: 'rgba(40,150,220,0.3)', soft: 'rgba(58,180,242,0.08)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6 8 4 12 4 15a8 8 0 0 0 16 0c0-3-2-7-8-13z"/></svg>),
  },
  {
    title: 'TikTok — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://tiktok.com/@y2lnatan',
    kanji: '風', subtitle: 'Wind Breathing', form: 'Ninth Form · Idaten Typhoon',
    color: { bg: 'rgba(60,200,140,0.12)', border: 'rgba(60,200,140,0.45)', accent: '#3ec88a', glow: 'rgba(60,200,140,0.25)', soft: 'rgba(62,200,138,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>),
  },
  {
    title: 'YouTube — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://youtube.com/@y2lnatan',
    kanji: '炎', subtitle: 'Flame Breathing', form: 'Ninth Form · Rengoku',
    color: { bg: 'rgba(220,50,30,0.15)', border: 'rgba(220,50,30,0.45)', accent: '#e8472a', glow: 'rgba(220,50,30,0.3)', soft: 'rgba(232,71,42,0.08)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>),
  },
  {
    title: 'Discord — Havefun Party',
    url: 'https://discord.gg/RwHsmmEmW',
    kanji: '雷', subtitle: 'Thunder Breathing', form: 'First Form · Thunderclap & Flash',
    color: { bg: 'rgba(240,200,40,0.12)', border: 'rgba(240,200,40,0.45)', accent: '#f0c828', glow: 'rgba(240,200,40,0.25)', soft: 'rgba(240,200,40,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.074.036c-.211.374-.444.864-.608 1.25-1.845-.277-3.68-.277-5.487 0-.164-.394-.406-.876-.619-1.25a.07.07 0 0 0-.073-.036 19.74 19.74 0 0 0-4.885 1.515.065.065 0 0 0-.03.028C.533 9.045-.32 13.58.099 18.058c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.993.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.062.062 0 0 0-.031-.03z"/></svg>),
  },
  {
    title: 'Instagram — Private',
    url: 'https://instagram.com/yonatanyl',
    kanji: '霞', subtitle: 'Mist Breathing', form: 'Seventh Form · Obscuring Clouds',
    color: { bg: 'rgba(180,100,200,0.15)', border: 'rgba(180,100,200,0.45)', accent: '#c47ed4', glow: 'rgba(180,100,200,0.3)', soft: 'rgba(196,126,212,0.08)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>),
  }
];

// Ember particle
function Ember({ x, delay, duration }: { x: number; delay: number; duration: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute', bottom: 0, left: `${x}%`,
        width: Math.random() > 0.5 ? '3px' : '2px',
        height: Math.random() > 0.5 ? '3px' : '2px',
        borderRadius: '50%',
        background: Math.random() > 0.6 ? '#f0c828' : Math.random() > 0.5 ? '#e8472a' : '#ff8c42',
        boxShadow: '0 0 4px currentColor',
        pointerEvents: 'none', zIndex: 2,
      }}
      animate={{ y: [0, -(300 + Math.random() * 300)], x: [0, (Math.random() - 0.5) * 80], opacity: [0, 1, 0], scale: [0.5, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

// Wisteria petal
function Petal({ left, duration, delay }: { left: number; duration: number; delay: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '-2%', left: `${left}%`,
        width: '7px', height: '11px',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        background: 'rgba(180,120,220,0.4)', pointerEvents: 'none', zIndex: 2,
      }}
      animate={{ y: '105vh', rotate: [0, 180, 360], x: [0, 30, -20, 10], opacity: [0, 0.8, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

const embers = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 13 + 7) % 100,
  delay: (i * 0.4) % 5,
  duration: 3 + (i % 4),
}));

const petals = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  duration: 8 + (i % 5),
  delay: (i * 1.1) % 9,
}));

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .ds-root {
          min-height: 100vh;
          background-color: #080408;
          background-image: url('${BG_IMAGE}');
          background-size: cover;
          background-position: center 20%;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 52px 20px 72px;
          position: relative;
          overflow: hidden;
          font-family: 'IM Fell English', serif;
        }

        /* Multi-layer cinematic overlay */
        .ds-overlay-1 {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(8,4,8,0.45) 0%,
            rgba(8,4,8,0.30) 25%,
            rgba(8,4,8,0.55) 55%,
            rgba(8,4,8,0.88) 78%,
            #080408 100%
          );
        }
        /* Side vignette */
        .ds-overlay-2 {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 100% at 50% 50%, transparent 40%, rgba(8,4,8,0.7) 100%);
        }
        /* Red atmospheric glow at top */
        .ds-overlay-3 {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 35% at 50% 5%, rgba(180,50,20,0.2) 0%, transparent 70%),
            radial-gradient(ellipse 30% 20% at 15% 85%, rgba(100,30,150,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 30% 20% at 85% 85%, rgba(30,60,150,0.1) 0%, transparent 60%);
        }
        /* Subtle diamond pattern */
        .ds-pattern {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.025;
          background-image:
            repeating-linear-gradient(45deg, rgba(200,140,240,1) 0px, rgba(200,140,240,1) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(200,140,240,1) 0px, rgba(200,140,240,1) 1px, transparent 1px, transparent 22px);
        }

        /* Optional side character */
        .ds-char {
          position: absolute; right: -10px; bottom: 0;
          height: 80%; max-width: 42%;
          object-fit: contain; object-position: bottom right;
          z-index: 1; pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 65%, transparent 100%),
                      linear-gradient(to right, transparent 0%, black 30%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 65%, transparent 100%),
                              linear-gradient(to right, transparent 0%, black 30%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
          opacity: 0.5;
          filter: saturate(0.75) brightness(0.9);
        }

        /* Main content layer */
        .ds-content { position: relative; z-index: 4; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 500px; }

        /* ── CREST ── */
        .crest-wrap { position: relative; width: 100px; height: 100px; margin-bottom: 22px; }
        .crest-spin {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px dashed rgba(210,90,50,0.55);
          filter: drop-shadow(0 0 8px rgba(210,90,50,0.4));
        }
        .crest-spin-2 {
          position: absolute; inset: 6px; border-radius: 50%;
          border: 1px solid rgba(210,90,50,0.25);
        }
        .crest-tri {
          position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 9px solid rgba(210,90,50,0.7);
          filter: drop-shadow(0 0 4px rgba(210,90,50,0.6));
        }
        .crest-face {
          position: absolute; inset: 16px; border-radius: 50%;
          background: radial-gradient(circle, #200d10 0%, #120508 100%);
          border: 1px solid rgba(210,90,50,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Noto Serif JP', serif;
          font-size: 24px; font-weight: 900; color: #e8472a;
          text-shadow: 0 0 16px rgba(232,71,42,0.8), 0 0 4px rgba(232,71,42,0.4);
          overflow: hidden;
        }
        .crest-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        /* ── TITLE ── */
        .title-eyebrow {
          font-family: 'Noto Serif JP', serif;
          font-size: 10px; font-weight: 400;
          color: rgba(210,100,70,0.7);
          letter-spacing: 7px; text-transform: uppercase;
          margin-bottom: 7px; text-align: center;
        }
        .title-main {
          font-family: 'Cinzel Decorative', serif;
          font-size: 24px; font-weight: 700; color: #f7ead8;
          letter-spacing: 3px; text-align: center;
          margin-bottom: 5px;
          text-shadow: 0 0 40px rgba(210,90,50,0.45), 0 2px 4px rgba(0,0,0,0.8);
        }
        .title-sub {
          font-family: 'IM Fell English', serif;
          font-size: 12px; font-style: italic;
          color: rgba(210,175,150,0.55);
          letter-spacing: 1.5px; margin-bottom: 10px; text-align: center;
        }

        /* ── DIVIDER ── */
        .div-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; width: 280px; }
        .div-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(190,130,230,0.55), transparent); }
        .div-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(190,130,230,0.6); box-shadow: 0 0 6px rgba(190,130,230,0.5); }
        .div-kanji { font-family: 'Noto Serif JP', serif; font-size: 13px; color: rgba(190,130,230,0.65); }

        /* ── LINK CARDS ── */
        .links-stack { width: 100%; display: flex; flex-direction: column; gap: 10px; }

        .lcard {
          display: flex; align-items: stretch;
          text-decoration: none; border-radius: 8px; overflow: hidden;
          position: relative;
          background: rgba(8,4,8,0.68);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.22s cubic-bezier(.23,1,.32,1), box-shadow 0.25s, border-color 0.25s;
          cursor: pointer;
        }
        .lcard:hover { transform: translateX(6px) translateY(-1px); }

        /* Shimmer sweep on hover */
        .lcard::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none; border-radius: 8px;
        }
        .lcard:hover::after { opacity: 1; }

        .lcard-bar { width: 3px; flex-shrink: 0; }

        .lcard-kanji {
          width: 56px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
        }
        .lcard-kanji-text {
          font-family: 'Noto Serif JP', serif;
          font-size: 26px; font-weight: 900;
          line-height: 1; position: relative; z-index: 1;
          transition: text-shadow 0.25s;
        }
        .lcard:hover .lcard-kanji-text { filter: brightness(1.2); }

        .lcard-body { flex: 1; padding: 12px 16px; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .lcard-form {
          font-family: 'Cinzel', serif;
          font-size: 8px; letter-spacing: 2.5px; text-transform: uppercase;
          opacity: 0; transform: translateY(-4px);
          transition: opacity 0.25s, transform 0.25s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .lcard:hover .lcard-form { opacity: 0.55; transform: translateY(0); }
        .lcard-breathing {
          font-family: 'Cinzel', serif;
          font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
          opacity: 0.6; margin-bottom: 2px;
        }
        .lcard-title {
          font-family: 'IM Fell English', serif;
          font-size: 14px; color: #ede0d0;
          letter-spacing: 0.3px; line-height: 1.3;
        }

        .lcard-icon {
          width: 48px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.4; transition: opacity 0.22s, transform 0.22s;
        }
        .lcard:hover .lcard-icon { opacity: 1; transform: scale(1.15); }

        .lcard-sep {
          position: absolute; right: 48px; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(transparent, rgba(255,255,255,0.07), transparent);
        }

        /* ── FOOTER ── */
        .ds-footer { margin-top: 44px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .footer-kanji {
          font-family: 'Noto Serif JP', serif;
          font-size: 32px; font-weight: 900;
          color: transparent;
          background: linear-gradient(135deg, rgba(210,90,50,0.15), rgba(100,50,150,0.1));
          -webkit-background-clip: text; background-clip: text;
          letter-spacing: 20px; text-align: center;
          filter: drop-shadow(0 0 12px rgba(210,90,50,0.15));
        }
        .footer-rule { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, rgba(210,90,50,0.25), transparent); }
        .footer-text {
          font-family: 'Cinzel', serif;
          font-size: 9px; color: rgba(210,160,130,0.25);
          letter-spacing: 4px; text-transform: uppercase;
        }

        /* ── SCAN LINE ── faint CRT feel */
        .ds-scanlines {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px
          );
        }

        /* ── SEO HIDDEN TEXT ── */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>

      <div className="ds-root">
        {/* 🚀 HIDDEN SEO TEXT UNTUK GOOGLE CRAWLER */}
        <div className="sr-only">
          <h1>Profil Resmi Y2L (Yonatan Yusak Lestari)</h1>
          <p>
            Selamat datang di hub resmi Y2L, juga dikenal sebagai Natan, Yali, Nat, atau Tan. 
            Saya adalah seorang Streamer Valorant Indonesia (Ex-Immo 2) yang aktif membagikan gameplay, 
            tips, dan membuka sesi mabar. Di luar gaming, saya adalah seorang Data Analyst dan 
            Data Practitioner yang fokus pada SQL, Python, dan arsitektur data.
          </p>
          <h2>Streamer Valo & Tech Content Creator</h2>
          <p>
            Temukan setup PC terbaik, optimasi hardware monitor 390Hz, dan IEM Antigravity untuk Valorant. 
            Bergabunglah dengan komunitas Discord Havefun Party, ikuti siaran langsung di YouTube dan TikTok.
          </p>
        </div>
        {/* Background layers */}
        <div className="ds-overlay-1" />
        <div className="ds-overlay-2" />
        <div className="ds-overlay-3" />
        <div className="ds-pattern" />
        <div className="ds-scanlines" />

        {/* Embers rising from bottom */}
        {mounted && embers.map((e, i) => <Ember key={i} {...e} />)}

        {/* Wisteria petals falling */}
        {mounted && petals.map((p, i) => <Petal key={i} {...p} />)}

        {/* Optional side character */}
        {USE_CHAR && (
          <motion.img src={CHAR_IMAGE} alt="" className="ds-char"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
        )}

        <div className="ds-content">

          {/* ── CREST ── */}
          <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.23,1,0.32,1] }}>
            <div className="crest-wrap">
              <motion.div className="crest-spin" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="crest-spin-2" animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
              <div className="crest-tri" />
              <div className="crest-face">
                {
                  <img src="/profile.jpg" className="crest-photo" alt="Y2L | YALI | Natan" />
                }
              </div>
            </div>
          </motion.div>

          {/* ── TITLE ── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.55, ease: [0.23,1,0.32,1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="title-eyebrow">鬼殺隊 · Demon Slayer Corps</p>
            <h1 className="title-main">Y2L | YALI | NATAN</h1>
            <p className="title-sub">Ex-Immortal II · Valorant &amp; Tech Creator</p>
          </motion.div>

          {/* ── WISTERIA DIVIDER ── */}
          <motion.div className="div-wrap" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.45, duration: 0.5 }}>
            <div className="div-line" />
            <div className="div-dot" />
            <span className="div-kanji">藤ノ花</span>
            <div className="div-dot" />
            <div className="div-line" />
          </motion.div>

          {/* ── LINK CARDS ── */}
          <div className="links-stack">
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lcard"
                initial={{ opacity: 0, x: -35, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.55 + i * 0.09, duration: 0.45, ease: [0.23,1,0.32,1] }}
                whileTap={{ scale: 0.975 }}
                style={{ borderColor: hoveredIndex === i ? link.color.accent : link.color.border }}
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  const el = document.querySelectorAll('.lcard')[i] as HTMLElement;
                  if (el) el.style.boxShadow = `0 4px 28px ${link.color.glow}, 0 0 0 1px ${link.color.border}, inset 0 0 40px ${link.color.soft}`;
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  const el = document.querySelectorAll('.lcard')[i] as HTMLElement;
                  if (el) el.style.boxShadow = 'none';
                }}
              >
                {/* Color bar */}
                <div className="lcard-bar" style={{ background: `linear-gradient(to bottom, ${link.color.accent}, ${link.color.accent}88)`, boxShadow: `0 0 10px ${link.color.accent}` }} />

                {/* Kanji */}
                <div className="lcard-kanji" style={{ background: link.color.bg }}>
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 0.07, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Noto Serif JP', fontSize: '52px', fontWeight: 900, color: link.color.accent }} >
                        {link.kanji}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="lcard-kanji-text" style={{ color: link.color.accent, textShadow: hoveredIndex === i ? `0 0 20px ${link.color.accent}, 0 0 8px ${link.color.accent}` : `0 0 10px ${link.color.accent}88` }}>
                    {link.kanji}
                  </span>
                </div>

                {/* Text body */}
                <div className="lcard-body">
                  <span className="lcard-form" style={{ color: link.color.accent }}>{link.form}</span>
                  <span className="lcard-breathing" style={{ color: link.color.accent }}>{link.subtitle}</span>
                  <span className="lcard-title">{link.title}</span>
                </div>

                {/* Icon */}
                <div className="lcard-icon" style={{ color: link.color.accent }}>
                  {link.icon}
                </div>

                <div className="lcard-sep" />
              </motion.a>
            ))}
          </div>

          {/* ── FOOTER ── */}
          <motion.div className="ds-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            <div className="footer-kanji">滅　鬼</div>
            <div className="footer-rule" />
            <p className="footer-text">Demon Slayer Corps · All Platforms</p>
          </motion.div>

        </div>
      </div>
    </>
  );
}