'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Portfolio sections
import { Nav }          from '../components/portfolio/Nav';
import { Hero }         from '../components/portfolio/Hero';
import { SelectedWork } from '../components/portfolio/SelectedWork';
import { UpcomingWork } from '../components/portfolio/UpcomingWork';
import { HowIBuild }    from '../components/portfolio/HowIBuild';
import { Tools }        from '../components/portfolio/Tools';
import { About }        from '../components/portfolio/About';
import { Contact }      from '../components/portfolio/Contact';

// ArchitecturalCanvas — client-only (Three.js needs browser DOM)
const ArchitecturalCanvas = dynamic(
  () => import('../components/3d/ArchitecturalCanvas').then((m) => m.ArchitecturalCanvas),
  { ssr: false }
);

const FORMATION_DURATION = 3800; // ms — matches FORMATION_MS in ArchitecturalCanvas.tsx

// ── Opening formation screen ──────────────────────────────────────────────────
function OpeningScreen({
  progress,
  orbitProgress,
}: {
  progress: number;
  orbitProgress: number;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#f7f6f3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      {/* Full-screen Three.js canvas with realistic materials and orbit */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArchitecturalCanvas progress={progress} orbitProgress={orbitProgress} />
      </div>

      {/* Minimal progress indicator — bottom center */}
      <div style={{
        position: 'absolute', bottom: 36,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
        fontSize: 10, letterSpacing: '0.15em', color: '#aaa',
        opacity: progress > 0.04 && orbitProgress === 0 ? 0.7 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        <span>{Math.round(progress * 100).toString().padStart(3, '0')}%</span>
        <div style={{ width: 72, height: 1, background: '#e0ddd6', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: `${progress * 100}%`, height: '100%',
            background: '#2d4a3e',
          }} />
        </div>
        <span>FORMING</span>
      </div>
    </div>
  );
}

// ── Main Portfolio ────────────────────────────────────────────────────────────
function Portfolio() {
  return (
    <div style={{ background: '#f7f6f3', minHeight: '100vh' }}>
      <Nav />

      <main>
        <Hero />

        {/* Divider */}
        <div className="pf-divider"><div className="pf-divider-line" /></div>

        <About />

        {/* Divider */}
        <div className="pf-divider"><div className="pf-divider-line" /></div>

        <SelectedWork />

        {/* Divider */}
        <div className="pf-divider"><div className="pf-divider-line" /></div>

        <UpcomingWork />

        {/* Divider */}
        <div className="pf-divider"><div className="pf-divider-line" /></div>

        <HowIBuild />

        {/* Divider */}
        <div className="pf-divider"><div className="pf-divider-line" /></div>

        <Tools />
      </main>

      <Contact />
    </div>
  );
}

// ── Root page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [progress, setProgress]           = useState(0);
  const [orbitProgress, setOrbitProgress] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [fadeOut, setFadeOut]             = useState(false);
  const rafRef = useRef<number>(undefined);

  useEffect(() => {
    const start = Date.now();
    const HOLD_DURATION = 200; // 0.2s hold on completed mansion
    const ORBIT_DURATION = 4800; // 4.8s steady cinematic 270°-360° panoramic orbit

    const tick = () => {
      const now = Date.now();
      const elapsed = now - start;

      if (elapsed <= FORMATION_DURATION) {
        // Phase 1: Formation (~3.8s)
        const p = Math.min(1, elapsed / FORMATION_DURATION);
        setProgress(p);
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed <= FORMATION_DURATION + HOLD_DURATION) {
        // Phase 2: 0.2s Hold
        setProgress(1);
        setOrbitProgress(0);
        rafRef.current = requestAnimationFrame(tick);
      } else if (elapsed <= FORMATION_DURATION + HOLD_DURATION + ORBIT_DURATION) {
        // Phase 3: Smooth Cinematic Camera Orbit
        setProgress(1);
        const orbitElapsed = elapsed - (FORMATION_DURATION + HOLD_DURATION);
        const op = Math.min(1, orbitElapsed / ORBIT_DURATION);
        setOrbitProgress(op);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Phase 4: Final transition to portfolio
        setProgress(1);
        setOrbitProgress(1);
        setFadeOut(true);
        setTimeout(() => setShowPortfolio(true), 700);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <>
      {/* Opening: fades out after formation */}
      {!showPortfolio && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          opacity: fadeOut ? 0 : 1,
          transition: fadeOut ? 'opacity 0.7s ease' : 'none',
          pointerEvents: fadeOut ? 'none' : 'auto',
        }}>
          <OpeningScreen progress={progress} orbitProgress={orbitProgress} />
        </div>
      )}

      {/* Portfolio: fades in after opening exits */}
      {showPortfolio && (
        <div style={{
          opacity: 0,
          animation: 'fadeIn 0.6s ease forwards',
        }}>
          <Portfolio />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
