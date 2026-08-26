'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ALL_TECHNOLOGIES, TECH_CATEGORIES, type TechItem } from '@/lib/projects';
import { SectionHeader } from './SectionHeader';
import { SectionCue } from './SectionCue';

// Dynamic client-only import for 3D Deck
const TechMegaminx = dynamic(
  () => import('../3d/TechMegaminx').then((m) => m.TechMegaminx),
  {
    ssr: false,
    loading: () => (
      <div className="pf-deck-placeholder" aria-label="Loading 3D Tech Deck">
        <div className="pf-megaminx-loader-line" />
        <span className="pf-megaminx-loader-text">INITIALIZING 3D TECH DECK...</span>
      </div>
    ),
  }
);

export function Tools() {
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Inspection card strictly activates on hover and immediately returns to default when unhovered
  const activeTech: TechItem | null = hoveredTech;

  const handleCategoryClick = (catId: string) => {
    if (activeCategoryId === catId) {
      setActiveCategoryId(null);
      setSelectedTech(null);
    } else {
      setActiveCategoryId(catId);
      const catTechs = ALL_TECHNOLOGIES.filter((t) => t.categoryId === catId);
      if (catTechs.length > 0) {
        setSelectedTech(catTechs[0]);
      }
    }
  };

  return (
    <section id="tools" className="pf-section" aria-label="Tools and Technologies">
      <div className="pf-container pf-section-inner">
        <div className="pf-section-main">
          <SectionHeader title="TOOLS &amp; TECHNOLOGIES" />

          {/* Fixed-Height Inspection Header (Zero Layout Shift) */}
          <div className="pf-deck-header-zone">
            <div className={`pf-deck-inspection-card ${activeTech ? 'has-active' : ''}`}>
              {activeTech ? (
                <div className="pf-deck-inspection-content" key={activeTech.id}>
                  <div className="pf-deck-callout-header">
                    <span
                      className="pf-deck-callout-icon"
                      style={{
                        backgroundColor: activeTech.badgeBg,
                        color: activeTech.badgeFg,
                      }}
                    >
                      {activeTech.symbol}
                    </span>
                    <div className="pf-deck-callout-titles">
                      <h3 className="pf-deck-callout-name">{activeTech.name}</h3>
                      <span className="pf-deck-callout-cat">
                        {activeTech.categoryNumber} — {activeTech.category}
                      </span>
                    </div>
                  </div>
                  <p className="pf-deck-callout-desc">{activeTech.shortDesc}</p>
                </div>
              ) : (
                <div className="pf-deck-inspection-idle">
                  <span className="pf-deck-idle-dot" />
                  <p className="pf-deck-idle-text">
                    A tactile 3D interactive toolkit. Hover or click any mechanical keycap to inspect specifications.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Centered 3D Showcase Stage */}
          <div
            className="pf-deck-stage"
            onMouseLeave={() => {
              setHoveredTech(null);
            }}
          >
            <div className="pf-deck-canvas-wrap">
              <TechMegaminx
                selectedTech={selectedTech}
                hoveredTech={hoveredTech}
                highlightedCategoryId={activeCategoryId}
                onSelectTech={(tech) => setSelectedTech(tech)}
                onHoverTech={(tech) => setHoveredTech(tech)}
              />
            </div>

            {/* Bottom Interaction Cue */}
            <div className="pf-deck-hint-bar" aria-hidden="true">
              <span>HOVER OR CLICK ANY KEYCAP TO INSPECT SPECIFICATIONS</span>
            </div>
          </div>

          {/* Centered 12 Category Filter Directory */}
          <div className="pf-deck-categories-strip" role="list">
            {TECH_CATEGORIES.map((cat) => {
              const isSelected =
                activeCategoryId === cat.id ||
                (hoveredTech !== null && hoveredTech.categoryId === cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`pf-deck-cat-btn ${isSelected ? 'is-active' : ''}`}
                  role="listitem"
                  aria-label={`Category ${cat.number}: ${cat.label}`}
                >
                  <span className="pf-deck-cat-num">{cat.number}</span>
                  <span className="pf-deck-cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next-section wayfinding cue */}
        <SectionCue label="CONTACT" href="#contact" />
      </div>
    </section>
  );
}
