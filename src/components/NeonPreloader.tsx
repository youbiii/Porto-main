import { useEffect, useState } from "react";
import type React from "react";

type LoadingProps = {
  /** Durasi animasi intro dalam milidetik. */
  duration?: number;
  onComplete?: () => void;
  /** Teks kecil di tengah lingkaran. */
  name?: string;
};

const SYMBOLS = [
  "✦", "⌁", "◇", "✧", "⊙", "△", "⌘", "✳",
  "＋", "◈", "↗", "⊕", "⋆", "□", "⟡", "✣",
  "∿", "▽", "✴", "⦿", "／", "⌖", "✺", "⟢",
  "◌", "⊹", "⧫", "✢", "⌬", "◍", "⟐", "✷",
];

// Fixed pseudo-random positions keep the composition stable between renders.
const PARTICLES = SYMBOLS.map((symbol, index) => ({
  symbol,
  angle: (index * 137.508 + (index % 3) * 19) % 360,
  radius: 30 + ((index * 17 + 11) % 38),
  size: 7 + ((index * 13 + 3) % 8),
  delay: ((index * 23) % 110) / 100,
  red: index % 5 === 0 || index % 7 === 0,
}));

export default function Loading({
  duration = 5000,
  onComplete,
  name = "PORTFOLIO — Ici",
}: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const tick = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;
      const ratio = Math.min(elapsed / duration, 1);
      setProgress(Math.floor(ratio * 100));
      if (ratio < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        finishTimer = setTimeout(() => {
          setLeaving(true);
          finishTimer = setTimeout(() => onComplete?.(), 650);
        }, 120);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [duration, onComplete]);

  return (
    <div className={`video-loader${leaving ? " video-loader--out" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${progress}%`}>
      <style>{`
        .video-loader {
          --bg: #030303;
          position: fixed; inset: 0; z-index: 99999; overflow: hidden;
          display: grid; place-items: center; background: var(--bg); color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
          opacity: 1; visibility: visible;
          transition: opacity .65s ease, visibility .65s ease;
          isolation: isolate;
        }
        .video-loader * { box-sizing: border-box; }
        .video-loader--out { opacity: 0; visibility: hidden; pointer-events: none; }
        .video-loader__scene {
          position: relative; width: min(82vmin, 680px); aspect-ratio: 1;
          display: grid; place-items: center;
          transform: scale(.015); opacity: 0;
          animation: vl-expand 4.5s cubic-bezier(.16,1,.3,1) forwards;
        }
        .video-loader__ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.07);
          inset: 5%; transform: scale(.05); animation: vl-ring 3.8s cubic-bezier(.16,1,.3,1) forwards;
        }
        .video-loader__ring:nth-child(2) { inset: 14%; border-style: dotted; border-color: rgba(255,255,255,.1); animation-delay: .12s; }
        .video-loader__ring:nth-child(3) { inset: 24%; border-color: rgba(255,255,255,.08); animation-delay: .24s; }
        .video-loader__ring:nth-child(4) { inset: 34%; border-style: dashed; border-color: rgba(255,255,255,.1); animation-delay: .36s; }
        .video-loader__symbols { position: absolute; inset: 0; animation: vl-rotate 100s linear infinite; }
        .video-loader__symbol {
          position: absolute; left: 50%; top: 50%; display: grid; place-items: center;
          width: 18px; height: 18px; margin: -9px 0 0 -9px;
          font-size: var(--size); line-height: 1; font-weight: 400;
          color: rgba(245,245,245,.9); opacity: 0;
          transform: rotate(var(--angle)) translateY(calc(0px - var(--radius))) rotate(calc(var(--angle) * -1)) scale(.1);
          animation: vl-symbol-in .9s cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: calc(.25s + var(--delay) * 1s);
          text-shadow: 0 0 9px rgba(255,255,255,.16);
        }
        .video-loader__symbol--red { color: #d92727; text-shadow: 0 0 10px rgba(217,39,39,.25); }
        .video-loader__center {
          z-index: 2; position: relative; max-width: 55%; text-align: center;
          color: rgba(255,255,255,.72); font-size: clamp(6px, .75vmin, 9px);
          font-weight: 400; letter-spacing: .11em; text-transform: uppercase;
          opacity: 0; animation: vl-center-in 1s ease forwards; animation-delay: .7s;
        }
        .video-loader__center::after {
          content: ""; display: block; width: 13px; height: 1px;
          margin: 9px auto 0; background: #d92727; opacity: .8;
        }
        .video-loader__progress {
          position: absolute; left: 50%; bottom: 8%; transform: translateX(-50%);
          width: min(180px, 28vw); height: 1px; background: rgba(255,255,255,.12);
          opacity: .6; overflow: hidden;
        }
        .video-loader__bar { height: 100%; background: #d92727; transition: width .1s linear; }
        .video-loader--out .video-loader__scene { transform: scale(1.08); opacity: 0; transition: transform .65s ease, opacity .65s ease; animation: none; }
        @keyframes vl-expand {
          0% { transform: scale(.015); opacity: 0; filter: blur(5px); }
          16% { opacity: 1; filter: blur(0); }
          68% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes vl-ring {
          0% { transform: scale(.04); opacity: 0; }
          20% { opacity: .8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes vl-symbol-in {
          0% { opacity: 0; transform: rotate(var(--angle)) translateY(calc(0px - var(--radius) * .08)) rotate(calc(var(--angle) * -1)) scale(.1); }
          100% { opacity: 1; transform: rotate(var(--angle)) translateY(calc(0px - var(--radius))) rotate(calc(var(--angle) * -1)) scale(1); }
        }
        @keyframes vl-center-in { to { opacity: 1; } }
        @keyframes vl-rotate { to { transform: rotate(360deg); } }
        @media (max-width: 520px) {
          .video-loader__scene { width: 96vmin; }
          .video-loader__symbol { width: 15px; height: 15px; margin: -7.5px 0 0 -7.5px; }
          .video-loader__progress { bottom: 5%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .video-loader *, .video-loader *::before, .video-loader *::after {
            animation-duration: .01ms !important; animation-delay: 0ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="video-loader__scene" aria-hidden="true">
        <div className="video-loader__ring" />
        <div className="video-loader__ring" />
        <div className="video-loader__ring" />
        <div className="video-loader__ring" />
        <div className="video-loader__symbols">
          {PARTICLES.map((particle, index) => (
            <span
              key={`${particle.symbol}-${index}`}
              className={`video-loader__symbol${particle.red ? " video-loader__symbol--red" : ""}`}
              style={{
                "--angle": `${particle.angle}deg`,
                "--radius": `calc(min(41vmin, 340px) * ${particle.radius / 100})`,
                "--size": `${particle.size}px`,
                "--delay": `${particle.delay}`,
              } as React.CSSProperties}
            >
              {particle.symbol}
            </span>
          ))}
        </div>
        <div className="video-loader__center">{name}</div>
      </div>
      <div className="video-loader__progress" aria-label="Loading progress">
        <div className="video-loader__bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
