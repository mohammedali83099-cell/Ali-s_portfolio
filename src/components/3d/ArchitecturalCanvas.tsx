'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Scale ───────────────────────────────────────────────────────────────────
const S = 0.88;

// Drafting stroke easing
function penEase(t: number): number {
  return t * (2 - t);
}

// Ultra-smooth quintic easing for natural cinematic orbit
function smoothOrbit(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * c * (c * (6 * c - 15) + 10);
}

export interface Edge {
  from: THREE.Vector3;
  to: THREE.Vector3;
  t0: number;
  t1: number;
}

export interface VolumeDef {
  type: 'concrete' | 'monolith' | 'glass' | 'greenery' | 'dark_metal' | 'soffit' | 'plinth' | 'interior';
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  tShow: number;
  castShadow?: boolean;
}

function makeStroke(
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  t0: number, t1: number
): Edge {
  return {
    from: new THREE.Vector3(x1 * S, y1 * S, z1 * S),
    to: new THREE.Vector3(x2 * S, y2 * S, z2 * S),
    t0,
    t1,
  };
}

// Helper: Architectural Slab with top/bottom perimeter, fascias, and corner drops
function makeSlab(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  t0: number, t1: number
): Edge[] {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  const topY = cy + hh;
  const botY = cy - hh;
  const dt = (t1 - t0) / 8;

  return [
    // Top perimeter
    makeStroke(cx - hw, topY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 0, t0 + dt * 1.5),
    makeStroke(cx + hw, topY, cz + hd, cx + hw, topY, cz - hd, t0 + dt * 1, t0 + dt * 2.5),
    makeStroke(cx + hw, topY, cz - hd, cx - hw, topY, cz - hd, t0 + dt * 2, t0 + dt * 3.5),
    makeStroke(cx - hw, topY, cz - hd, cx - hw, topY, cz + hd, t0 + dt * 3, t0 + dt * 4.5),
    // Vertical corner drops
    makeStroke(cx - hw, topY, cz + hd, cx - hw, botY, cz + hd, t0 + dt * 4, t0 + dt * 5.5),
    makeStroke(cx + hw, topY, cz + hd, cx + hw, botY, cz + hd, t0 + dt * 4.5, t0 + dt * 6.0),
    makeStroke(cx + hw, topY, cz - hd, cx + hw, botY, cz - hd, t0 + dt * 5.0, t0 + dt * 6.5),
    makeStroke(cx - hw, topY, cz - hd, cx - hw, botY, cz - hd, t0 + dt * 5.5, t0 + dt * 7.0),
    // Bottom perimeter
    makeStroke(cx - hw, botY, cz + hd, cx + hw, botY, cz + hd, t0 + dt * 5.5, t0 + dt * 7.0),
    makeStroke(cx + hw, botY, cz + hd, cx + hw, botY, cz - hd, t0 + dt * 6.5, t1),
  ];
}

// Helper: Glass Facade with structural posts, transoms & window mullions
function makeGlassFacade(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  mullionsX: number,
  t0: number, t1: number
): Edge[] {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  const topY = cy + hh;
  const botY = cy - hh;

  const edges: Edge[] = [];
  const dt = (t1 - t0) / (7 + mullionsX);

  // Front base & top header
  edges.push(makeStroke(cx - hw, botY, cz + hd, cx + hw, botY, cz + hd, t0, t0 + dt * 1.5));
  edges.push(makeStroke(cx - hw, topY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 1, t0 + dt * 2.5));

  // Front left & right posts
  edges.push(makeStroke(cx - hw, botY, cz + hd, cx - hw, topY, cz + hd, t0 + dt * 2, t0 + dt * 3.5));
  edges.push(makeStroke(cx + hw, botY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 2.5, t0 + dt * 4));

  // Horizontal transom division bar
  const transomY = botY + h * 0.72;
  edges.push(makeStroke(cx - hw, transomY, cz + hd, cx + hw, transomY, cz + hd, t0 + dt * 3, t0 + dt * 4.5));

  // Right side glass outline
  edges.push(makeStroke(cx + hw, botY, cz + hd, cx + hw, botY, cz - hd, t0 + dt * 3, t0 + dt * 4.5));
  edges.push(makeStroke(cx + hw, topY, cz + hd, cx + hw, topY, cz - hd, t0 + dt * 3.5, t0 + dt * 5));
  edges.push(makeStroke(cx + hw, botY, cz - hd, cx + hw, topY, cz - hd, t0 + dt * 4, t0 + dt * 5.5));

  // Rear and left glass outlines for full 360° visibility
  edges.push(makeStroke(cx - hw, botY, cz - hd, cx + hw, botY, cz - hd, t0 + dt * 3.5, t0 + dt * 5.0));
  edges.push(makeStroke(cx - hw, topY, cz - hd, cx + hw, topY, cz - hd, t0 + dt * 4.0, t0 + dt * 5.5));
  edges.push(makeStroke(cx - hw, botY, cz + hd, cx - hw, botY, cz - hd, t0 + dt * 4.5, t0 + dt * 6.0));
  edges.push(makeStroke(cx - hw, topY, cz + hd, cx - hw, topY, cz - hd, t0 + dt * 5.0, t0 + dt * 6.5));

  // Vertical window mullions on front face
  if (mullionsX > 0) {
    const step = w / (mullionsX + 1);
    for (let i = 1; i <= mullionsX; i++) {
      const mx = cx - hw + step * i;
      edges.push(
        makeStroke(mx, botY, cz + hd, mx, topY, cz + hd, t0 + dt * (4 + i * 0.8), t0 + dt * (5.5 + i * 0.8))
      );
    }
  }

  return edges;
}

// Helper: Balustrade with glass handrails, stanchions and top rail
function makeBalustrade(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  t0: number, t1: number
): Edge[] {
  const hw = w / 2;
  const hd = d / 2;
  const topY = cy + h;
  const botY = cy;
  const dt = (t1 - t0) / 6;

  return [
    // Top handrail perimeter
    makeStroke(cx - hw, topY, cz + hd, cx + hw, topY, cz + hd, t0, t0 + dt * 2),
    makeStroke(cx + hw, topY, cz + hd, cx + hw, topY, cz - hd, t0 + dt, t0 + dt * 3),
    makeStroke(cx + hw, topY, cz - hd, cx - hw, topY, cz - hd, t0 + dt * 1.5, t0 + dt * 3.5),
    makeStroke(cx - hw, topY, cz - hd, cx - hw, topY, cz + hd, t0 + dt * 2, t0 + dt * 4),
    // Vertical stanchion posts
    makeStroke(cx - hw, botY, cz + hd, cx - hw, topY, cz + hd, t0 + dt * 1.5, t0 + dt * 3),
    makeStroke(cx, botY, cz + hd, cx, topY, cz + hd, t0 + dt * 2, t0 + dt * 3.5),
    makeStroke(cx + hw, botY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 2.5, t0 + dt * 4),
    makeStroke(cx + hw, botY, cz - hd, cx + hw, topY, cz - hd, t0 + dt * 3, t1),
  ];
}

