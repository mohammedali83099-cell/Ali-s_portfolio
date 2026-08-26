'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ALL_TECHNOLOGIES, type TechItem } from '@/lib/projects';

// ── Layout Matrix ─────────────────────────────────────────────────────────────
const COLS = 7;
const ROWS = 6;
const PITCH_X = 0.78;
const PITCH_Y = 0.78;
const KEY_W = 0.65;
const KEY_H = 0.65;
const KEY_DEPTH = 0.54;

// ── High-Resolution (1024x1024) Prominent, Visually Dominant Vector Logos ─────
function drawHighResVectorLogo(ctx: CanvasRenderingContext2D, tech: TechItem, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  const id = tech.id;
  const brand = tech.brandColor;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.60)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;

  // 1. React Atom (Bold & Dominant)
  if (id === 'react') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 32;
    for (let angle of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 230, 88, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();
  }
  // 2. Docker Whale (Chunky & Bold)
  else if (id === 'docker') {
    ctx.fillStyle = '#ffffff';
    const bw = 46, bh = 36, gap = 9;
    const startX = -112, startY = -145;
    ctx.fillRect(startX + bw + gap, startY, bw, bh);
    ctx.fillRect(startX + (bw + gap) * 2, startY, bw, bh);
    ctx.fillRect(startX, startY + bh + gap, bw, bh);
    ctx.fillRect(startX + bw + gap, startY + bh + gap, bw, bh);
    ctx.fillRect(startX + (bw + gap) * 2, startY + bh + gap, bw, bh);
    ctx.fillRect(startX, startY + (bh + gap) * 2, bw, bh);
    ctx.fillRect(startX + bw + gap, startY + (bh + gap) * 2, bw, bh);
    ctx.fillRect(startX + (bw + gap) * 2, startY + (bh + gap) * 2, bw, bh);

    ctx.beginPath();
    ctx.arc(0, 24, 130, 0, Math.PI);
    ctx.lineTo(-136, 24);
    ctx.quadraticCurveTo(-165, 24, -165, -24);
    ctx.quadraticCurveTo(-125, -14, -110, 24);
    ctx.lineTo(136, 24);
    ctx.quadraticCurveTo(185, 0, 195, -48);
    ctx.quadraticCurveTo(165, -24, 136, 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = brand;
    ctx.beginPath();
    ctx.arc(-62, 58, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  // 3. Python Dual Serpents (Prominent)
  else if (id === 'python') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-102, -150, 130, 130, 34);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(-24, -84, 130, 64, 24);
    ctx.fill();
    ctx.fillStyle = brand;
    ctx.beginPath();
    ctx.arc(-58, -108, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd438';
    ctx.beginPath();
    ctx.roundRect(-28, 20, 130, 130, 34);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(-106, 20, 130, 64, 24);
    ctx.fill();
    ctx.fillStyle = brand;
    ctx.beginPath();
    ctx.arc(58, 108, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  // 4. Next.js Geometric N (Bold & Dominant)
  else if (id === 'nextjs') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 32;
    ctx.beginPath();
    ctx.arc(0, 0, 185, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 230px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 0, 10);
  }
  // 5. TypeScript TS (Prominent)
  else if (id === 'typescript') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 235px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '-5px';
    ctx.fillText('TS', 0, 0);
  }
  // 6. PyTorch Flame (Dominant)
  else if (id === 'pytorch') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -175);
    ctx.bezierCurveTo(125, -78, 160, 58, 82, 154);
    ctx.bezierCurveTo(20, 208, -92, 174, -120, 82);
    ctx.bezierCurveTo(-140, 20, -102, -44, -28, -88);
    ctx.bezierCurveTo(-20, -34, 28, 28, 52, 62);
    ctx.bezierCurveTo(72, 10, 44, -82, 0, -175);
    ctx.closePath();
    ctx.fill();
  }
  // 7. Git Branch Fork
  else if (id === 'git') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-82, -110);
    ctx.lineTo(82, 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(82, -68);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (const [nx, ny] of [[-82, -110], [82, 110], [82, -68]]) {
      ctx.beginPath();
      ctx.arc(nx, ny, 38, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 8. GitHub Octocat
  else if (id === 'github') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 20, 144, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-106, -58);
    ctx.lineTo(-154, -158);
    ctx.lineTo(-44, -125);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(106, -58);
    ctx.lineTo(154, -158);
    ctx.lineTo(44, -125);
    ctx.closePath();
    ctx.fill();
  }
  // 9. Vite Lightning
  else if (id === 'vite') {
    ctx.fillStyle = '#ffd500';
    ctx.beginPath();
    ctx.moveTo(34, -182);
    ctx.lineTo(-106, 20);
    ctx.lineTo(-10, 20);
    ctx.lineTo(-38, 182);
    ctx.lineTo(106, -20);
    ctx.lineTo(10, -20);
    ctx.closePath();
    ctx.fill();
  }
  // 10. Tailwind Waves
  else if (id === 'tailwind-css') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-64, -24, 72, Math.PI, 0, false);
    ctx.arc(64, -24, 72, Math.PI, 0, true);
    ctx.lineTo(136, 10);
    ctx.arc(64, 10, 72, 0, Math.PI, false);
    ctx.arc(-64, 10, 72, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
  }
  // 11. PostgreSQL Elephant
  else if (id === 'postgresql') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -28, 116, 0.8 * Math.PI, 0.2 * Math.PI);
    ctx.lineTo(116, 92);
    ctx.quadraticCurveTo(44, 164, 0, 92);
    ctx.quadraticCurveTo(-44, 164, -116, 92);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-44, -38, 16, 0, Math.PI * 2);
    ctx.arc(44, -38, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  // 12. FastAPI Lightning
  else if (id === 'fastapi') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(28, -164);
    ctx.lineTo(-92, 10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-34, 164);
    ctx.lineTo(92, -10);
    ctx.lineTo(10, -10);
    ctx.closePath();
    ctx.fill();
  }
  // 13. Figma
  else if (id === 'figma') {
    const rad = 44;
    ctx.fillStyle = '#f24e1e';
    ctx.beginPath();
    ctx.arc(-44, -88, rad, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.rect(-44, -132, rad, rad * 2);
    ctx.fill();
    ctx.fillStyle = '#ff7262';
    ctx.beginPath();
    ctx.arc(44, -88, rad, -Math.PI / 2, Math.PI / 2);
    ctx.rect(0, -132, rad, rad * 2);
    ctx.fill();
    ctx.fillStyle = '#a259ff';
    ctx.beginPath();
    ctx.arc(-44, 0, rad, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.rect(-44, -44, rad, rad * 2);
    ctx.fill();
    ctx.fillStyle = '#1abcfe';
    ctx.beginPath();
    ctx.arc(44, 0, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0acf83';
    ctx.beginPath();
    ctx.arc(-44, 88, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  // 14. React Native / Expo
  else if (id === 'react-native') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-102, 82);
    ctx.lineTo(0, -102);
    ctx.lineTo(102, 82);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-54, 10);
    ctx.lineTo(54, 10);
    ctx.stroke();
  }
  // 15. CSS Modules
  else if (id === 'css-modules') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-116, -136);
    ctx.lineTo(116, -136);
    ctx.lineTo(92, 116);
    ctx.lineTo(0, 154);
    ctx.lineTo(-92, 116);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = brand;
    ctx.font = '900 164px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', 0, 10);
  }
  // 16. Uvicorn / Gunicorn
  else if (id === 'uvicorn-gunicorn') {
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(0, -24, 102, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#4ade80';
    ctx.font = '900 150px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WS', 0, -14);
  }
  // 17. SQLite
  else if (id === 'sqlite') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 165px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SQL', 0, 0);
  }
  // 18. Prisma ORM
  else if (id === 'prisma-orm') {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, -154);
    ctx.lineTo(130, 110);
    ctx.lineTo(-130, 110);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -154);
    ctx.lineTo(0, 110);
    ctx.lineTo(-130, 110);
    ctx.closePath();
    ctx.fill();
  }
  // 19. Redis
  else if (id === 'redis-upstash') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -135);
    ctx.lineTo(116, -68);
    ctx.lineTo(0, 0);
    ctx.lineTo(-116, -68);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-116, -44);
    ctx.lineTo(0, 24);
    ctx.lineTo(116, -44);
    ctx.lineTo(116, 0);
    ctx.lineTo(0, 68);
    ctx.lineTo(-116, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-116, 28);
    ctx.lineTo(0, 96);
    ctx.lineTo(116, 28);
    ctx.lineTo(116, 72);
    ctx.lineTo(0, 140);
    ctx.lineTo(-116, 72);
    ctx.closePath();
    ctx.fill();
  }
  // 20. Auth.js
  else if (id === 'authjs') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-106, -116);
    ctx.lineTo(106, -116);
    ctx.lineTo(92, 58);
    ctx.lineTo(0, 140);
    ctx.lineTo(-92, 58);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = brand;
    ctx.beginPath();
    ctx.arc(0, -20, 28, 0, Math.PI * 2);
    ctx.rect(-14, -20, 28, 54);
    ctx.fill();
  }
  // 21. JWT
  else if (id === 'jwt') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 155px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JWT', 0, 0);
  }
  // 22. OAuth2
  else if (id === 'oauth2') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.arc(-62, -48, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(62, -48, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 76, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-24, -28);
    ctx.lineTo(0, 34);
    ctx.lineTo(24, -28);
    ctx.stroke();
  }
  // 23. CSP
  else if (id === 'csp') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 155px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CSP', 0, 0);
  }
  // 24. Sentry
  else if (id === 'sentry') {
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-44, 0, 68, 0.4 * Math.PI, 1.6 * Math.PI);
    ctx.arc(44, 0, 68, 1.4 * Math.PI, 0.6 * Math.PI);
    ctx.stroke();
  }
  // 25. Zod
  else if (id === 'zod') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 265px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Z', 0, 0);
  }
  // 26. Resend
  else if (id === 'resend') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.roundRect(-110, -82, 220, 164, 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-106, -72);
    ctx.lineTo(0, 20);
    ctx.lineTo(106, -72);
    ctx.stroke();
  }
  // 27. Recharts
  else if (id === 'recharts') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-106, 10, 44, 102);
    ctx.fillRect(-44, -48, 44, 160);
    ctx.fillRect(18, -102, 44, 214);
    ctx.fillRect(80, 30, 44, 82);
  }
  // 28. Chart.js
  else if (id === 'chartjs') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(0, 0, 125, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(68, 0, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  // 29. D3
  else if (id === 'd3') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 188px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D3', 0, 0);
  }
  // 30. YOLOv8
  else if (id === 'yolov8') {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 28;
    ctx.strokeRect(-116, -116, 232, 232);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 126px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Y8', 0, 0);
  }
  // 31. OpenCV
  else if (id === 'opencv') {
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -68, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-62, 54, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(62, 54, 54, 0, Math.PI * 2);
    ctx.stroke();
  }
  // 32. MediaPipe
  else if (id === 'mediapipe') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(0, -116);
    ctx.lineTo(106, -34);
    ctx.lineTo(68, 116);
    ctx.lineTo(-68, 116);
    ctx.lineTo(-106, -34);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (const [px, py] of [[0, -116], [106, -34], [68, 116], [-68, 116], [-106, -34], [0, 14]]) {
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 33. NumPy
  else if (id === 'numpy') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 188px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NP', 0, 0);
  }
  // 34. Pandas
  else if (id === 'pandas') {
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '900 188px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PD', 0, 0);
  }
  // 35. Google Colab
  else if (id === 'google-colab') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(-62, 0, 62, 0.4 * Math.PI, 1.6 * Math.PI);
    ctx.arc(62, 0, 62, 1.4 * Math.PI, 0.6 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
  // 36. NVIDIA RTX 5050
  else if (id === 'nvidia-rtx-5050') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 184px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NV', 0, 0);
  }
  // 37. CUDA 12.8
  else if (id === 'cuda') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 165px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CUDA', 0, 0);
  }
  // 38. Roboflow
  else if (id === 'roboflow') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.moveTo(-102, -62);
    ctx.lineTo(0, -135);
    ctx.lineTo(102, -62);
    ctx.lineTo(102, 62);
    ctx.lineTo(0, 135);
    ctx.lineTo(-102, 62);
    ctx.closePath();
    ctx.stroke();
  }
  // 39. Roboflow Universe
  else if (id === 'roboflow-universe') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 184px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RU', 0, 0);
  }
  // 40. OpenFDA API
  else if (id === 'openfda-api') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 165px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FDA', 0, 0);
  }
  // 41. RxNorm API
  else if (id === 'rxnorm-api') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 188px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Rx', 0, 0);
  }
  // 42. Firebase (FCM)
  else if (id === 'fcm') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -164);
    ctx.lineTo(-92, 116);
    ctx.lineTo(0, 78);
    ctx.lineTo(92, 116);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd500';
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.lineTo(-58, 116);
    ctx.lineTo(0, 78);
    ctx.lineTo(58, 116);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// ── Top Decal Canvas Texture (1024x1024) ───────────────────────────────────────
