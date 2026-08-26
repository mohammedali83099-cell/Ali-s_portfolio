import { SELECTED_WORK, type Project } from '@/lib/projects';
import { SectionHeader } from './SectionHeader';
import { SectionCue } from './SectionCue';

// ── Individual project entry ──────────────────────────────────────────────────
function ProjectEntry({ project }: { project: Project }) {
  return (
    <div
      className="pf-project-entry"
      id={`project-${project.slug}`}
      aria-label={`Project: ${project.title}`}
    >
      <div className="pf-project-entry-inner">
        {/* Left column: text content */}
        <div className="pf-project-content">
          {/* Meta row: index + category */}
          <div className="pf-project-meta">
            <span className="pf-project-index">{project.index}</span>
            <span className="pf-project-cat">{project.category.toUpperCase()}</span>
          </div>

          {/* Title */}
          <h3 className="pf-project-title">{project.title}</h3>

          {/* Description — Bell MT / Calisto MT */}
          <p className="pf-project-desc">{project.description}</p>

          {/* Technical tags */}
          <div className="pf-project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="pf-tech-tag">
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: visual presentation */}
        <div className="pf-project-right">
          <div className="pf-project-visual" aria-hidden="true">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} interface preview`}
                className="pf-project-visual-img"
              />
            ) : (
              <span className="pf-project-visual-label">VISUAL · TO BE ADDED</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Selected Work section ─────────────────────────────────────────────────────
export function SelectedWork() {
  return (
    <section id="work" className="pf-section" aria-label="Selected Work">
      <div className="pf-container pf-section-inner">
        <div className="pf-section-main">
          <SectionHeader title="SELECTED WORK" />
          <div className="pf-project-list">
            {SELECTED_WORK.map((project) => (
              <ProjectEntry key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* Next-section wayfinding cue */}
        <SectionCue label="UPCOMING WORK" href="#upcoming" />
      </div>
    </section>
  );
}
