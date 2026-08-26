interface SectionHeaderProps {
  title: string;
  rightLabel?: string;
}

export function SectionHeader({ title, rightLabel }: SectionHeaderProps) {
  return (
    <div className="pf-section-header">
      <div className="pf-section-header-left">
        <h2 className="pf-section-title">{title}</h2>
      </div>
      {rightLabel && (
        <span className="pf-section-right-label">{rightLabel}</span>
      )}
    </div>
  );
}