function createHighResKeyDecal(tech: TechItem, isSelected: boolean, isHovered: boolean): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  if (isSelected || isHovered) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isSelected ? 34 : 22;
    ctx.beginPath();
    ctx.roundRect(30, 30, size - 60, size - 60, 108);
    ctx.stroke();
  }

  drawHighResVectorLogo(ctx, tech, cx, cy);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Mechanical Keycap Geometry ────────────────────────────────────────────────
function createKeycapBodyGeometry(): THREE.BufferGeometry {
  const botW = KEY_W;
  const botH = KEY_H;
  const depth = KEY_DEPTH;
  const r = 0.095;

  const shape = new THREE.Shape();
  const x = -botW / 2;
  const y = -botH / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + botW - r, y);
  shape.quadraticCurveTo(x + botW, y, x + botW, y + r);
  shape.lineTo(x + botW, y + botH - r);
  shape.quadraticCurveTo(x + botW, y + botH, x + botW - r, y + botH);
  shape.lineTo(x + r, y + botH);
  shape.quadraticCurveTo(x, y + botH, x, y + botH - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.055,
  });
}

// ── Individual Tactile Keycap Component ─────────────────────────────────────────
interface KeycapProps {
  tech: TechItem;
  posX: number;
  posY: number;
  isSelected: boolean;
  isHovered: boolean;
  isCategoryHighlighted: boolean;
  onKeyClick: (tech: TechItem) => void;
  onKeyOver: (tech: TechItem) => void;
  onKeyOut: () => void;
}

