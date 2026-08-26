import { SectionCue } from './SectionCue';

interface HeroMetric {
  number: string;
  label: string;
  action?: string;
  href?: string;
}

const HERO_METRICS: HeroMetric[] = [
  {
    number: '06+',
    label: 'PROJECTS BUILT',
  },
  {
    number: '40+',
    label: 'TECHNOLOGIES USED',
    action: 'View full stack',
    href: '#tools',
  },
  {
    number: '02',
    label: 'CURRENT PROJECTS',
    action: 'View current research',
    href: '#upcoming',
  },
  {
    number: '5+',
    label: 'DOMAINS EXPLORED',
  },
];

export function Hero() {
  return (
    <section className="pf-hero pf-container" aria-label="Introduction">
      {/* Upper Identity & Context Block */}
      <div className="pf-hero-content">
        {/* Primary Visual Anchor: Name & Descriptor */}
        <div className="pf-hero-identity">
          <h1 className="pf-hero-name">MOHAMMED ALI</h1>
          <span className="pf-hero-program">
            Computer Science Engineering · AI &amp; ML
          </span>
        </div>

        {/* Positioning Statement — Headline */}
        <p className="pf-hero-headline">
          I build software systems for complex, real-world problems.
        </p>

        {/* Supporting Narrative Description — Editorial Bell MT / Calisto MT */}
        <p className="pf-hero-body">
          Computer Science Engineering student and developer focused on product
          building, systems design, and applied software — from intelligent
          analysis tools to domain-specific platforms.
        </p>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="pf-hero-metrics-strip" role="region" aria-label="Portfolio metrics">
        <div className="pf-hero-metrics-grid">
          {HERO_METRICS.map((metric) => {
            if (metric.href && metric.action) {
              return (
                <a
                  key={metric.label}
                  href={metric.href}
                  className="pf-hero-metric pf-hero-metric--interactive"
                  aria-label={`${metric.number} ${metric.label} — ${metric.action}`}
                >
                  <div className="pf-hero-metric-header">
                    <span className="pf-hero-metric-num">{metric.number}</span>
                    <span className="pf-hero-metric-arrow" aria-hidden="true">↗</span>
                  </div>
                  <span className="pf-hero-metric-label">{metric.label}</span>
                  <span className="pf-hero-metric-action">{metric.action} →</span>
                </a>
              );
            }

            return (
              <div
                key={metric.label}
                className="pf-hero-metric"
                aria-label={`${metric.number} ${metric.label}`}
              >
                <div className="pf-hero-metric-header">
                  <span className="pf-hero-metric-num">{metric.number}</span>
                </div>
                <span className="pf-hero-metric-label">{metric.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next-section wayfinding cue */}
      <SectionCue label="ABOUT" href="#about" />
    </section>
  );
}
