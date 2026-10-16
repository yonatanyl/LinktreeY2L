'use client';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

// ============================================================
// 🖼️ ASET VISUAL
const BG_IMAGE = '/sao-bc-bg.jpg';
const CHAR_IMAGE = '/side-character.png';
const USE_CHAR = true;
// ============================================================

type Faction = 'sao' | 'bc';

// ── Web Audio Synthesizer (Zero External Dependencies) ──
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext unavailable
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // AudioContext unavailable
    }
  }
}

const sfx = new SoundFX();

// ── Glyphs (SVG) ──
const SwordGlyph = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4 9.5 14.5" />
    <path d="M7 12.5 11.5 17" />
    <path d="M9 15 4.5 19.5" />
    <path d="M17 4h3v3" />
  </svg>
);

const CloverGlyph = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="12" cy="6.4" rx="2.9" ry="4.1" transform={`rotate(${a} 12 12)`} opacity="0.95" />
    ))}
    <circle cx="12" cy="12" r="1.6" fill="#05070f" />
  </svg>
);

const links: {
  title: string;
  url: string;
  faction: Faction;
  badge: string;
  skill: string;
  color: { bg: string; border: string; accent: string; glow: string; soft: string };
  icon: React.ReactNode;
}[] = [
  {
    title: 'Sociabuzz — Support Stream and Life',
    url: 'https://sociabuzz.com/yonatanyl/tribe',
    faction: 'bc',
    badge: '5-LEAF GRIMOIRE',
    skill: 'Spell · Support the Wizard King Run',
    color: {
      bg: 'rgba(242,193,78,0.12)',
      border: 'rgba(242,193,78,0.5)',
      accent: '#f2c14e',
      glow: 'rgba(242,193,78,0.45)',
      soft: 'rgba(242,193,78,0.12)',
    },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6 8 4 12 4 15a8 8 0 0 0 16 0c0-3-2-7-8-13z" />
      </svg>
    ),
  },
  {
    title: 'TikTok — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://tiktok.com/@y2lnatan',
    faction: 'sao',
    badge: 'SWORD SKILL · LV.1',
    skill: 'Skill · Vorpal Strike // Valorant Gameplay',
    color: {
      bg: 'rgba(79,216,255,0.12)',
      border: 'rgba(79,216,255,0.5)',
      accent: '#4fd8ff',
      glow: 'rgba(79,216,255,0.45)',
      soft: 'rgba(79,216,255,0.12)',
    },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    title: 'YouTube — Y2L | Yali Valorant Live Streaming 🔴',
    url: 'https://youtube.com/@y2lnatan',
    faction: 'bc',
    badge: 'CRIMSON FIRE MAGIC',
    skill: 'Spell · Crimson Lion Blaze // Highlight VODs',
    color: {
      bg: 'rgba(255,77,90,0.12)',
      border: 'rgba(255,77,90,0.5)',
      accent: '#ff4d5a',
      glow: 'rgba(255,77,90,0.45)',
      soft: 'rgba(255,77,90,0.12)',
    },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    title: 'Discord — Havefun Party',
    url: 'https://discord.gg/wAmn9hHngw',
    faction: 'sao',
    badge: 'GUILD PARTY HALL',
    skill: 'Skill · Starburst Stream // Community Voice',
    color: {
      bg: 'rgba(255,154,60,0.12)',
      border: 'rgba(255,154,60,0.5)',
      accent: '#ff9a3c',
      glow: 'rgba(255,154,60,0.45)',
      soft: 'rgba(255,154,60,0.12)',
    },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.074.036c-.211.374-.444.864-.608 1.25-1.845-.277-3.68-.277-5.487 0-.164-.394-.406-.876-.619-1.25a.07.07 0 0 0-.073-.036 19.74 19.74 0 0 0-4.885 1.515.065.065 0 0 0-.03.028C.533 9.045-.32 13.58.099 18.058c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.993.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.062.062 0 0 0-.031-.03z" />
      </svg>
    ),
  },
  {
    title: 'Instagram — Private',
    url: 'https://instagram.com/yonatanyl',
    faction: 'bc',
    badge: 'VERDANT WIND MAGIC',
    skill: 'Spell · Sylph Gale // Life & Behind The Scenes',
    color: {
      bg: 'rgba(62,224,143,0.12)',
      border: 'rgba(62,224,143,0.5)',
      accent: '#3ee08f',
      glow: 'rgba(62,224,143,0.45)',
      soft: 'rgba(62,224,143,0.12)',
    },
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// Deterministic particles
const cubes = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 17 + 6) % 100,
  size: 4 + (i % 3) * 2,
  delay: (i * 0.6) % 6,
  duration: 7 + (i % 3) * 1.5,
  drift: ((i % 5) - 2) * 12,
}));