// Helper: Concrete Core with horizontal and vertical architectural panel reveals
function makeConcreteCore(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  t0: number, t1: number
): Edge[] {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  const topY = cy + hh;
  const botY = cy - hh;

  const edges: Edge[] = [];
  const dt = (t1 - t0) / 10;

  // Corner vertical structural lines
  edges.push(makeStroke(cx - hw, botY, cz + hd, cx - hw, topY, cz + hd, t0 + dt * 0, t0 + dt * 3));
  edges.push(makeStroke(cx + hw, botY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 1, t0 + dt * 4));
  edges.push(makeStroke(cx + hw, botY, cz - hd, cx + hw, topY, cz - hd, t0 + dt * 2, t0 + dt * 5));
  edges.push(makeStroke(cx - hw, botY, cz - hd, cx - hw, topY, cz - hd, t0 + dt * 3, t0 + dt * 6));

  // Top perimeter
  edges.push(makeStroke(cx - hw, topY, cz + hd, cx + hw, topY, cz + hd, t0 + dt * 4, t0 + dt * 7));
  edges.push(makeStroke(cx + hw, topY, cz + hd, cx + hw, topY, cz - hd, t0 + dt * 5, t0 + dt * 8));
  edges.push(makeStroke(cx + hw, topY, cz - hd, cx - hw, topY, cz - hd, t0 + dt * 6, t0 + dt * 9));

  // Architectural panel reveals (horizontal bands) — on both front & rear faces
  const midY1 = botY + h * 0.22;
  const midY2 = botY + h * 0.44;
  const midY3 = botY + h * 0.66;
  const midY4 = botY + h * 0.86;
  // Front face reveals
  edges.push(makeStroke(cx - hw, midY1, cz + hd, cx + hw, midY1, cz + hd, t0 + dt * 5.0, t0 + dt * 7.5));
  edges.push(makeStroke(cx - hw, midY2, cz + hd, cx + hw, midY2, cz + hd, t0 + dt * 5.5, t0 + dt * 8.0));
  edges.push(makeStroke(cx - hw, midY3, cz + hd, cx + hw, midY3, cz + hd, t0 + dt * 6.5, t0 + dt * 9.0));
  edges.push(makeStroke(cx - hw, midY4, cz + hd, cx + hw, midY4, cz + hd, t0 + dt * 7.5, t0 + dt * 9.5));
  // Rear face reveals
  edges.push(makeStroke(cx - hw, midY1, cz - hd, cx + hw, midY1, cz - hd, t0 + dt * 5.0, t0 + dt * 7.5));
  edges.push(makeStroke(cx - hw, midY2, cz - hd, cx + hw, midY2, cz - hd, t0 + dt * 5.5, t0 + dt * 8.0));
  edges.push(makeStroke(cx - hw, midY3, cz - hd, cx + hw, midY3, cz - hd, t0 + dt * 6.5, t0 + dt * 9.0));
  edges.push(makeStroke(cx - hw, midY4, cz - hd, cx + hw, midY4, cz - hd, t0 + dt * 7.5, t0 + dt * 9.5));

  // Vertical panel division lines
  edges.push(makeStroke(cx, botY, cz + hd, cx, topY, cz + hd, t0 + dt * 7.0, t1));
  edges.push(makeStroke(cx - hw * 0.5, botY, cz + hd, cx - hw * 0.5, topY, cz + hd, t0 + dt * 7.5, t1));
  edges.push(makeStroke(cx + hw * 0.5, botY, cz + hd, cx + hw * 0.5, topY, cz + hd, t0 + dt * 8.0, t1));
  edges.push(makeStroke(cx, botY, cz - hd, cx, topY, cz - hd, t0 + dt * 7.0, t1));

  return edges;
}

