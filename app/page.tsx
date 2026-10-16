'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ============================================================
// 🖼️  OPTIONAL: taruh gambar background sendiri di /public lalu isi path-nya
// (kosongkan '' = pakai background murni CSS/SVG, tanpa aset eksternal)
const BG_IMAGE = '/sao-bc-bg.jpg';
const CHAR_IMAGE = '/side-character.png';
const USE_CHAR = true;
// ============================================================

type Faction = 'sao' | 'bc';

// ── Glyphs (SVG original, bukan logo resmi) ──
const SwordGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4 9.5 14.5" />
    <path d="M7 12.5 11.5 17" />
    <path d="M9 15 4.5 19.5" />
    <path d="M17 4h3v3" />
  </svg>
);

const CloverGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="12" cy="6.4" rx="2.9" ry="4.1" transform={`rotate(${a} 12 12)`} opacity="0.9" />
    ))}
    <circle cx="12" cy="12" r="1.6" fill="#05070f" />
  </svg>
);

const links: {
  title: string; url: string; faction: Faction; tag: string; skill: string;
  color: { bg: string; border: string; accent: string; glow: string; soft: string };
  icon: React.ReactNode;
}[] = [
  {
    title: 'Sociabuzz — Support Stream and Life',
    url: 'https://sociabuzz.com/yonatanyl/tribe',
    faction: 'bc', tag: 'Grimoire · Mana Zone', skill: 'Spell · Support the Wizard King Run',
    color: { bg: 'rgba(242,193,78,0.10)', border: 'rgba(242,193,78,0.42)', accent: '#f2c14e', glow: 'rgba(242,193,78,0.32)', soft: 'rgba(242,193,78,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6 8 4 12 4 15a8 8 0 0 0 16 0c0-3-2-7-8-13z"/></svg>),
  },
  {
    title: 'TikTok — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://tiktok.com/@y2lnatan',
    faction: 'sao', tag: 'Sword Skill · Lv.1', skill: 'Skill · Vorpal Strike',
    color: { bg: 'rgba(79,216,255,0.10)', border: 'rgba(79,216,255,0.42)', accent: '#4fd8ff', glow: 'rgba(79,216,255,0.30)', soft: 'rgba(79,216,255,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>),
  },
  {
    title: 'YouTube — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://youtube.com/@y2lnatan',
    faction: 'bc', tag: 'Fire Magic · Crimson', skill: 'Spell · Crimson Lion Blaze',
    color: { bg: 'rgba(230,57,70,0.12)', border: 'rgba(230,57,70,0.45)', accent: '#ff4d5a', glow: 'rgba(230,57,70,0.32)', soft: 'rgba(230,57,70,0.08)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>),
  },
  {
    title: 'Discord — Havefun Party',
    url: 'https://discord.gg/wAmn9hHngw',
    faction: 'sao', tag: 'Party · Guild Hall', skill: 'Skill · Starburst Stream',
    color: { bg: 'rgba(255,154,60,0.11)', border: 'rgba(255,154,60,0.45)', accent: '#ff9a3c', glow: 'rgba(255,154,60,0.30)', soft: 'rgba(255,154,60,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.074.036c-.211.374-.444.864-.608 1.25-1.845-.277-3.68-.277-5.487 0-.164-.394-.406-.876-.619-1.25a.07.07 0 0 0-.073-.036 19.74 19.74 0 0 0-4.885 1.515.065.065 0 0 0-.03.028C.533 9.045-.32 13.58.099 18.058c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.993.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.062.062 0 0 0-.031-.03z"/></svg>),
  },
  {
    title: 'Instagram — Private',
    url: 'https://instagram.com/yonatanyl',
    faction: 'bc', tag: 'Wind Magic · Verdant', skill: 'Spell · Sylph Gale',
    color: { bg: 'rgba(62,224,143,0.10)', border: 'rgba(62,224,143,0.42)', accent: '#3ee08f', glow: 'rgba(62,224,143,0.28)', soft: 'rgba(62,224,143,0.07)' },
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>),
  },
];

// ── Deterministic particle data (aman untuk hydration) ──
const cubes = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 17 + 6) % 100,
  size: 5 + (i % 3) * 3,
  delay: (i * 0.7) % 8,
  duration: 9 + (i % 5) * 1.6,
  drift: ((i % 5) - 2) * 14,
}));