function MechanicalKeycap({
  tech,
  posX,
  posY,
  isSelected,
  isHovered,
  isCategoryHighlighted,
  onKeyClick,
  onKeyOver,
  onKeyOut,
}: KeycapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentElevRef = useRef(0.22);
  const isPressingRef = useRef(false);

  const bodyGeometry = useMemo(() => createKeycapBodyGeometry(), []);
  const decalGeometry = useMemo(() => new THREE.PlaneGeometry(KEY_W * 0.98, KEY_H * 0.98), []);

  const decalTexture = useMemo(
    () => createHighResKeyDecal(tech, isSelected, isHovered),
    [tech, isSelected, isHovered]
  );

  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: tech.brandColor,
      roughness: 0.65,
      metalness: 0.0,
    });
  }, [tech.brandColor]);

  const decalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: decalTexture,
      transparent: true,
      depthWrite: false,
    });
  }, [decalTexture]);

  // Robust, reliable mechanical key depression
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetElev = isPressingRef.current
      ? -0.16
      : isHovered
      ? -0.06
      : 0.22;

    currentElevRef.current = THREE.MathUtils.damp(
      currentElevRef.current,
      targetElev,
      26,
      delta
    );

    groupRef.current.position.set(posX, posY, currentElevRef.current);
  });

  return (
    <group
      ref={groupRef}
      position={[posX, posY, 0.22]}
      onClick={(e) => {
        e.stopPropagation();
        isPressingRef.current = true;
        setTimeout(() => {
          isPressingRef.current = false;
        }, 120);
        onKeyClick(tech);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onKeyOver(tech);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onKeyOut();
      }}
    >
      <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0, -KEY_DEPTH / 2]} />
      <mesh geometry={decalGeometry} material={decalMaterial} position={[0, 0, KEY_DEPTH / 2 + 0.056]} />
    </group>
  );
}