const motes = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 13 + 11) % 100,
  size: 2 + (i % 3),
  delay: (i * 0.4) % 4,
  duration: 4 + (i % 3) * 1.2,
  drift: ((i % 7) - 3) * 12,
  rise: 220 + (i % 4) * 60,
  color: i % 3 === 0 ? '#3ee08f' : i % 3 === 1 ? '#f2c14e' : '#4fd8ff',
}));

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rootRef.current || isMobile) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, [isMobile]);

  const copyDiscord = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('https://discord.gg/wAmn9hHngw');
    sfx.playClick();
    setToastMsg('Link Discord Havefun Party berhasil disalin! 🚀');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const showFx = mounted && !reduceMotion;
  const cubeList = isMobile ? cubes.slice(0, 5) : cubes;
  const moteList = isMobile ? motes.slice(0, 8) : motes;

  const hexSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='97' viewBox='0 0 56 97'><g fill='none' stroke='rgba(79,216,255,0.85)' stroke-width='1'><path d='M28 2 54 17v30L28 62 2 47V17z' transform='translate(0 0)'/><path d='M28 62v30M2 47 -24 62M54 47l26 15'/></g></svg>`
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

        html, body {
          margin: 0; padding: 0;
          overflow: hidden;
          height: 100%; height: 100dvh;
          width: 100%;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --sao: #4fd8ff;
          --gold: #f2c14e;
          --crimson: #ff4d5a;
          --clover: #3ee08f;
          --ink: #04060c;
        }

        .sb-root {
          height: 100vh; height: 100dvh; max-height: 100vh;
          overflow: hidden;
          background-color: var(--ink);
          background-image: url('${BG_IMAGE}');
          background-size: cover; background-position: center 25%; background-repeat: no-repeat;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 8px 14px;
          position: relative;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Ambient Dynamic Cursor Spotlight */
        .sb-spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: radial-gradient(circle 450px at ${mousePos.x}% ${mousePos.y}%, rgba(79,216,255,0.08) 0%, transparent 80%);
          transition: background 0.15s ease-out;
        }

        /* Multi-layer atmospheric cinema gradients */
        .sb-sky {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 35% at 50% -5%, rgba(79,216,255,0.28) 0%, transparent 70%),
            radial-gradient(ellipse 50% 30% at 95% 90%, rgba(242,193,78,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 45% 25% at 5% 85%, rgba(255,77,90,0.15) 0%, transparent 70%),
            linear-gradient(180deg, rgba(8,16,32,0.45) 0%, rgba(5,9,18,0.72) 40%, rgba(4,6,12,0.92) 80%, rgba(3,4,8,0.98) 100%);
        }

        .sb-vignette {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 90% 100% at 50% 50%, transparent 40%, rgba(3,4,8,0.85) 100%);
        }

        .sb-hex {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.08;
          background-image: url("data:image/svg+xml;utf8,${hexSvg}");
          background-size: 56px 97px;
          mask-image: linear-gradient(to bottom, black 0%, transparent 75%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 75%);
        }

        .sb-scan {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(79,216,255,0.02) 3px, rgba(79,216,255,0.02) 4px);
        }

        /* ── HERO ARTWORK WITH DYNAMIC MANA AURA ── */
        .char-container {
          position: fixed; right: -10px; bottom: 0;
          height: 85vh; max-height: 85vh; max-width: 44vw;
          z-index: 2; pointer-events: none;
          display: flex; align-items: flex-end; justify-content: flex-end;
        }

        .char-aura-blue {
          position: absolute; width: 300px; height: 420px; right: 60px; top: 100px;
          background: radial-gradient(ellipse at center, rgba(79,216,255,0.35) 0%, transparent 70%);
          filter: blur(35px); border-radius: 50%; pointer-events: none;
        }
        .char-aura-red {
          position: absolute; width: 250px; height: 350px; right: 20px; bottom: 60px;
          background: radial-gradient(ellipse at center, rgba(255,77,90,0.30) 0%, transparent 70%);
          filter: blur(40px); border-radius: 50%; pointer-events: none;
        }

        .sb-char {
          position: relative; height: 100%; width: auto; object-fit: contain; object-position: bottom right;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%),
                              linear-gradient(to right, transparent 0%, black 30%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%),
                      linear-gradient(to right, transparent 0%, black 30%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
          opacity: 0.88;
          filter: drop-shadow(0 0 25px rgba(79,216,255,0.45));
          will-change: transform;
        }

        @media (max-width: 1024px) {
          .char-container {
            position: absolute; right: -30px; bottom: 0;
            height: 55vh; max-width: 60vw; opacity: 0.35; z-index: 1;
          }
          .sb-char { opacity: 0.35; filter: drop-shadow(0 0 15px rgba(79,216,255,0.25)); }
        }

        /* ── MAIN CONTENT CONTAINER ── */
        .sb-content {
          position: relative; z-index: 4; display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 480px;
        }

        /* Absolute Top Floating Bar */
        .top-bar-fixed {
          position: absolute; top: 10px; left: 14px; right: 14px;
          display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .sfx-btn {
          background: rgba(8,16,30,0.7); border: 1px solid rgba(79,216,255,0.4);
          color: var(--sao); font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 700;
          padding: 4px 10px; border-radius: 16px; cursor: pointer; display: flex; align-items: center; gap: 5px;
          backdrop-filter: blur(10px); transition: all 0.2s ease;
        }
        .sfx-btn:hover { background: rgba(79,216,255,0.2); border-color: var(--sao); box-shadow: 0 0 10px rgba(79,216,255,0.4); }

        .sys-badge {
          font-family: 'Orbitron', sans-serif; font-size: 8px; font-weight: 700; letter-spacing: 1.5px;
          color: rgba(242,193,78,0.9); background: rgba(242,193,78,0.12); border: 1px solid rgba(242,193,78,0.35);
          padding: 3px 8px; border-radius: 10px; backdrop-filter: blur(8px);
        }

        /* ── AVATAR PROFILE (COMPACT ONEPAGE) ── */
        .av-wrap { position: relative; width: 78px; height: 78px; margin-bottom: 6px; }
        .av-svg { position: absolute; inset: -5px; width: calc(100% + 10px); height: calc(100% + 10px); overflow: visible; }
        .av-hex { filter: drop-shadow(0 0 6px rgba(79,216,255,0.85)); }
        .av-magic { filter: drop-shadow(0 0 6px rgba(242,193,78,0.75)); }
        .av-face {
          position: absolute; inset: 7px; border-radius: 50%; overflow: hidden;
          background: radial-gradient(circle, #0e2038 0%, #050812 100%);
          border: 2px solid rgba(79,216,255,0.65);
          box-shadow: 0 0 18px rgba(79,216,255,0.35), inset 0 0 12px rgba(242,193,78,0.25);
        }
        .av-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        .av-verified {
          position: absolute; bottom: 2px; right: 2px; z-index: 5;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #f2c14e, #d89422);
          border: 1.5px solid #05070f; display: flex; align-items: center; justify-content: center;
          color: #05070f; box-shadow: 0 0 8px rgba(242,193,78,0.8);
        }

        /* Live Streamer Pulse Beacon */
        .live-beacon {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,77,90,0.15); border: 1px solid rgba(255,77,90,0.45);
          border-radius: 14px; padding: 2px 9px; margin-bottom: 4px;
          font-family: 'Orbitron', sans-serif; font-size: 7.5px; font-weight: 700; letter-spacing: 2px;
          color: #ff5e6c; text-shadow: 0 0 6px rgba(255,77,90,0.6);
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #ff4d5a;
          box-shadow: 0 0 6px #ff4d5a;
        }

        /* ── TITLE & TAGS ── */
        .t-main {
          font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 900; color: #ffffff;
          letter-spacing: 3px; text-align: center; margin-bottom: 2px; line-height: 1.1;
          text-shadow: 0 0 20px rgba(79,216,255,0.7), 0 2px 4px rgba(0,0,0,0.9);
        }
        .t-sub {
          font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 11.5px;
          color: #c9e6ff; letter-spacing: 1.8px; margin-bottom: 6px; text-align: center;
          text-transform: uppercase; line-height: 1.1;
        }

        .tag-row {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-bottom: 8px;
        }
        .tag-pill {
          font-family: 'Orbitron', sans-serif; font-size: 7.5px; font-weight: 700; letter-spacing: 1.2px;
          padding: 2px 7px; border-radius: 4px; background: rgba(10,18,34,0.65);
          border: 1px solid rgba(79,216,255,0.25); color: #a4dcff;
          backdrop-filter: blur(8px);
        }
        .tag-pill.gold { border-color: rgba(242,193,78,0.35); color: #f2c14e; }
        .tag-pill.red { border-color: rgba(255,77,90,0.35); color: #ff7681; }

        /* ── MMORPG STATUS HUD (COMPACT) ── */
        .hud-box {
          width: 100%; max-width: 320px; margin-bottom: 8px;
          background: rgba(7,14,28,0.72); border: 1px solid rgba(79,216,255,0.28);
          border-radius: 6px; padding: 5px 10px;
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 12px rgba(79,216,255,0.08);
        }
        .hud-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;
          font-family: 'Orbitron', sans-serif; font-size: 7.5px; letter-spacing: 1.5px; color: rgba(160,215,255,0.75);
        }
        .hud-header b { color: var(--gold); }

        .hud-row { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
        .hud-row:last-child { margin-bottom: 0; }
        .hud-label {
          font-family: 'Orbitron', sans-serif; font-size: 7.5px; font-weight: 700; width: 18px; letter-spacing: 1px;
        }
        .hud-track {
          flex: 1; height: 6px; border-radius: 2px; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12); position: relative; overflow: hidden;
        }
        .hud-fill { height: 100%; border-radius: 2px; transform-origin: left center; }
        .hud-hp {
          background: linear-gradient(90deg, #1fa864, #3ee08f, #84ffb8);
          box-shadow: 0 0 8px rgba(62,224,143,0.8);
        }
        .hud-mp {
          background: linear-gradient(90deg, #c78f1e, #f2c14e, #ffe9a8);
          box-shadow: 0 0 8px rgba(242,193,78,0.8);
        }
        .hud-val {
          font-family: 'Orbitron', sans-serif; font-size: 7.5px; font-weight: 600; width: 75px; text-align: right;
          letter-spacing: 0.5px; color: #e6f6ff;
        }

        /* ── DIVIDER ── */
        .dv { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; width: 220px; max-width: 100%; }
        .dv-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(79,216,255,0.7), rgba(242,193,78,0.7), transparent); }
        .dv-dia { width: 5px; height: 5px; transform: rotate(45deg); background: var(--sao); box-shadow: 0 0 6px var(--sao); }
        .dv-dia.gold { background: var(--gold); box-shadow: 0 0 6px var(--gold); }
        .dv-clover { color: var(--gold); display: flex; filter: drop-shadow(0 0 6px rgba(242,193,78,0.8)); }

        /* ── NEXT-GEN LINK CARDS (COMPACT HEIGHT ~44PX) ── */
        .stack { width: 100%; display: flex; flex-direction: column; gap: 6px; }

        .lc-card {
          display: flex; align-items: stretch; text-decoration: none; position: relative;
          background: rgba(9, 16, 30, 0.82);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 9px; overflow: hidden;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          transition: transform 0.2s cubic-bezier(.23,1,.32,1), box-shadow 0.22s, border-color 0.22s, background 0.22s;
        }

        .lc-card::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.65;
          background: radial-gradient(circle 200px at 0% 50%, var(--soft), transparent 70%);
        }

        .lc-card::after {
          content: ''; position: absolute; top: -50%; bottom: -50%; width: 50%; left: -80%; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-25deg); opacity: 0;
        }

        .lc-card:hover {
          transform: translateX(5px) translateY(-1px);
          border-color: var(--accent);
          background: rgba(12, 22, 42, 0.92);
          box-shadow: 0 6px 24px var(--glow), 0 0 0 1px var(--accent), inset 0 0 18px var(--soft);
        }
        .lc-card:hover::after {
          opacity: 1; left: 140%; transition: left 0.6s ease-out, opacity 0.2s;
        }

        .lc-bar {
          width: 3.5px; flex-shrink: 0;
          background: linear-gradient(to bottom, var(--accent), color-mix(in srgb, var(--accent) 30%, transparent));
          box-shadow: 0 0 10px var(--accent);
        }

        .lc-badge {
          width: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden;
          background: var(--bg);
        }
        .lc-badge-inner {
          position: relative; z-index: 2; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          color: var(--accent); border-radius: 6px;
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          border: 1px solid var(--accent);
          filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 70%, transparent));
          transition: transform 0.22s, filter 0.22s;
        }
        .lc-card:hover .lc-badge-inner {
          transform: scale(1.1); filter: drop-shadow(0 0 10px var(--accent));
        }

        .lc-body {
          flex: 1; padding: 6px 10px; display: flex; flex-direction: column; justify-content: center; gap: 1px;
          min-width: 0; position: relative; z-index: 2;
        }
        .lc-meta {
          display: flex; align-items: center; gap: 5px; line-height: 1;
        }
        .lc-badge-tag {
          font-family: 'Orbitron', sans-serif; font-size: 7px; font-weight: 700; letter-spacing: 1px;
          padding: 1px 5px; border-radius: 3px; color: var(--accent);
          background: color-mix(in srgb, var(--accent) 16%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
          text-transform: uppercase;
        }
        .lc-skill {
          font-family: 'Rajdhani', sans-serif; font-size: 9.5px; font-weight: 600;
          color: rgba(180,225,255,0.65); letter-spacing: 0.3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .lc-title {
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; color: #ffffff;
          letter-spacing: 0.2px; line-height: 1.2;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .lc-action {
          width: 38px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 2px; color: var(--accent); opacity: 0.7; position: relative; z-index: 2;
          transition: opacity 0.2s, transform 0.2s;
        }
        .lc-card:hover .lc-action {
          opacity: 1; transform: scale(1.08);
        }
        .lc-arrow {
          font-size: 10px; font-weight: 900; opacity: 0; transform: translateX(-4px);
          transition: all 0.2s ease;
        }
        .lc-card:hover .lc-arrow {
          opacity: 1; transform: translateX(0);
        }

        /* ── QUICK DISCORD BUTTON (COMPACT) ── */
        .discord-btn {
          width: 100%; margin-top: 6px;
          background: rgba(255,154,60,0.12);
          border: 1px dashed rgba(255,154,60,0.5);
          border-radius: 8px;
          padding: 6px 12px;
          color: #ffaa54;
          font-family: 'Orbitron', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s ease;
        }
        .discord-btn:hover {
          background: rgba(255,154,60,0.22); border-color: #ffaa54;
          box-shadow: 0 0 14px rgba(255,154,60,0.4);
        }

        /* ── FOOTER (COMPACT ONEPAGE) ── */
        .ft { margin-top: 8px; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .ft-title {
          font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 900; letter-spacing: 8px; text-align: center;
          padding-left: 8px; line-height: 1;
          background: linear-gradient(90deg, #4fd8ff, #f2c14e, #ff4d5a); -webkit-background-clip: text; background-clip: text;
          color: transparent; filter: drop-shadow(0 0 10px rgba(79,216,255,0.4));
        }
        .ft-rule { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, rgba(242,193,78,0.5), transparent); }
        .ft-quote { font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 10.5px; color: rgba(242,193,78,0.75); letter-spacing: 1.5px; text-transform: uppercase; line-height: 1; }
        .ft-text { font-family: 'Orbitron', sans-serif; font-size: 7.5px; color: rgba(160,210,235,0.4); letter-spacing: 3px; text-transform: uppercase; line-height: 1; }

        /* Floating Toast */
        .toast {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: rgba(8,16,32,0.92); border: 1px solid var(--sao);
          box-shadow: 0 0 20px rgba(79,216,255,0.5);
          color: #ffffff; padding: 7px 18px; border-radius: 20px;
          font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12.5px;
          letter-spacing: 0.8px; z-index: 100; backdrop-filter: blur(16px);
          display: flex; align-items: center; gap: 6px;
        }

        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      `}</style>

      <div className="sb-root" ref={rootRef} onMouseMove={handleMouseMove}>
        {/* SEO Hidden text */}
        <div className="sr-only">
          <h1>Profil Resmi Y2L (Yonatan Yusak Lestari)</h1>
          <p>Streamer Valorant Indonesia (Ex-Immo 2), Data Analyst, dan Tech Creator. Join Havefun Party Discord!</p>
        </div>

        {/* Dynamic Spotlight */}
        <div className="sb-spotlight" />

        {/* Cinematic Backdrop layers */}
        <div className="sb-sky" />
        <div className="sb-hex" />
        <div className="sb-vignette" />
        <div className="sb-scan" />

        {/* Particles */}
        {showFx &&
          cubeList.map((c, i) => (
            <motion.div
              key={`c${i}`}
              style={{
                position: 'absolute',
                bottom: '-2%',
                left: `${c.x}%`,
                width: c.size,
                height: c.size,
                border: '1px solid rgba(79,216,255,0.8)',
                background: 'rgba(79,216,255,0.15)',
                boxShadow: '0 0 8px rgba(79,216,255,0.6)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
              animate={{ y: ['0vh', '-105vh'], x: [0, c.drift], rotate: [0, 180], opacity: [0, 0.95, 0.95, 0] }}
              transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}

        {showFx &&
          moteList.map((m, i) => (
            <motion.div
              key={`m${i}`}
              style={{
                position: 'absolute',
                bottom: 0,
                left: `${m.x}%`,
                width: m.size,
                height: m.size,
                borderRadius: '50%',
                background: m.color,
                boxShadow: `0 0 8px 1px ${m.color}`,
                pointerEvents: 'none',
                zIndex: 2,
              }}
              animate={{ y: [0, -m.rise], x: [0, m.drift], opacity: [0, 1, 0], scale: [0.5, 1.1, 0.2] }}
              transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}

        {/* Absolute Top Floating Bar */}
        <div className="top-bar-fixed">
          <span className="sys-badge">⚡ AINCRAD × CLOVER HUD</span>
          <button
            className="sfx-btn"
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              sfx.enabled = next;
              if (next) sfx.playClick();
            }}
            title="Toggle Sound Effects"
          >
            <span>{audioEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF'}</span>
          </button>
        </div>

        {/* ── SIDE HERO ARTWORK WITH GENTLE FLOATING & MANA AURAS ── */}
        {USE_CHAR && (
          <div className="char-container">
            <motion.div
              className="char-aura-blue"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="char-aura-red"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src={CHAR_IMAGE}
              alt="Y2L Character"
              className="sb-char"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: isMobile ? 0.35 : 0.88, x: 0, y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 1.2 },
                x: { duration: 1.2 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </div>
        )}

        {/* ── MAIN CONTENT (PERFECT ONEPAGE) ── */}
        <div className="sb-content">
          {/* ── AVATAR PROFILE ── */}
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
            <div className="av-wrap">
              {/* Outer Golden Clover Rune Ring */}
              <motion.svg
                className="av-svg av-magic"
                viewBox="0 0 100 100"
                fill="none"
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="50" cy="50" r="47" stroke="rgba(242,193,78,0.7)" strokeWidth="1" strokeDasharray="4 6" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={50 + 47 * Math.cos((a * Math.PI) / 180)} cy={50 + 47 * Math.sin((a * Math.PI) / 180)} r="2.5" fill="#f2c14e" />
                ))}
              </motion.svg>

              {/* Inner Cyan Hexagon Cyber Ring */}
              <motion.svg
                className="av-svg av-hex"
                viewBox="0 0 100 100"
                fill="none"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                <polygon points="50,2 91.6,26 91.6,74 50,98 8.4,74 8.4,26" stroke="rgba(79,216,255,0.9)" strokeWidth="1.6" strokeDasharray="8 5" />
              </motion.svg>

              <div className="av-face">
                <img src="/profile.jpg" className="av-photo" alt="Y2L | YALI | Natan" />
              </div>

              {/* Verified Shield Badge */}
              <div className="av-verified" title="Verified Creator">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Live Indicator */}
          <div className="live-beacon">
            <span className="live-dot" />
            <span>LIVE STREAMER &amp; ANALYST</span>
          </div>

          {/* ── TITLE & TAGS ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }} style={{ textAlign: 'center' }}>
            <h1 className="t-main">Y2L | YALI | NATAN</h1>
            <p className="t-sub">Ex-Immortal II · Valorant &amp; Tech Creator</p>

            <div className="tag-row">
              <span className="tag-pill">⚔️ EX-IMMO 2</span>
              <span className="tag-pill gold">📊 DATA ANALYST</span>
              <span className="tag-pill red">⚡ 390Hz SETUP</span>
            </div>
          </motion.div>

          {/* ── MMORPG STATUS HUD (COMPACT HP & MP) ── */}
          <motion.div className="hud-box" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
            <div className="hud-header">
              <span>PLAYER: <b>Y2L_NATAN</b></span>
              <span>LEVEL: <b>LV. 99</b></span>
              <span>MANA: <b>MAX</b></span>
            </div>

            <div className="hud-row">
              <span className="hud-label" style={{ color: '#3ee08f' }}>HP</span>
              <div className="hud-track">
                <motion.div
                  className="hud-fill hud-hp"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
              <span className="hud-val" style={{ color: '#84ffb8' }}>9,999 / 9,999</span>
            </div>

            <div className="hud-row">
              <span className="hud-label" style={{ color: '#f2c14e' }}>MP</span>
              <div className="hud-track">
                <motion.div
                  className="hud-fill hud-mp"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.92 }}
                  transition={{ delay: 0.55, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
              <span className="hud-val" style={{ color: '#ffe9a8' }}>5,420 / 5,420</span>
            </div>
          </motion.div>

          {/* ── DIVIDER ── */}
          <motion.div className="dv" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.35, duration: 0.4 }}>
            <div className="dv-line" />
            <div className="dv-dia" />
            <span className="dv-clover"><CloverGlyph size={15} /></span>
            <div className="dv-dia gold" />
            <div className="dv-line" />
          </motion.div>

          {/* ── LINK CARDS (5 ITEMS) ── */}
          <div className="stack">
            {links.map((link, i) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lc-card"
                style={{
                  '--accent': link.color.accent,
                  '--border': link.color.border,
                  '--glow': link.color.glow,
                  '--soft': link.color.soft,
                  '--bg': link.color.bg,
                } as React.CSSProperties}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => sfx.playHover()}
                onClick={() => sfx.playClick()}
              >
                {/* Neon Accent Bar */}
                <div className="lc-bar" />

                {/* Left Badge with Icon */}
                <div className="lc-badge">
                  <div className="lc-badge-inner">
                    {link.faction === 'sao' ? <SwordGlyph size={16} /> : <CloverGlyph size={16} />}
                  </div>
                </div>

                {/* Card Content */}
                <div className="lc-body">
                  <div className="lc-meta">
                    <span className="lc-badge-tag">{link.badge}</span>
                    <span className="lc-skill">{link.skill}</span>
                  </div>
                  <span className="lc-title">{link.title}</span>
                </div>

                {/* Right Action */}
                <div className="lc-action">
                  <div>{link.icon}</div>
                  <span className="lc-arrow">➜</span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Quick Discord Copy Button */}
          <motion.button
            onClick={copyDiscord}
            className="discord-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onMouseEnter={() => sfx.playHover()}
          >
            <span>📋 SALIN LINK DISCORD HAVEFUN PARTY</span>
          </motion.button>

          {/* ── FOOTER ── */}
          <motion.div className="ft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <div className="ft-title">LINK START</div>
            <div className="ft-rule" />
            <p className="ft-quote">Never give up · Surpass your limits</p>
            <p className="ft-text">Aincrad × Clover Kingdom // All Platforms</p>
          </motion.div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <span>✨</span>
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
