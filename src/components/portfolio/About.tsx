import { SectionHeader } from './SectionHeader';
import { SectionCue } from './SectionCue';

const ABOUT_META = [
  {
    label: 'Discipline',
    value: 'Computer Science Engineering · AI & ML',
  },
  {
    label: 'Work',
    value: 'Software · Product · Systems',
  },
  {
    label: 'Interests',
    value: 'Construction Technology · Engineering Systems · Decision Systems',
  },
];

export function About() {
  return (
    <section id="about" className="pf-section pf-section--viewport" aria-label="About">
      <div className="pf-container pf-section-inner">
        <div className="pf-section-main">
          <SectionHeader title="About" />

          <div className="pf-about-grid">
            {/* Left: editorial narrative — Bell MT / Calisto MT */}
            <div className="pf-about-body" aria-label="About narrative">
              <p>
                My work spans software products, AI/ML applications, prototypes,
                and increasingly, problems rooted in construction and other
                real-world engineering domains. I approach projects by first
                understanding the problem and its context, researching the domain,
                and then designing and building a system around what I find.
              </p>
              <p>
                Not every project is intended to become a finished product. Some
                are prototypes, some are ongoing frameworks, and some are
                explorations that help me understand a problem more deeply. The work
                here reflects that progression.
              </p>
              <p>
                My current direction is toward building technology that connects
                software with construction, engineering, and complex real-world
                systems.
              </p>
            </div>

            {/* Right: structured metadata — IBM Plex Mono labels, IBM Plex Sans values */}
            <div className="pf-about-meta" aria-label="About metadata">
              {ABOUT_META.map((item) => (
                <div key={item.label} className="pf-about-meta-item">
                  <span className="pf-about-meta-label">{item.label.toUpperCase()}</span>
                  <p className="pf-about-meta-value">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next-section wayfinding cue */}
        <SectionCue label="SELECTED WORK" href="#work" />
      </div>
    </section>
  );
}