// ── Warm Light-Grey Architectural Chassis ─────────────────────────────────────
function WarmArchitecturalChassis() {
  const totalW = COLS * PITCH_X + 0.44;
  const totalH = ROWS * PITCH_Y + 0.44;

  const chassisGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 0.26;
    const x = -totalW / 2;
    const y = -totalH / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + totalW - r, y);
    shape.quadraticCurveTo(x + totalW, y, x + totalW, y + r);
    shape.lineTo(x + totalW, y + totalH - r);
    shape.quadraticCurveTo(x + totalW, y + totalH, x + totalW - r, y + totalH);
    shape.lineTo(x + r, y + totalH);
    shape.quadraticCurveTo(x, y + totalH, x, y + totalH - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.40,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07,
    });
  }, [totalW, totalH]);

  const plateGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 0.16;
    const w = totalW - 0.16;
    const h = totalH - 0.16;
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: false,
    });
  }, [totalW, totalH]);

  return (
    <group position={[0, 0, -0.42]}>
      <mesh geometry={chassisGeo}>
        <meshStandardMaterial color="#d5d0c7" roughness={0.68} metalness={0.02} />
      </mesh>
      <mesh geometry={plateGeo} position={[0, 0, 0.36]}>
        <meshStandardMaterial color="#c6c0b5" roughness={0.72} metalness={0.01} />
      </mesh>
    </group>
  );
}

