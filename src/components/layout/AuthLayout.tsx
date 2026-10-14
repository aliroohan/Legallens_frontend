import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout — Figma faithful split-screen layout
 * Left: Brand storytelling panel (sage #E5EBE5)
 * Right: Form panel (white/sage-light)
 */
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.root}>
      {/* Left: Brand panel */}
      <div className={styles.brandPanel} aria-hidden="true">
        <div className={styles.brandHeader}>
          {/* Logo mark */}
          <div className={styles.logoMark}>
            <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="15" cy="15" r="14" stroke="#2F4F2F" strokeWidth="2"/>
              <circle cx="15" cy="15" r="8" stroke="#2F4F2F" strokeWidth="1.5"/>
              <line x1="15" y1="1" x2="15" y2="29" stroke="#2F4F2F" strokeWidth="1.5"/>
              <line x1="1" y1="15" x2="29" y2="15" stroke="#2F4F2F" strokeWidth="1.5"/>
              <line x1="15" y1="29" x2="15" y2="36" stroke="#2F4F2F" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className={styles.brandName}>Legalens</span>
        </div>

        <div className={styles.brandHero}>
          <h1 className={styles.heroHeadline}>
            Truth<br />
            Needs<br />
            Evidence.
          </h1>
          <p className={styles.heroTagline}>Secure. Analyze. Present.</p>
          <p className={styles.heroSub}>Digital forensics for modern legal professionals.</p>
        </div>

        {/* Courthouse illustration (abstract scales of justice) */}
        <div className={styles.illustration} aria-hidden="true">
          <svg width="480" height="420" viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Pillars */}
            <rect x="80" y="200" width="20" height="180" fill="rgba(47,79,47,0.10)" rx="2"/>
            <rect x="120" y="200" width="20" height="180" fill="rgba(47,79,47,0.10)" rx="2"/>
            <rect x="340" y="200" width="20" height="180" fill="rgba(47,79,47,0.10)" rx="2"/>
            <rect x="380" y="200" width="20" height="180" fill="rgba(47,79,47,0.10)" rx="2"/>
            {/* Pediment */}
            <polygon points="60,200 240,120 420,200" fill="rgba(47,79,47,0.08)" />
            <line x1="60" y1="200" x2="420" y2="200" stroke="rgba(47,79,47,0.15)" strokeWidth="2"/>
            {/* Steps */}
            <rect x="50" y="380" width="380" height="12" fill="rgba(47,79,47,0.08)" rx="2"/>
            <rect x="60" y="370" width="360" height="10" fill="rgba(47,79,47,0.07)" rx="2"/>
            {/* Scales of justice */}
            <line x1="240" y1="155" x2="240" y2="270" stroke="rgba(47,79,47,0.25)" strokeWidth="2"/>
            <line x1="185" y1="200" x2="295" y2="200" stroke="rgba(47,79,47,0.25)" strokeWidth="2"/>
            <circle cx="240" cy="155" r="4" fill="rgba(47,79,47,0.3)"/>
            {/* Left pan */}
            <path d="M175 220 Q185 240 195 220" stroke="rgba(47,79,47,0.25)" strokeWidth="1.5" fill="none"/>
            <line x1="185" y1="200" x2="185" y2="220" stroke="rgba(47,79,47,0.2)" strokeWidth="1"/>
            {/* Right pan */}
            <path d="M285 228 Q295 248 305 228" stroke="rgba(47,79,47,0.25)" strokeWidth="1.5" fill="none"/>
            <line x1="295" y1="200" x2="295" y2="228" stroke="rgba(47,79,47,0.2)" strokeWidth="1"/>
            {/* Decorative dots */}
            <circle cx="100" cy="320" r="3" fill="rgba(47,79,47,0.12)"/>
            <circle cx="380" cy="300" r="5" fill="rgba(47,79,47,0.08)"/>
            <circle cx="240" cy="350" r="4" fill="rgba(47,79,47,0.10)"/>
          </svg>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          {children}
        </div>
      </div>
    </div>
  );
};
