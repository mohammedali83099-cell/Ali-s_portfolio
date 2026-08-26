import { UPCOMING_WORK, type UpcomingProject } from '@/lib/projects';
import { SectionHeader } from './SectionHeader';
import { SectionCue } from './SectionCue';

// ── Stage badge label map ─────────────────────────────────────────────────────
const STAGE_LABELS: Record<UpcomingProject['stage'], string> = {
  researching: 'IN RESEARCH',
  designing:   'IN DESIGN',
  developing:  'IN DEVELOPMENT',
};

// ── Individual upcoming card ──────────────────────────────────────────────────
function UpcomingCard({ project }: { project: UpcomingProject }) {
  return (
    <article className="pf-upcoming-card" aria-label={project.title}>
      <div className="pf-upcoming-card-top">
        <span className="pf-upcoming-badge">
          {STAGE_LABELS[project.stage]}
        </span>
        <span className="pf-upcoming-dot" aria-hidden="true" />
      </div>

      <h3 className="pf-upcoming-title">{project.title}</h3>

      {/* Description — Bell MT / Calisto MT */}
      <p className="pf-upcoming-desc">{project.description}</p>

      {/* Direction — IBM Plex Mono */}
      <p className="pf-upcoming-direction">
        DIRECTION — {project.direction.toUpperCase()}
      </p>
    </article>
  );
}

// ── Upcoming Work section ─────────────────────────────────────────────────────
export function UpcomingWork() {
  return (
    <section id="upcoming" className="pf-section" aria-label="Upcoming Work">
      <div className="pf-container pf-section-inner">
        <div className="pf-section-main">
          <SectionHeader
            title="UPCOMING WORK"
            rightLabel="ACTIVE RESEARCH"
          />
          <div className="pf-upcoming-grid">
            {UPCOMING_WORK.map((project) => (
              <UpcomingCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* Next-section wayfinding cue */}
        <SectionCue label="HOW I BUILD" href="#process" />
      </div>
    </section>
  );
}
