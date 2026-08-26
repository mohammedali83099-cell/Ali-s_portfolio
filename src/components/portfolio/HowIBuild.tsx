import { PROCESS_STEPS } from '@/lib/projects';
import { SectionHeader } from './SectionHeader';
import { SectionCue } from './SectionCue';

export function HowIBuild() {
  return (
    <section id="process" className="pf-section" aria-label="How I Build">
      <div className="pf-container pf-section-inner">
        <div className="pf-section-main">
          <SectionHeader title="HOW I BUILD" />

          {/* Alternating sequence with central spine */}
          <div className="pf-process-timeline">
            <div className="pf-process-spine" aria-hidden="true" />

            <div className="pf-process-list" role="list">
              {PROCESS_STEPS.map((step, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={step.number}
                    className={`pf-process-row ${
                      isLeft ? 'pf-process-row--left' : 'pf-process-row--right'
                    }`}
                    role="listitem"
                    aria-label={`Principle ${step.number}: ${step.name}`}
                  >
                    {/* Center Spine Node Marker */}
                    <div className="pf-process-node" aria-hidden="true">
                      <span className="pf-process-dot" />
                    </div>

                    {/* Principle Content Block */}
                    <div className="pf-process-card">
                      <span className="pf-process-number">{step.number}</span>
                      <h3 className="pf-process-title">{step.name}</h3>
                      <p className="pf-process-desc">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Next-section wayfinding cue */}
        <SectionCue label="TOOLS &amp; TECHNOLOGIES" href="#tools" />
      </div>
    </section>
  );
}