// ─────────────────────────────────────────────────────────────────────────────
//  BUILD ALL ARCHITECTURAL MANSION GEOMETRY & MATERIALS MATCHING REFERENCE
// ─────────────────────────────────────────────────────────────────────────────
function buildScene(): { edges: Edge[]; volumes: VolumeDef[] } {
  const edges: Edge[] = [];
  const volumes: VolumeDef[] = [];

  const add = (e: Edge[]) => edges.push(...e);
  const vol = (
    type: VolumeDef['type'],
    cx: number, cy: number, cz: number,
    w: number, h: number, d: number,
    color: string,
    roughness: number,
    metalness: number,
    opacity: number,
    tShow: number,
    castShadow = true
  ) => volumes.push({
    type,
    pos: [cx * S, cy * S, cz * S],
    size: [w * S, h * S, d * S],
    color,
    roughness,
    metalness,
    opacity,
    tShow,
    castShadow,
  });

  // ── PHASE 1: SITE FOUNDATION & PODIUM (0.00 – 0.12) ────────────────────────
  // Main ground podium slab
  add(makeSlab(0.5, 0.10, 0.0, 26.0, 0.22, 19.0, 0.00, 0.07));
  vol('plinth', 0.5, 0.10, 0.0, 26.0, 0.22, 19.0, '#ece8e0', 0.86, 0.03, 0.98, 0.04);

  // Cascading wide entrance steps — 4 treads
  add(makeSlab(-0.2, 0.35, 6.8, 13.0, 0.22, 2.0, 0.05, 0.09));
  add(makeSlab(-0.2, 0.57, 4.9, 11.2, 0.22, 2.0, 0.07, 0.11));
  add(makeSlab(-0.2, 0.79, 3.0, 9.4, 0.22, 2.0, 0.09, 0.13));
  add(makeSlab(-0.2, 1.01, 1.2, 7.6, 0.22, 1.8, 0.11, 0.14));
  vol('plinth', -0.2, 0.35, 6.8, 13.0, 0.22, 2.0, '#eeebe4', 0.85, 0.03, 0.98, 0.07);
  vol('plinth', -0.2, 0.57, 4.9, 11.2, 0.22, 2.0, '#ece9e1', 0.85, 0.03, 0.98, 0.09);
  vol('plinth', -0.2, 0.79, 3.0, 9.4, 0.22, 2.0, '#ece9e1', 0.85, 0.03, 0.98, 0.11);
  vol('plinth', -0.2, 1.01, 1.2, 7.6, 0.22, 1.8, '#eae7df', 0.85, 0.03, 0.98, 0.12);
  // Step shadow bands
  vol('soffit', -0.2, 0.24, 5.9, 13.05, 0.04, 0.04, '#888888', 0.9, 0.05, 0.92, 0.08);
  vol('soffit', -0.2, 0.46, 3.9, 11.25, 0.04, 0.04, '#888888', 0.9, 0.05, 0.92, 0.10);
  vol('soffit', -0.2, 0.68, 2.1, 9.45, 0.04, 0.04, '#888888', 0.9, 0.05, 0.92, 0.12);

  // Far-left low retaining wall & planter container
  add(makeSlab(-8.8, 0.70, 3.8, 5.0, 0.85, 4.5, 0.10, 0.15));
  vol('concrete', -8.8, 0.70, 3.8, 5.0, 0.85, 4.5, '#dedad2', 0.88, 0.04, 0.98, 0.12);
  // Lush ground planter greenery — multi-layered for rich botanical depth
  vol('greenery', -8.8, 1.25, 3.8, 4.8, 0.52, 4.3, '#324a28', 0.94, 0.0, 0.98, 0.14);
  vol('greenery', -8.8, 1.52, 3.4, 4.4, 0.34, 3.8, '#466436', 0.94, 0.0, 0.96, 0.15);
  vol('greenery', -8.8, 1.70, 3.2, 3.8, 0.20, 3.2, '#5a7c44', 0.94, 0.0, 0.95, 0.16);

  // Entrance & Step-side ornamental landscaping (matching reference ground plantings)
  vol('greenery', 1.8, 1.35, 3.5, 1.4, 0.75, 1.4, '#38522e', 0.94, 0.0, 0.98, 0.15);
  vol('greenery', -0.4, 1.20, 4.2, 0.9, 0.55, 0.9, '#4c6c3a', 0.94, 0.0, 0.96, 0.15);
  // Ornamental grass / shrub clusters along step flanks
  vol('greenery', -6.8, 0.45, 6.2, 1.6, 0.45, 1.4, '#3c5630', 0.94, 0.0, 0.98, 0.13);
  vol('greenery', -6.2, 0.58, 5.0, 1.2, 0.52, 1.1, '#4e6e3c', 0.94, 0.0, 0.96, 0.14);
  vol('greenery', 6.6, 0.42, 6.0, 1.6, 0.46, 1.4, '#3c5630', 0.94, 0.0, 0.98, 0.14);
  // Landscape shrubs clustered at the base of the right concrete retaining wing
  vol('greenery', 10.8, 0.45, 2.8, 1.8, 0.55, 1.4, '#364e2a', 0.94, 0.0, 0.98, 0.14);
  vol('greenery', 12.2, 0.40, 1.2, 1.5, 0.48, 1.5, '#486838', 0.94, 0.0, 0.98, 0.15);
  vol('greenery', 12.8, 0.35, -0.6, 1.6, 0.42, 1.6, '#3c5630', 0.94, 0.0, 0.98, 0.15);

  // ── PHASE 2: GROUND FLOOR STRUCTURES (0.12 – 0.35) ─────────────────────────
  // Ground Floor Left — solid concrete corner piers & spandrel
  vol('concrete', -9.55, 2.35, 0.2, 1.20, 3.5, 9.8, '#f2f2f2', 0.90, 0.03, 0.98, 0.18);
  vol('concrete', -0.45, 2.35, 0.2, 0.95, 3.5, 9.8, '#f2f2f2', 0.90, 0.03, 0.98, 0.19);
  vol('concrete', -4.6, 0.85, 5.0, 10.5, 1.50, 0.30, '#efefef', 0.90, 0.03, 0.98, 0.19);

  // Rear Garden Facade — Asymmetric, private garden composition (distinct from front)
  // Left rear: Recessed sliding glass garden portal (2 wide bays)
  vol('concrete', -7.8, 0.85, -4.7, 4.5, 1.50, 0.35, '#efefef', 0.90, 0.03, 0.98, 0.19);
  vol('concrete', -2.2, 2.35, -4.7, 3.5, 3.50, 0.35, '#f2f2f2', 0.90, 0.03, 0.98, 0.19);
  vol('glass', -6.2, 2.55, -4.7, 5.2, 2.1, 0.12, '#bcd4e8', 0.10, 0.30, 0.45, 0.22, false);
  vol('dark_metal', -8.70, 2.55, -4.7, 0.09, 2.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.23);
  vol('dark_metal', -6.20, 2.55, -4.7, 0.09, 2.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.23);
  vol('dark_metal', -3.70, 2.55, -4.7, 0.09, 2.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.23);
  vol('dark_metal', -6.20, 3.60, -4.7, 5.2, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.23);

  // Ground Floor Left Glass — front panoramic facade (3 bays)
  add(makeGlassFacade(-4.6, 2.35, 0.2, 10.5, 3.5, 9.8, 3, 0.12, 0.28));
  vol('glass', -4.6, 2.35, 0.2, 10.5, 3.5, 9.8, '#bcd4e8', 0.10, 0.30, 0.45, 0.20, false);
  vol('dark_metal', -5.70, 2.35, 5.10, 0.09, 3.5, 0.09, '#595959', 0.45, 0.5, 0.98, 0.21);
  vol('dark_metal', -3.45, 2.35, 5.10, 0.09, 3.5, 0.09, '#595959', 0.45, 0.5, 0.98, 0.22);
  vol('dark_metal', -1.20, 2.35, 5.10, 0.09, 3.5, 0.09, '#595959', 0.45, 0.5, 0.98, 0.23);
  vol('dark_metal', -4.6, 3.55, 5.10, 10.5, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.22);

  vol('interior', -4.6, 0.35, 0.2, 9.8, 0.1, 9.0, '#e9e9e9', 0.75, 0.05, 0.95, 0.22);
  vol('interior', -4.6, 2.35, -2.5, 6.0, 3.2, 0.15, '#f0f0f0', 0.8, 0.05, 0.95, 0.24);

  // Ground Floor Right — solid concrete piers flanking the glass lounge
  vol('concrete', 2.85, 2.15, 0.2, 1.10, 3.1, 8.8, '#f2f2f2', 0.90, 0.03, 0.98, 0.22);
  vol('concrete', 9.60, 2.15, 0.2, 0.90, 3.1, 8.8, '#f2f2f2', 0.90, 0.03, 0.98, 0.23);
  // Rear right: Textured solid wall with vertical garden slot window
  vol('concrete', 5.2, 2.15, -4.1, 3.8, 3.10, 0.35, '#f2f2f2', 0.90, 0.03, 0.98, 0.23);
  vol('concrete', 8.2, 0.75, -4.1, 2.8, 1.30, 0.35, '#efefef', 0.90, 0.03, 0.98, 0.23);
  vol('glass', 8.2, 2.35, -4.1, 2.6, 1.9, 0.12, '#bcd4e8', 0.10, 0.30, 0.45, 0.24, false);
  vol('dark_metal', 7.00, 2.35, -4.1, 0.09, 1.9, 0.09, '#595959', 0.45, 0.5, 0.98, 0.25);
  vol('dark_metal', 9.40, 2.35, -4.1, 0.09, 1.9, 0.09, '#595959', 0.45, 0.5, 0.98, 0.26);
  vol('dark_metal', 8.20, 3.30, -4.1, 2.6, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.25);

  // Ground Floor Right Glass Lounge — front
  add(makeGlassFacade(6.2, 2.15, 0.0, 6.8, 3.1, 8.5, 2, 0.18, 0.32));
  vol('glass', 6.2, 2.15, 0.0, 6.8, 3.1, 8.5, '#bcd4e8', 0.10, 0.30, 0.45, 0.24, false);
  vol('dark_metal', 4.40, 2.15, 4.25, 0.09, 3.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.25);
  vol('dark_metal', 8.00, 2.15, 4.25, 0.09, 3.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.26);
  vol('dark_metal', 6.2, 3.30, 4.25, 6.8, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.25);
  vol('interior', 6.2, 0.35, 0.0, 6.2, 0.1, 8.0, '#e9e9e9', 0.75, 0.05, 0.95, 0.26);

  // Far-right low wing / solid terrace wall
  add(makeSlab(10.5, 1.45, -0.8, 2.8, 2.5, 5.5, 0.25, 0.34));
  vol('concrete', 10.5, 1.45, -0.8, 2.8, 2.5, 5.5, '#f4f4f4', 0.88, 0.04, 0.98, 0.28);
  add([makeStroke(11.6, 0.2, 1.6, 11.6, 2.7, 1.6, 0.28, 0.35)]);
  vol('dark_metal', 11.6, 1.45, 1.6, 0.12, 2.5, 0.12, '#595959', 0.45, 0.5, 0.98, 0.30);

  // ── PHASE 3: INTERMEDIATE CANTILEVER SLABS & TERRACES (0.30 – 0.50) ─────────
  // Left 1st Floor Cantilever Slab
  add(makeSlab(-4.8, 4.25, 0.5, 12.5, 0.40, 11.2, 0.30, 0.42));
  vol('concrete', -4.8, 4.25, 0.5, 12.5, 0.40, 11.2, '#f7f7f7', 0.84, 0.04, 0.98, 0.36);
  // Soffit underside — warm dark grey, not black
  vol('soffit', -4.8, 4.02, 0.5, 12.3, 0.10, 11.0, '#808080', 0.88, 0.05, 0.98, 0.38);
  // Fascia edge
  vol('dark_metal', -4.8, 4.25, 6.12, 12.55, 0.14, 0.08, '#595959', 0.4, 0.5, 0.98, 0.38);

  // Left Balcony Glass Railing
  add(makeBalustrade(-4.8, 4.45, 0.5, 12.3, 0.85, 11.0, 0.38, 0.46));
  vol('glass', -4.8, 4.85, 0.5, 12.3, 0.85, 11.0, '#c8dff0', 0.06, 0.45, 0.42, 0.42, false);
  vol('dark_metal', -4.8, 5.31, 6.06, 12.3, 0.06, 0.06, '#595959', 0.4, 0.5, 0.98, 0.44);
  vol('dark_metal', -9.85, 4.87, 6.06, 0.08, 0.90, 0.08, '#595959', 0.4, 0.5, 0.98, 0.43);
  vol('dark_metal', -4.80, 4.87, 6.06, 0.08, 0.90, 0.08, '#595959', 0.4, 0.5, 0.98, 0.43);
  vol('dark_metal', 0.25, 4.87, 6.06, 0.08, 0.90, 0.08, '#595959', 0.4, 0.5, 0.98, 0.44);

  // Right 1st Floor Cantilever Planter Box (prominent lush landscaped terrace hedge)
  add(makeSlab(6.4, 4.05, 1.8, 7.8, 0.75, 4.8, 0.36, 0.48));
  vol('concrete', 6.4, 4.05, 1.8, 7.8, 0.75, 4.8, '#f4f4f4', 0.87, 0.04, 0.98, 0.42);
  // Dense lush multi-tier manicured hedge (matching reference terrace greenery)
  vol('greenery', 4.1, 4.72, 1.8, 2.6, 0.62, 4.5, '#344c2a', 0.95, 0.0, 0.98, 0.44);
  vol('greenery', 6.4, 4.80, 1.8, 2.7, 0.70, 4.6, '#426034', 0.95, 0.0, 0.98, 0.44);
  vol('greenery', 8.7, 4.70, 1.8, 2.5, 0.60, 4.5, '#36502c', 0.95, 0.0, 0.98, 0.44);
  vol('greenery', 6.4, 5.06, 1.6, 7.4, 0.28, 4.0, '#567a42', 0.95, 0.0, 0.96, 0.46);
  // Planter cap rail — subtle, not dominant
  vol('dark_metal', 6.4, 4.45, 4.23, 7.85, 0.08, 0.08, '#595959', 0.4, 0.5, 0.98, 0.43);

  // ── PHASE 4: CENTRAL CONCRETE MONUMENTAL CORE (0.42 – 0.65) ────────────────
  add(makeConcreteCore(1.8, 5.5, -0.4, 3.8, 10.6, 7.5, 0.42, 0.62));
  vol('monolith', 1.8, 5.5, -0.4, 3.8, 10.6, 7.5, '#efefef', 0.92, 0.03, 0.98, 0.50);
  // Front groove reveals
  vol('soffit', 1.8, 2.20, 3.38, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.52);
  vol('soffit', 1.8, 4.60, 3.38, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.54);
  vol('soffit', 1.8, 6.80, 3.38, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.56);
  vol('soffit', 1.8, 9.00, 3.38, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.58);
  // Rear groove reveals
  vol('soffit', 1.8, 2.20, -4.18, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.52);
  vol('soffit', 1.8, 4.60, -4.18, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.54);
  vol('soffit', 1.8, 6.80, -4.18, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.56);
  vol('soffit', 1.8, 9.00, -4.18, 3.82, 0.06, 0.06, '#888888', 0.9, 0.05, 0.92, 0.58);

  // Recessed entrance alcove canopy & door framing
  add(makeSlab(-0.2, 4.15, 0.8, 2.0, 0.18, 4.0, 0.48, 0.56));
  vol('dark_metal', -0.2, 4.15, 0.8, 2.0, 0.18, 4.0, '#595959', 0.4, 0.5, 0.98, 0.52);
  vol('dark_metal', -1.0, 3.15, 4.82, 0.10, 2.0, 0.10, '#595959', 0.4, 0.5, 0.98, 0.53);
  vol('dark_metal', 0.6, 3.15, 4.82, 0.10, 2.0, 0.10, '#595959', 0.4, 0.5, 0.98, 0.53);
  vol('dark_metal', -0.2, 4.18, 4.82, 2.0, 0.12, 0.10, '#595959', 0.4, 0.5, 0.98, 0.54);
  vol('interior', -0.2, 3.0, 2.5, 1.6, 1.8, 4.5, '#eeeeee', 0.8, 0.05, 0.94, 0.54);

  // ── PHASE 5: FIRST FLOOR CANTILEVER ROOMS & ROOF OVERHANGS (0.55 – 0.78) ───
  // Left 1F — solid corner piers & spandrels
  vol('concrete', -9.60, 6.0, 0.3, 1.10, 3.1, 9.5, '#f2f2f2', 0.90, 0.03, 0.98, 0.59);
  vol('concrete', -0.30, 6.0, 0.3, 0.90, 3.1, 9.5, '#f2f2f2', 0.90, 0.03, 0.98, 0.59);
  vol('concrete', -4.5, 4.85, 4.75, 10.8, 0.80, 0.30, '#efefef', 0.90, 0.03, 0.98, 0.60);

  // Rear 1F Suite: Distinct architectural ribbon window with asymmetric solid end bookend
  vol('concrete', -8.0, 6.0, -4.5, 4.2, 3.10, 0.35, '#f2f2f2', 0.90, 0.03, 0.98, 0.58);
  vol('concrete', -3.0, 4.85, -4.5, 6.0, 0.80, 0.35, '#efefef', 0.90, 0.03, 0.98, 0.60);
  vol('glass', -3.0, 6.0, -4.5, 5.6, 1.8, 0.12, '#bcd4e8', 0.10, 0.30, 0.45, 0.62, false);
  vol('dark_metal', -4.80, 6.0, -4.5, 0.09, 1.8, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);
  vol('dark_metal', -2.00, 6.0, -4.5, 0.09, 1.8, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);
  vol('dark_metal', -3.00, 6.92, -4.5, 5.6, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);

  // Left 1F Glass Suite — front
  add(makeGlassFacade(-4.5, 6.0, 0.0, 10.8, 3.1, 9.5, 3, 0.55, 0.68));
  vol('glass', -4.5, 6.0, 0.0, 10.8, 3.1, 9.5, '#bcd4e8', 0.10, 0.30, 0.45, 0.62, false);
  vol('dark_metal', -7.00, 6.0, 4.75, 0.09, 3.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);
  vol('dark_metal', -4.50, 6.0, 4.75, 0.09, 3.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);
  vol('dark_metal', -2.00, 6.0, 4.75, 0.09, 3.1, 0.09, '#595959', 0.45, 0.5, 0.98, 0.64);
  vol('dark_metal', -4.5, 7.18, 4.75, 10.8, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.63);
  vol('interior', -4.5, 4.48, 0.0, 10.2, 0.08, 9.0, '#e9e9e9', 0.75, 0.05, 0.95, 0.64);

  // Left 1F Roof Slab & Fascia
  add(makeSlab(-4.8, 7.70, 0.0, 12.6, 0.38, 10.5, 0.64, 0.74));
  vol('concrete', -4.8, 7.70, 0.0, 12.6, 0.38, 10.5, '#f7f7f7', 0.84, 0.04, 0.98, 0.68);
  vol('soffit', -4.8, 7.50, 0.0, 12.4, 0.08, 10.3, '#808080', 0.88, 0.05, 0.98, 0.70);
  vol('dark_metal', -4.8, 7.70, 5.26, 12.65, 0.12, 0.08, '#595959', 0.4, 0.5, 0.98, 0.70);
  vol('dark_metal', -11.10, 7.70, 0.0, 0.08, 0.12, 10.5, '#595959', 0.4, 0.5, 0.98, 0.70);
  vol('dark_metal', -4.8, 7.70, -5.26, 12.65, 0.12, 0.08, '#595959', 0.4, 0.5, 0.98, 0.70);

  // Rooftop terrace glass railing
  add(makeBalustrade(-4.8, 7.88, 0.0, 12.4, 0.80, 10.3, 0.70, 0.77));
  vol('glass', -4.8, 8.28, 0.0, 12.4, 0.80, 10.3, '#c8dff0', 0.06, 0.45, 0.42, 0.72, false);
  vol('dark_metal', -4.8, 8.70, 5.16, 12.4, 0.06, 0.06, '#595959', 0.4, 0.5, 0.98, 0.73);
  vol('dark_metal', -9.85, 8.0, 5.16, 0.08, 0.88, 0.08, '#595959', 0.4, 0.5, 0.98, 0.72);
  vol('dark_metal', -4.80, 8.0, 5.16, 0.08, 0.88, 0.08, '#595959', 0.4, 0.5, 0.98, 0.72);
  vol('dark_metal', 0.25, 8.0, 5.16, 0.08, 0.88, 0.08, '#595959', 0.4, 0.5, 0.98, 0.73);
  // Rooftop terrace planter strip with rich botanical foliage
  vol('concrete', -6.2, 7.98, -1.5, 3.5, 0.20, 3.5, '#efefef', 0.88, 0.03, 0.98, 0.73);
  vol('greenery', -6.2, 8.28, -1.5, 3.6, 0.62, 3.6, '#36502c', 0.95, 0.0, 0.96, 0.74);
  vol('greenery', -6.2, 8.55, -1.5, 3.2, 0.35, 3.2, '#50723e', 0.95, 0.0, 0.94, 0.75);
  // Penthouse right terrace planter accent
  vol('greenery', 2.6, 8.35, -1.8, 2.4, 0.46, 2.5, '#3c5830', 0.94, 0.0, 0.96, 0.76);
  vol('greenery', 2.6, 8.58, -1.8, 2.1, 0.25, 2.2, '#547640', 0.94, 0.0, 0.94, 0.77);

  // Right 1F — solid piers + rear private balcony opening
  vol('concrete', 3.50, 5.65, -0.5, 0.90, 2.5, 7.0, '#f2f2f2', 0.90, 0.03, 0.98, 0.60);
  vol('concrete', 9.90, 5.65, -0.5, 0.90, 2.5, 7.0, '#f2f2f2', 0.90, 0.03, 0.98, 0.61);
  vol('concrete', 6.6, 4.80, 2.60, 6.2, 0.70, 0.28, '#efefef', 0.90, 0.03, 0.98, 0.61);
  vol('concrete', 5.2, 5.65, -3.20, 2.5, 2.50, 0.35, '#f2f2f2', 0.90, 0.03, 0.98, 0.60);
  vol('concrete', 8.2, 4.80, -3.20, 3.5, 0.70, 0.35, '#efefef', 0.90, 0.03, 0.98, 0.61);
  vol('glass', 8.2, 5.65, -3.20, 3.2, 1.8, 0.12, '#bcd4e8', 0.10, 0.30, 0.45, 0.64, false);
  vol('dark_metal', 6.60, 5.65, -3.20, 0.09, 1.8, 0.09, '#595959', 0.45, 0.5, 0.98, 0.65);
  vol('dark_metal', 9.60, 5.65, -3.20, 0.09, 1.8, 0.09, '#595959', 0.45, 0.5, 0.98, 0.66);
  vol('dark_metal', 8.20, 6.58, -3.20, 3.2, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.65);

  // Right 1F Suite Glass — front
  add(makeGlassFacade(6.6, 5.65, -0.8, 6.2, 2.5, 6.8, 2, 0.58, 0.70));
  vol('glass', 6.6, 5.65, -0.8, 6.2, 2.5, 6.8, '#bcd4e8', 0.10, 0.30, 0.45, 0.64, false);
  vol('dark_metal', 4.90, 5.65, 2.60, 0.09, 2.5, 0.09, '#595959', 0.45, 0.5, 0.98, 0.65);
  vol('dark_metal', 8.30, 5.65, 2.60, 0.09, 2.5, 0.09, '#595959', 0.45, 0.5, 0.98, 0.66);
  vol('dark_metal', 6.60, 6.62, 2.60, 6.2, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.65);

  // Right 1F Overhang Slab
  add(makeSlab(6.8, 7.05, -0.8, 7.2, 0.35, 7.5, 0.68, 0.76));
  vol('concrete', 6.8, 7.05, -0.8, 7.2, 0.35, 7.5, '#f7f7f7', 0.84, 0.04, 0.98, 0.72);
  vol('soffit', 6.8, 6.86, -0.8, 7.0, 0.06, 7.3, '#808080', 0.88, 0.05, 0.98, 0.74);
  vol('dark_metal', 6.8, 7.05, 2.88, 7.25, 0.12, 0.08, '#595959', 0.4, 0.5, 0.98, 0.74);
  vol('dark_metal', 10.42, 7.05, -0.8, 0.08, 0.12, 7.5, '#595959', 0.4, 0.5, 0.98, 0.74);
  vol('dark_metal', 6.8, 7.05, -4.56, 7.25, 0.12, 0.08, '#595959', 0.4, 0.5, 0.98, 0.74);
  // Right terrace planter
  vol('concrete', 7.5, 7.26, -0.8, 2.6, 0.22, 2.6, '#efefef', 0.88, 0.03, 0.98, 0.75);
  vol('greenery', 7.5, 7.52, -0.8, 2.4, 0.44, 2.4, '#3a5430', 0.94, 0.0, 0.96, 0.76);
  vol('greenery', 7.5, 7.72, -0.8, 2.2, 0.28, 2.2, '#4a6438', 0.94, 0.0, 0.94, 0.77);

  // ── PHASE 6: PENTHOUSE & MAIN FLOATING ROOF SLAB (0.75 – 1.00) ─────────────
  // Penthouse solid framing + rear clerestory glass aperture
  vol('concrete', -2.60, 8.75, -0.3, 0.85, 2.4, 6.5, '#f2f2f2', 0.90, 0.03, 0.98, 0.77);
  vol('concrete', 4.05, 8.75, -0.3, 0.85, 2.4, 6.5, '#f2f2f2', 0.90, 0.03, 0.98, 0.78);
  vol('concrete', 0.8, 7.95, 2.60, 6.8, 0.65, 0.28, '#efefef', 0.90, 0.03, 0.98, 0.78);
  // Asymmetric rear penthouse wall: left solid bookend + right panoramic view aperture
  vol('concrete', -1.2, 8.75, -3.05, 2.8, 2.40, 0.35, '#f2f2f2', 0.90, 0.03, 0.98, 0.77);
  vol('concrete', 2.2, 7.95, -3.05, 3.8, 0.65, 0.35, '#efefef', 0.90, 0.03, 0.98, 0.78);
  vol('glass', 2.2, 8.75, -3.05, 3.6, 1.7, 0.12, '#bcd4e8', 0.10, 0.30, 0.45, 0.80, false);
  vol('dark_metal', 0.40, 8.75, -3.05, 0.09, 1.7, 0.09, '#595959', 0.45, 0.5, 0.98, 0.82);
  vol('dark_metal', 3.90, 8.75, -3.05, 0.09, 1.7, 0.09, '#595959', 0.45, 0.5, 0.98, 0.82);
  vol('dark_metal', 2.20, 9.62, -3.05, 3.6, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.83);

  // Penthouse Glass Studio — front
  add(makeGlassFacade(0.8, 8.75, -0.6, 6.8, 2.4, 6.5, 2, 0.75, 0.86));
  vol('glass', 0.8, 8.75, -0.6, 6.8, 2.4, 6.5, '#bcd4e8', 0.10, 0.30, 0.45, 0.80, false);
  vol('dark_metal', -1.10, 8.75, 2.63, 0.09, 2.4, 0.09, '#595959', 0.45, 0.5, 0.98, 0.82);
  vol('dark_metal', 2.70, 8.75, 2.63, 0.09, 2.4, 0.09, '#595959', 0.45, 0.5, 0.98, 0.82);
  vol('dark_metal', 0.80, 9.68, 2.63, 6.8, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.83);
  vol('dark_metal', 0.80, 7.80, 2.63, 6.8, 0.06, 0.09, '#595959', 0.45, 0.5, 0.98, 0.82);

  // Far-left chimney / utility core block
  add(makeSlab(-3.8, 9.4, -1.8, 2.4, 2.8, 3.2, 0.80, 0.88));
  vol('concrete', -3.8, 9.4, -1.8, 2.4, 2.8, 3.2, '#efefef', 0.90, 0.03, 0.98, 0.84);

  // Penthouse Balcony Glass Railing
  add(makeBalustrade(0.8, 8.95, -0.6, 8.5, 0.75, 7.2, 0.82, 0.90));
  vol('glass', 0.8, 9.35, -0.6, 8.5, 0.75, 7.2, '#c8dff0', 0.06, 0.45, 0.42, 0.84, false);
  vol('dark_metal', 0.8, 9.73, 2.98, 8.5, 0.06, 0.06, '#595959', 0.4, 0.5, 0.98, 0.85);
  vol('dark_metal', -3.25, 9.36, 2.98, 0.08, 0.80, 0.08, '#595959', 0.4, 0.5, 0.98, 0.84);
  vol('dark_metal', 0.80, 9.36, 2.98, 0.08, 0.80, 0.08, '#595959', 0.4, 0.5, 0.98, 0.84);
  vol('dark_metal', 4.85, 9.36, 2.98, 0.08, 0.80, 0.08, '#595959', 0.4, 0.5, 0.98, 0.85);

  // MAIN FLOATING ROOF SLAB — THE CULMINATING ICONIC CANTILEVER
  add(makeSlab(-0.6, 10.15, -0.4, 18.5, 0.50, 9.6, 0.86, 1.00));
  vol('concrete', -0.6, 10.15, -0.4, 18.5, 0.50, 9.6, '#f7f7f7', 0.82, 0.04, 0.98, 0.92);
  // Soffit — warm dark grey, not black
  vol('soffit', -0.6, 9.88, -0.4, 18.2, 0.09, 9.3, '#808080', 0.88, 0.05, 0.98, 0.94);
  // Fascia edges — front, rear, and sides
  vol('dark_metal', -0.6, 10.15, 4.42, 18.55, 0.16, 0.08, '#595959', 0.4, 0.5, 0.98, 0.94);
  vol('dark_metal', -0.6, 10.15, -5.20, 18.55, 0.16, 0.08, '#595959', 0.4, 0.5, 0.98, 0.94);
  vol('dark_metal', -9.95, 10.15, -0.4, 0.14, 0.50, 9.6, '#595959', 0.4, 0.5, 0.98, 0.95);
  vol('dark_metal', 8.75, 10.15, -0.4, 0.14, 0.50, 9.6, '#595959', 0.4, 0.5, 0.98, 0.95);

  return { edges, volumes };
}