// ── 3D Scene Assembly ─────────────────────────────────────────────────────────
interface KeypadSceneProps {
  selectedTech: TechItem | null;
  hoveredTech: TechItem | null;
  highlightedCategoryId: string | null;
  onSelectTech: (tech: TechItem | null) => void;
  onHoverTech: (tech: TechItem | null) => void;
}

function KeypadScene({
  selectedTech,
  hoveredTech,
  highlightedCategoryId,
  onSelectTech,
  onHoverTech,
}: KeypadSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { size, camera } = useThree();

  const aspect = size.width / Math.max(1, size.height);
  const portraitScale = aspect < 1.15 ? Math.max(1.0, 1.15 / aspect) : 1.0;

  useFrame(() => {
    const targetZ = 8.2 * portraitScale;
    if (Math.abs(camera.position.z - targetZ) > 0.01) {
      camera.position.z = targetZ;
      camera.updateProjectionMatrix();
    }
  });

  useEffect(() => {
    if (rootRef.current) {
      const fixedQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-0.36, 0.22, 0.08, 'YXZ')
      );
      rootRef.current.quaternion.copy(fixedQuat);
    }
  }, []);

  const keyPositions = useMemo(() => {
    const offsetX = -((COLS - 1) * PITCH_X) / 2;
    const offsetY = ((ROWS - 1) * PITCH_Y) / 2;

    return ALL_TECHNOLOGIES.slice(0, ROWS * COLS).map((tech, idx) => {
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const x = offsetX + col * PITCH_X;
      const y = offsetY - row * PITCH_Y;
      return { tech, x, y };
    });
  }, []);

  return (
    <>
      <ambientLight intensity={2.2} />
      <directionalLight position={[6, 12, 10]} intensity={0.8} />
      <directionalLight position={[-6, -4, 4]} intensity={0.5} color="#f5f0e8" />

      <group ref={rootRef} scale={0.96}>
        <WarmArchitecturalChassis />

        {keyPositions.map(({ tech, x, y }) => (
          <MechanicalKeycap
            key={tech.id}
            tech={tech}
            posX={x}
            posY={y}
            isSelected={selectedTech?.id === tech.id}
            isHovered={hoveredTech?.id === tech.id}
            isCategoryHighlighted={highlightedCategoryId === tech.categoryId}
            onKeyClick={(t) => onSelectTech(t)}
            onKeyOver={(t) => onHoverTech(t)}
            onKeyOut={() => onHoverTech(null)}
          />
        ))}
      </group>
    </>
  );
}

// ── Exported Centered Interactive Deck Component ──────────────────────────────
export interface TechMegaminxProps {
  selectedTech: TechItem | null;
  hoveredTech: TechItem | null;
  highlightedCategoryId: string | null;
  onSelectTech: (tech: TechItem | null) => void;
  onHoverTech: (tech: TechItem | null) => void;
}

export function TechMegaminx({
  selectedTech,
  hoveredTech,
  highlightedCategoryId,
  onSelectTech,
  onHoverTech,
}: TechMegaminxProps) {
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

  const handlePointerLeave = useCallback(() => {
    onHoverTech(null);
  }, [onHoverTech]);

  return (
    <div
      ref={containerRef}
      className="pf-deck-canvas-container"
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        camera={{ position: [0, -0.25, 8.2], fov: 37 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        <KeypadScene
          selectedTech={selectedTech}
          hoveredTech={hoveredTech}
          highlightedCategoryId={highlightedCategoryId}
          onSelectTech={onSelectTech}
          onHoverTech={onHoverTech}
        />
      </Canvas>
    </div>
  );
}
