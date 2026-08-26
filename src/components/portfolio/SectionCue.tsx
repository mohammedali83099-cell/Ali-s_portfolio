interface SectionCueProps {
  label: string;
  href: string;
}

export function SectionCue({ label, href }: SectionCueProps) {
  return (
    <div className="pf-section-cue-wrap">
      <a href={href} className="pf-section-cue" aria-label={`Continue to ${label}`}>
        <span className="pf-section-cue-bar" aria-hidden="true" />
        <span className="pf-section-cue-label">{label} ↓</span>
      </a>
    </div>
  );
}