// ─── Module-level constant scene ─────────────────────────────────────────────
const SCENE = buildScene();

// ─────────────────────────────────────────────────────────────────────────────
//  PROCEDURAL TEXTURE GENERATOR FOR HIGH-END ARCHITECTURAL REALISM
// ─────────────────────────────────────────────────────────────────────────────
function createArchitecturalTextures() {
  // 1. Concrete Panel Texture with fine grain and tie holes
  const concreteCanvas = document.createElement('canvas');
  concreteCanvas.width = 1024;
  concreteCanvas.height = 1024;
  const ctx = concreteCanvas.getContext('2d');
  if (ctx) {
    // Warm limestone base
    ctx.fillStyle = '#dedad0';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle noise grain
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle panel seams
    ctx.strokeStyle = 'rgba(90, 85, 78, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Vertical seams
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    // Horizontal seams
    ctx.moveTo(0, 256);
    ctx.lineTo(1024, 256);
    ctx.moveTo(0, 512);
    ctx.lineTo(1024, 512);
    ctx.moveTo(0, 768);
    ctx.lineTo(1024, 768);
    ctx.stroke();

    // Tie holes
    ctx.fillStyle = 'rgba(60, 55, 48, 0.45)';
    const tiePoints = [
      [48, 48], [464, 48], [560, 48], [976, 48],
      [48, 208], [464, 208], [560, 208], [976, 208],
      [48, 304], [464, 304], [560, 304], [976, 304],
      [48, 464], [464, 464], [560, 464], [976, 464],
      [48, 560], [464, 560], [560, 560], [976, 560],
      [48, 720], [464, 720], [560, 720], [976, 720],
      [48, 816], [464, 816], [560, 816], [976, 816],
      [48, 976], [464, 976], [560, 976], [976, 976],
    ];
    for (const [tx, ty] of tiePoints) {
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const concreteTex = new THREE.CanvasTexture(concreteCanvas);
  concreteTex.wrapS = THREE.RepeatWrapping;
  concreteTex.wrapT = THREE.RepeatWrapping;

  // 2. Foliage Texture with natural organic multi-tone leaf dappling
  const foliageCanvas = document.createElement('canvas');
  foliageCanvas.width = 512;
  foliageCanvas.height = 512;
  const fCtx = foliageCanvas.getContext('2d');
  if (fCtx) {
    // Rich forest undergrowth tone
    fCtx.fillStyle = '#20301a';
    fCtx.fillRect(0, 0, 512, 512);

    // Multi-shade dappled leaf clusters
    for (let i = 0; i < 1400; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rad = 2.5 + Math.random() * 9;
      const shade = Math.random();
      fCtx.fillStyle =
        shade > 0.75 ? '#5c8044' :
          shade > 0.50 ? '#486836' :
            shade > 0.25 ? '#365028' : '#283c1e';
      fCtx.beginPath();
      fCtx.arc(rx, ry, rad, 0, Math.PI * 2);
      fCtx.fill();
    }
    // Sun-warmed golden-green canopy highlights
    for (let i = 0; i < 350; i++) {
      fCtx.fillStyle = 'rgba(125, 175, 85, 0.32)';
      fCtx.beginPath();
      fCtx.arc(Math.random() * 512, Math.random() * 512, 1.5 + Math.random() * 4.5, 0, Math.PI * 2);
      fCtx.fill();
    }
  }
  const foliageTex = new THREE.CanvasTexture(foliageCanvas);
  foliageTex.wrapS = THREE.RepeatWrapping;
  foliageTex.wrapT = THREE.RepeatWrapping;

  return { concreteTex, foliageTex };
}

// ─────────────────────────────────────────────────────────────────────────────
//  R3F INNER SCENE WITH NATURAL CINEMATIC ORBIT & SKETCH-RENDER HYBRID
// ─────────────────────────────────────────────────────────────────────────────
function MansionDrawing({
  progress,
  orbitProgress = 0,
}: {
  progress: number;
  orbitProgress?: number;
}) {
  const { camera } = useThree();

  const baseRadius = 29.2;
  const baseAngle = 0.82; // ~47° starting 3/4 hero frontal perspective
  const targetLookAt = useMemo(() => new THREE.Vector3(-0.4 * S, 4.0 * S, 0), []);

  useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(19.2, 5.2, 22.0);
    cam.lookAt(targetLookAt);
    cam.fov = 35;
    cam.updateProjectionMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLookAt]);

  const textures = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createArchitecturalTextures();
  }, []);

  // Flat buffer for all edge linework
  const N = SCENE.edges.length;
  const { lineSegs, posBuf, posAttr, lineMat } = useMemo(() => {
    const buf = new Float32Array(N * 6);
    const attr = new THREE.BufferAttribute(buf, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', attr);
    const mat = new THREE.LineBasicMaterial({
      color: 0x1a1c22,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const segs = new THREE.LineSegments(geo, mat);
    return { lineSegs: segs, posBuf: buf, posAttr: attr, lineMat: mat };
  }, [N]);

  // Static ground grid created once (zero allocations per frame)
  const gridLine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let n = -8; n <= 8; n++) {
      pts.push(new THREE.Vector3(n * 4 * S, 0.01, -36 * S));
      pts.push(new THREE.Vector3(n * 4 * S, 0.01, 36 * S));
      pts.push(new THREE.Vector3(-36 * S, 0.01, n * 4 * S));
      pts.push(new THREE.Vector3(36 * S, 0.01, n * 4 * S));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: 0xc0bdb3, transparent: true, opacity: 0.045 });
    return new THREE.LineSegments(geo, mat);
  }, []);

  const groundMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const driftRef = useRef({ t: 0 });

  useFrame((_, delta) => {
    driftRef.current.t += delta;
    const dt = driftRef.current.t;
    const cam = camera as THREE.PerspectiveCamera;

    // ── 1. Natural, Smooth Architectural Orbit ──
    if (orbitProgress > 0) {
      const easedOrbit = smoothOrbit(orbitProgress);
      // Majestic ~270° panoramic drone arc
      const totalRotation = Math.PI * 1.52;
      const angle = baseAngle + easedOrbit * totalRotation;

      // Natural, subtle elevation breathing that highlights the cantilever depths
      const yElev = 5.2 + Math.sin(easedOrbit * Math.PI) * 1.4;
      const radius = baseRadius - Math.sin(easedOrbit * Math.PI) * 0.9;

      cam.position.x = Math.sin(angle) * radius;
      cam.position.y = yElev;
      cam.position.z = Math.cos(angle) * radius;
      cam.lookAt(targetLookAt);
    } else {
      // Natural subtle breathing motion during formation
      cam.position.x = 19.2 + Math.sin(dt * 0.18) * 0.25;
      cam.position.y = 5.2 + Math.cos(dt * 0.14) * 0.14;
      cam.position.z = 22.0;
      cam.lookAt(targetLookAt);
    }

    // ── 2. Drawing Stroke Buffer Update ──
    const tip = new THREE.Vector3();
    for (let i = 0; i < N; i++) {
      const e = SCENE.edges[i];
      let lt = 0;
      if (progress >= e.t1) {
        lt = 1;
      } else if (progress > e.t0) {
        lt = (progress - e.t0) / (e.t1 - e.t0);
      }
      const eased = penEase(Math.min(1, lt));
      tip.lerpVectors(e.from, e.to, eased);

      const b = i * 6;
      posBuf[b] = e.from.x;
      posBuf[b + 1] = e.from.y;
      posBuf[b + 2] = e.from.z;
      posBuf[b + 3] = tip.x;
      posBuf[b + 4] = tip.y;
      posBuf[b + 5] = tip.z;
    }

    posAttr.set(posBuf);
    posAttr.needsUpdate = true;

    // ── 3. Realistic Material Transition (Bloom into Reality) ──
    const realismProgress = Math.max(0, (progress - 0.65) / 0.35) + orbitProgress * 0.6;
    const realismFactor = Math.min(1, realismProgress);

    // Lines fade to subtle edge accents as materials emerge — architecture, not graphic
    lineMat.opacity = THREE.MathUtils.lerp(0.55, 0.28, realismFactor);

    if (groundMatRef.current) {
      groundMatRef.current.opacity = Math.min(0.92, progress * 2.5);
    }

    SCENE.volumes.forEach((v, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (progress > v.tShow) {
        const emergence = Math.min(1, (progress - v.tShow) / 0.12);

        if (v.type === 'glass') {
          // Glass as openings within solid mass — tinted, transparent, not dominant
          mat.opacity = emergence * THREE.MathUtils.lerp(0.15, v.opacity, realismFactor);
          mat.roughness = THREE.MathUtils.lerp(0.35, v.roughness, realismFactor);
          mat.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.12, realismFactor);
        } else if (v.type === 'greenery') {
          // Rich, dense foliage greens with texture
          mat.opacity = emergence * THREE.MathUtils.lerp(0.30, v.opacity, realismFactor);
          mat.roughness = 0.96;
        } else if (v.type === 'soffit') {
          // Deep dark cantilever underside soffits
          mat.opacity = emergence * THREE.MathUtils.lerp(0.35, v.opacity, realismFactor);
          mat.roughness = 0.92;
        } else if (v.type === 'dark_metal') {
          // Dark bronze / black fascia trims, mullions, and railings
          mat.opacity = emergence * THREE.MathUtils.lerp(0.35, v.opacity, realismFactor);
          mat.roughness = 0.45;
          mat.metalness = 0.65;
        } else if (v.type === 'interior') {
          // Warm amber interior glow — visible through glass, creates authentic lived-in depth
          mat.opacity = emergence * THREE.MathUtils.lerp(0.30, v.opacity, realismFactor);
          mat.roughness = 0.70;
          mat.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.48, realismFactor);
        } else {
          // Concrete & plinth warm limestone / travertine stone with fine texture
          mat.opacity = emergence * THREE.MathUtils.lerp(0.35, v.opacity, realismFactor);
          mat.roughness = THREE.MathUtils.lerp(0.70, v.roughness, realismFactor);
        }
      } else {
        mat.opacity = 0;
      }
    });
  });

  return (
    <>
      {/* ── Architectural Lighting: Warm Golden Hour Sun + Soft Ambient Sky ── */}

      {/* Hemisphere: serene sky blue above + warm golden ground bounce */}
      <hemisphereLight
        args={['#d4e6f4', '#c8baa0', 0.70]}
      />

      {/* Primary key: warm golden sunlight casting crisp yet soft architectural shadows */}
      <directionalLight
        position={[24, 26, 20]}
        intensity={1.42}
        color="#fff4e4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={28}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Ambient fill — soft luminous base so shadows remain clear & detailed */}
      <ambientLight intensity={0.52} color="#faf6ee" />

      {/* Cool sky fill from left/rear for subtle plane contrast */}
      <directionalLight
        position={[-20, 18, -14]}
        intensity={0.38}
        color="#c6d8ee"
      />

      {/* Warm front fill — softens facade shadows */}
      <directionalLight
        position={[-8, 6, 20]}
        intensity={0.30}
        color="#ffe2cc"
      />

      {/* Ground bounce — keeps cantilever undersides warm and readable */}
      <directionalLight
        position={[0, -6, 10]}
        intensity={0.20}
        color="#e6d4b4"
      />

      {/* Ground courtyard — warm stone, receives shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          ref={groundMatRef}
          color="#e8e2d4"
          roughness={0.95}
          metalness={0.01}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Architectural ground pavement grid — single static draw call */}
      <primitive object={gridLine} />

      {/* Solid & Materialized Architectural Volumes */}
      {SCENE.volumes.map((v, i) => (
        <mesh
          key={`vol-${i}`}
          position={v.pos}
          castShadow={v.castShadow !== false}
          receiveShadow
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
        >
          <boxGeometry args={v.size} />
          <meshStandardMaterial
            color={v.color}
            map={
              textures
                ? v.type === 'monolith' || v.type === 'concrete'
                  ? textures.concreteTex
                  : v.type === 'greenery'
                    ? textures.foliageTex
                    : null
                : null
            }
            roughness={v.roughness}
            metalness={v.metalness}
            transparent
            opacity={0}
            emissive={
              v.type === 'glass' ? '#ffddb0'
                : v.type === 'interior' ? '#ffdc9a'
                  : '#000000'
            }
            emissiveIntensity={0}
            depthWrite={v.type !== 'glass'}
            side={v.type === 'glass' ? THREE.DoubleSide : THREE.FrontSide}
            envMapIntensity={v.type === 'glass' ? 0.8 : v.type === 'dark_metal' ? 0.6 : 0.2}
          />
        </mesh>
      ))}

      {/* Architectural stroke linework */}
      <primitive object={lineSegs} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTED CANVAS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function ArchitecturalCanvas({
  progress,
  orbitProgress = 0,
}: {
  progress: number;
  orbitProgress?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
        shadows
        camera={{ position: [19.2, 5.2, 22.0], fov: 35, near: 0.1, far: 600 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0xf2ede5), 1);
        }}
      >
        <MansionDrawing progress={progress} orbitProgress={orbitProgress} />
      </Canvas>
    </div>
  );
}