const motes = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 13 + 11) % 100,
  size: 2 + (i % 3),
  delay: (i * 0.45) % 6,
  duration: 5 + (i % 4) * 1.4,
  drift: ((i % 7) - 3) * 12,
  rise: 280 + (i % 5) * 70,
  color: i % 3 === 0 ? '#3ee08f' : i % 3 === 1 ? '#f2c14e' : '#ffe9a8',
}));

const leaves = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 31 + 9) % 100,
  duration: 11 + (i % 4) * 2,
  delay: (i * 1.9) % 12,
  size: 12 + (i % 3) * 4,
}));

function DataCube({ x, size, delay, duration, drift }: (typeof cubes)[number]) {
  return (
    <motion.div
      style={{
        position: 'absolute', bottom: '-3%', left: `${x}%`, width: size, height: size,
        border: '1px solid rgba(79,216,255,0.75)', background: 'rgba(79,216,255,0.12)',
        boxShadow: '0 0 8px rgba(79,216,255,0.55)', pointerEvents: 'none', zIndex: 2, willChange: 'transform, opacity',
      }}
      animate={{ y: ['0vh', '-105vh'], x: [0, drift], rotate: [0, 180], opacity: [0, 0.9, 0.9, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear', times: [0, 0.15, 0.8, 1] }}
    />
  );
}

function ManaMote({ x, size, delay, duration, drift, rise, color }: (typeof motes)[number]) {
  return (
    <motion.div
      style={{
        position: 'absolute', bottom: 0, left: `${x}%`, width: size, height: size, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px 1px ${color}`, pointerEvents: 'none', zIndex: 2, willChange: 'transform, opacity',
      }}
      animate={{ y: [0, -rise], x: [0, drift], opacity: [0, 1, 0], scale: [0.5, 1, 0.2] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

function CloverLeaf({ left, duration, delay, size }: (typeof leaves)[number]) {
  return (
    <motion.div
      style={{ position: 'absolute', top: '-4%', left: `${left}%`, color: 'rgba(62,224,143,0.45)', pointerEvents: 'none', zIndex: 2, willChange: 'transform, opacity' }}
      animate={{ y: '108vh', rotate: [0, 200, 360], x: [0, 28, -18, 8], opacity: [0, 0.8, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      <CloverGlyph size={size} />
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Kurangi partikel di mobile, matikan jika user minta reduced motion
  const showFx = mounted && !reduceMotion;
  const cubeList = isMobile ? cubes.slice(0, 6) : cubes;
  const moteList = isMobile ? motes.slice(0, 8) : motes;
  const leafList = isMobile ? leaves.slice(0, 3) : leaves;

  const hexSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='97' viewBox='0 0 56 97'><g fill='none' stroke='rgba(79,216,255,0.9)' stroke-width='1'><path d='M28 2 54 17v30L28 62 2 47V17z' transform='translate(0 0)'/><path d='M28 62v30M2 47 -24 62M54 47l26 15'/></g></svg>`
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@400;500;600;700&family=Uncial+Antiqua&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --sao: #4fd8ff;
          --gold: #f2c14e;
          --crimson: #ff4d5a;
          --clover: #3ee08f;
          --ink: #05070f;
        }

        .sb-root {
          min-height: 100vh; min-height: 100dvh;
          background-color: var(--ink);
          ${BG_IMAGE ? `background-image: url('${BG_IMAGE}');` : ''}
          background-size: cover; background-position: center 20%; background-repeat: no-repeat;
          display: flex; flex-direction: column; align-items: center;
          padding: 48px 18px 72px;
          position: relative; overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Langit Aincrad-ish di atas, kegelapan magis di bawah */
        .sb-sky {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 40% at 50% -5%, rgba(79,216,255,0.32) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 100% 100%, rgba(242,193,78,0.16) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 0% 95%, rgba(230,57,70,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 30% 25% at 85% 40%, rgba(62,224,143,0.07) 0%, transparent 70%),
            ${BG_IMAGE
              ? `linear-gradient(180deg, rgba(11,29,58,0.40) 0%, rgba(8,16,31,0.65) 35%, rgba(5,7,15,0.88) 70%, rgba(4,5,10,0.96) 100%);`
              : `linear-gradient(180deg, #0b1d3a 0%, #08101f 40%, #05070f 75%, #04050a 100%);`}
        }
        .sb-vignette {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 85% 100% at 50% 50%, transparent 45%, rgba(3,4,8,0.75) 100%);
        }
        /* Hex grid holografik, memudar ke bawah */
        .sb-hex {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.09;
          background-image: url("data:image/svg+xml;utf8,${hexSvg}");
          background-size: 56px 97px;
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 70%);
          mask-image: linear-gradient(to bottom, black 0%, transparent 70%);
        }
        /* Garis magic circle emas samar di bawah */
        .sb-rune {
          position: absolute; left: 50%; bottom: -260px; width: 620px; height: 620px; margin-left: -310px;
          z-index: 0; pointer-events: none; opacity: 0.07; color: var(--gold);
        }
        .sb-scan {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(79,216,255,0.025) 3px, rgba(79,216,255,0.025) 4px);
        }

        .sb-char {
          position: absolute; right: -20px; bottom: 0; height: 82%; max-width: 48%;
          object-fit: contain; object-position: bottom right; z-index: 1; pointer-events: none;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%),
                              linear-gradient(to right, transparent 0%, black 25%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%),
                      linear-gradient(to right, transparent 0%, black 25%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
          opacity: 0.45;
          filter: drop-shadow(0 0 16px rgba(79,216,255,0.3));
        }

        .sb-content { position: relative; z-index: 4; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 500px; }

        /* ── AVATAR ── */
        .av-wrap { position: relative; width: 112px; height: 112px; margin-bottom: 20px; }
        .av-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .av-hex { filter: drop-shadow(0 0 6px rgba(79,216,255,0.7)); transform-origin: 50% 50%; }
        .av-magic { filter: drop-shadow(0 0 6px rgba(242,193,78,0.6)); transform-origin: 50% 50%; }
        .av-face {
          position: absolute; inset: 20px; border-radius: 50%; overflow: hidden;
          background: radial-gradient(circle, #0c1a2e 0%, #05070f 100%);
          border: 1px solid rgba(79,216,255,0.35);
          box-shadow: 0 0 22px rgba(79,216,255,0.25), inset 0 0 14px rgba(242,193,78,0.12);
        }
        .av-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        /* ── TITLE ── */
        .t-eyebrow {
          font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 600;
          color: rgba(79,216,255,0.85); letter-spacing: 5px; text-transform: uppercase;
          margin-bottom: 8px; text-align: center;
          text-shadow: 0 0 12px rgba(79,216,255,0.6);
        }
        .t-eyebrow b { color: var(--gold); font-weight: 600; text-shadow: 0 0 12px rgba(242,193,78,0.55); }
        .t-main {
          font-family: 'Orbitron', sans-serif; font-size: 25px; font-weight: 800; color: #f4fbff;
          letter-spacing: 3px; text-align: center; margin-bottom: 6px;
          text-shadow: 0 0 28px rgba(79,216,255,0.55), 0 0 2px rgba(242,193,78,0.5), 0 2px 4px rgba(0,0,0,0.8);
        }
        .t-sub {
          font-family: 'Uncial Antiqua', serif; font-size: 12px;
          color: rgba(242,193,78,0.75); letter-spacing: 1.5px; margin-bottom: 14px; text-align: center;
        }

        /* HP / MP bar a la game UI */
        .bars { width: 220px; display: flex; flex-direction: column; gap: 5px; margin-bottom: 18px; }
        .bar-row { display: flex; align-items: center; gap: 8px; }
        .bar-label { font-family: 'Orbitron', sans-serif; font-size: 8px; letter-spacing: 2px; width: 18px; }
        .bar-track { flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; transform-origin: left center; }
        .bar-hp { background: linear-gradient(90deg, #3ee08f, #b8f56a); box-shadow: 0 0 8px rgba(62,224,143,0.7); }
        .bar-mp { background: linear-gradient(90deg, #f2c14e, #ffe9a8); box-shadow: 0 0 8px rgba(242,193,78,0.7); }

        /* ── DIVIDER ── */
        .dv { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; width: 280px; max-width: 100%; }
        .dv-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(79,216,255,0.6), rgba(242,193,78,0.6), transparent); }
        .dv-dia { width: 6px; height: 6px; transform: rotate(45deg); background: var(--sao); box-shadow: 0 0 8px var(--sao); }
        .dv-dia.gold { background: var(--gold); box-shadow: 0 0 8px var(--gold); }
        .dv-clover { color: var(--gold); display: flex; filter: drop-shadow(0 0 5px rgba(242,193,78,0.6)); }

        /* ── LINK CARDS ── */
        .stack { width: 100%; display: flex; flex-direction: column; gap: 10px; }

        .lc {
          display: flex; align-items: stretch; text-decoration: none; overflow: hidden; position: relative;
          background: rgba(6,10,20,0.72);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          /* sudut terpotong a la panel UI */
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.25s, border-color 0.25s, background 0.25s;
        }
        .lc.bc { border-radius: 10px; clip-path: none; }
        .lc.bc::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
          background: radial-gradient(ellipse 60% 120% at 0% 50%, var(--soft), transparent 70%);
        }
        .lc.sao::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(100deg, var(--soft), transparent 55%);
        }
        /* sweep cahaya saat hover */
        .lc::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: -50%; pointer-events: none;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.10), transparent);
          transform: skewX(-18deg); opacity: 0;
        }
        @media (hover: hover) {
          .lc:hover { border-color: var(--accent); box-shadow: 0 4px 28px var(--glow), inset 0 0 40px var(--soft); background: rgba(8,14,28,0.82); }
          .lc:hover::after { opacity: 1; left: 120%; transition: left 0.7s ease, opacity 0.2s; }
          .lc:hover .lc-skill { opacity: 0.85; transform: translateY(0); }
          .lc:hover .lc-icon { opacity: 1; transform: scale(1.15); }
          .lc:hover .lc-badge-inner { transform: rotate(0deg) scale(1.1); filter: drop-shadow(0 0 8px var(--accent)); }
          .lc:hover .lc-ghost { opacity: 0.09; transform: scale(1); }
        }
        .lc:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .lc-bar { width: 3px; flex-shrink: 0; background: linear-gradient(to bottom, var(--accent), color-mix(in srgb, var(--accent) 50%, transparent)); box-shadow: 0 0 10px var(--accent); }

        .lc-badge {
          width: 58px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.06); position: relative; overflow: hidden; background: var(--bg);
        }
        .lc-ghost {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          color: var(--accent); opacity: 0; transform: scale(1.8); transition: opacity 0.3s, transform 0.3s; pointer-events: none;
        }
        .lc-badge-inner {
          position: relative; z-index: 1; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
          color: var(--accent); transition: transform 0.3s, filter 0.3s;
          filter: drop-shadow(0 0 5px color-mix(in srgb, var(--accent) 60%, transparent));
        }
        /* SAO = hexagon, BC = lingkaran grimoire */
        .lc.sao .lc-badge-inner { clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); background: color-mix(in srgb, var(--accent) 16%, transparent); box-shadow: inset 0 0 0 1px var(--accent); transform: rotate(-8deg); }
        .lc.bc  .lc-badge-inner { border-radius: 50%; border: 1px dashed var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); transform: rotate(-12deg); }

        .lc-body { flex: 1; padding: 11px 14px; display: flex; flex-direction: column; gap: 2px; min-width: 0; position: relative; z-index: 1; }
        .lc-skill {
          font-family: 'Orbitron', sans-serif; font-size: 8px; letter-spacing: 1.8px; text-transform: uppercase;
          color: var(--accent); opacity: 0; transform: translateY(-4px); transition: opacity 0.25s, transform 0.25s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        @media (hover: none) { .lc-skill { opacity: 0.6; transform: none; } .lc-icon { opacity: 0.8; } }
        .lc-tag {
          font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 2.4px; text-transform: uppercase;
          color: var(--accent); opacity: 0.85; margin-bottom: 1px;
        }
        .lc.bc .lc-tag { font-family: 'Uncial Antiqua', serif; letter-spacing: 1.5px; text-transform: none; font-size: 10px; }
        .lc-title { font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 15.5px; color: #eaf6ff; letter-spacing: 0.3px; line-height: 1.25; }

        .lc-icon { width: 46px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--accent); opacity: 0.45; transition: opacity 0.22s, transform 0.22s; position: relative; z-index: 1; }

        /* ── FOOTER ── */
        .ft { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ft-title {
          font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 8px; text-align: center; padding-left: 8px;
          background: linear-gradient(90deg, #4fd8ff, #f2c14e); -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 10px rgba(79,216,255,0.25)); opacity: 0.85;
        }
        .ft-rule { width: 130px; height: 1px; background: linear-gradient(90deg, transparent, rgba(242,193,78,0.4), transparent); }
        .ft-quote { font-family: 'Uncial Antiqua', serif; font-size: 11px; color: rgba(242,193,78,0.5); letter-spacing: 1.5px; text-align: center; }
        .ft-text { font-family: 'Orbitron', sans-serif; font-size: 8px; color: rgba(160,210,235,0.38); letter-spacing: 4px; text-transform: uppercase; text-align: center; }

        @media (max-width: 380px) {
          .t-main { font-size: 21px; letter-spacing: 2px; }
          .lc-title { font-size: 14.5px; }
          .lc-badge { width: 52px; }
        }

        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      `}</style>

      <div className="sb-root">
        {/* 🚀 HIDDEN SEO TEXT UNTUK GOOGLE CRAWLER */}
        <div className="sr-only">
          <h1>Profil Resmi Y2L (Yonatan Yusak Lestari)</h1>
          <p>
            Selamat datang di hub resmi Y2L, juga dikenal sebagai Natan, Yali, Nat, atau Tan.
            Saya adalah seorang Streamer Valorant Indonesia (Ex-Immo 2) yang aktif membagikan gameplay,
            tips, dan membuka sesi mabar. Di luar gaming, saya adalah seorang Data Analyst dan
            Data Practitioner yang fokus pada SQL, Python, dan arsitektur data.
          </p>
          <h2>Streamer Valo &amp; Tech Content Creator</h2>
          <p>
            Temukan setup PC terbaik, optimasi hardware monitor 390Hz, dan IEM Antigravity untuk Valorant.
            Bergabunglah dengan komunitas Discord Havefun Party, ikuti siaran langsung di YouTube dan TikTok.
          </p>
        </div>

        {/* Background layers */}
        <div className="sb-sky" />
        <div className="sb-hex" />
        <svg className="sb-rune" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.6" aria-hidden="true">
          <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="82" strokeDasharray="2 4" />
          <polygon points="100,12 184,73 152,172 48,172 16,73" /><polygon points="100,188 16,127 48,28 152,28 184,127" />
          <circle cx="100" cy="100" r="30" />
        </svg>
        <div className="sb-vignette" />
        <div className="sb-scan" />

        {/* SAO data cubes naik + Black Clover mana motes & daun clover */}
        {showFx && cubeList.map((c, i) => <DataCube key={`c${i}`} {...c} />)}
        {showFx && moteList.map((m, i) => <ManaMote key={`m${i}`} {...m} />)}
        {showFx && leafList.map((l, i) => <CloverLeaf key={`l${i}`} {...l} />)}

        {USE_CHAR && (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img src={CHAR_IMAGE} alt="" className="sb-char"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
        )}

        <div className="sb-content">

          {/* ── AVATAR: ring hexagon SAO + lingkaran sihir clover ── */}
          <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
            <div className="av-wrap">
              <motion.svg className="av-svg av-hex" viewBox="0 0 100 100" fill="none"
                animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
                <polygon points="50,2 91.6,26 91.6,74 50,98 8.4,74 8.4,26" stroke="rgba(79,216,255,0.85)" strokeWidth="1.4" strokeDasharray="6 4" />
              </motion.svg>
              <motion.svg className="av-svg av-magic" viewBox="0 0 100 100" fill="none"
                animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
                <circle cx="50" cy="50" r="42" stroke="rgba(242,193,78,0.55)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="36" stroke="rgba(242,193,78,0.3)" strokeWidth="0.6" strokeDasharray="1.5 3" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <g key={a} transform={`rotate(${a} 50 50)`}>
                    <circle cx="50" cy="8" r="3.4" fill="#05070f" stroke="rgba(242,193,78,0.9)" strokeWidth="0.9" />
                    <circle cx="50" cy="8" r="1.1" fill="#f2c14e" />
                  </g>
                ))}
              </motion.svg>
              <div className="av-face">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/profile.jpg" className="av-photo" alt="Y2L | YALI | Natan" />
              </div>
            </div>
          </motion.div>

          {/* ── TITLE ── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="t-eyebrow">Link Start <b>✦</b> 5-Leaf Grimoire</p>
            <h1 className="t-main">Y2L | YALI | NATAN</h1>
            <p className="t-sub">Ex-Immortal II · Valorant &amp; Tech Creator</p>

            <div className="bars" aria-hidden="true">
              <div className="bar-row">
                <span className="bar-label" style={{ color: '#3ee08f' }}>HP</span>
                <div className="bar-track"><motion.div className="bar-fill bar-hp" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 1.1, ease: [0.23, 1, 0.32, 1] }} /></div>
              </div>
              <div className="bar-row">
                <span className="bar-label" style={{ color: '#f2c14e' }}>MP</span>
                <div className="bar-track"><motion.div className="bar-fill bar-mp" initial={{ scaleX: 0 }} animate={{ scaleX: 0.88 }} transition={{ delay: 0.85, duration: 1.1, ease: [0.23, 1, 0.32, 1] }} /></div>
              </div>
            </div>
          </motion.div>

          {/* ── DIVIDER ── */}
          <motion.div className="dv" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.45, duration: 0.5 }}>
            <div className="dv-line" />
            <div className="dv-dia" />
            <span className="dv-clover"><CloverGlyph size={16} /></span>
            <div className="dv-dia gold" />
            <div className="dv-line" />
          </motion.div>

          {/* ── LINK CARDS ── */}
          <div className="stack">
            {links.map((link, i) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`lc ${link.faction}`}
                style={{
                  '--accent': link.color.accent, '--border': link.color.border, '--glow': link.color.glow,
                  '--soft': link.color.soft, '--bg': link.color.bg,
                } as React.CSSProperties}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.09, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ x: 6, y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.975 }}
              >
                <div className="lc-bar" />

                <div className="lc-badge">
                  <div className="lc-ghost">
                    {link.faction === 'sao' ? <SwordGlyph size={48} /> : <CloverGlyph size={48} />}
                  </div>
                  <div className="lc-badge-inner">
                    {link.faction === 'sao' ? <SwordGlyph size={18} /> : <CloverGlyph size={20} />}
                  </div>
                </div>

                <div className="lc-body">
                  <span className="lc-skill">{link.skill}</span>
                  <span className="lc-tag">{link.tag}</span>
                  <span className="lc-title">{link.title}</span>
                </div>

                <div className="lc-icon">{link.icon}</div>
              </motion.a>
            ))}
          </div>

          {/* ── FOOTER ── */}
          <motion.div className="ft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            <div className="ft-title">LINK START</div>
            <div className="ft-rule" />
            <p className="ft-quote">Never give up · Beyond limits</p>
            <p className="ft-text">Aincrad × Clover Kingdom · All Platforms</p>
          </motion.div>

        </div>
      </div>
    </>
  );
}
