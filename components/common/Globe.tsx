"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useAnimationFrame } from "motion/react";

// ─── Config ───────────────────────────────────────────────────────────────────

const R = 88;               // sphere radius (SVG units)
const CX = 100;              // center x
const CY = 100;              // center y
const TILT = 23.5 * (Math.PI / 180);
const SPIN_SPEED = 0.15;     // rad/s — continuous rotation
const WOBBLE_SPEED = 0.04;   // rad/s — slow pole-wander
const LONG_COUNT = 10;       // longitude lines (reduced from 12)
const LAT_COUNT = 6;         // latitude rings (reduced from 7)
const DOT_ROWS = 7;          // graticule dot rows (reduced from 9)
const DOT_COLS = 12;         // graticule dot columns (reduced from 18)
const SEGMENTS = 36;         // path segments per curve (reduced from 64)
const TARGET_FPS = 20;       // throttle render rate
const FRAME_MS = 1000 / TARGET_FPS;
const COLOR = "#10b981";

// ─── Pre-computed angle arrays (never change) ─────────────────────────────────

const LAT_ANGLES = Array.from({ length: LAT_COUNT }, (_, i) =>
  (-70 + (i / (LAT_COUNT - 1)) * 140) * (Math.PI / 180)
);

const LON_ANGLES = Array.from({ length: LONG_COUNT }, (_, i) =>
  (i / LONG_COUNT) * Math.PI
);

// Pre-compute sphere points for latitude rings (indexed by [latIdx][segIdx])
const LAT_SPHERE_PTS: [number, number, number][][] = LAT_ANGLES.map((lat) => {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const lon = (i / SEGMENTS) * 2 * Math.PI;
    pts.push([
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon),
    ]);
  }
  return pts;
});

// Pre-compute sphere points for longitude lines (indexed by [lonIdx][segIdx])
// Each entry covers both the line and its antipodal (+π)
const LON_SPHERE_PTS: { main: [number, number, number][]; anti: [number, number, number][] }[] =
  LON_ANGLES.map((lon) => {
    const main: [number, number, number][] = [];
    const anti: [number, number, number][] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const lat = -Math.PI / 2 + (i / SEGMENTS) * Math.PI;
      main.push([
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(lon),
      ]);
      anti.push([
        Math.cos(lat) * Math.sin(lon + Math.PI),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(lon + Math.PI),
      ]);
    }
    return { main, anti };
  });

// Pre-compute sphere points for graticule dots
const DOT_SPHERE_PTS: [number, number, number][] = [];
for (let ri = 0; ri < DOT_ROWS; ri++) {
  const lat = (-70 + (ri / (DOT_ROWS - 1)) * 140) * (Math.PI / 180);
  for (let ci = 0; ci < DOT_COLS; ci++) {
    const lon = (ci / DOT_COLS) * 2 * Math.PI;
    DOT_SPHERE_PTS.push([
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon),
    ]);
  }
}

// ─── Optimised projection (inline trig, no array allocation) ──────────────────

// Cached sin/cos for the rotation — updated once per frame
let _cY = 1, _sY = 0, _cX = 1, _sX = 0, _cZ = 1, _sZ = 0;

function updateRotationCache(spin: number, tiltX: number, tiltZ: number) {
  _cY = Math.cos(spin); _sY = Math.sin(spin);
  _cX = Math.cos(TILT + tiltX); _sX = Math.sin(TILT + tiltX);
  _cZ = Math.cos(tiltZ); _sZ = Math.sin(tiltZ);
}

/** Fast project using cached rotation — returns [x, y, z] */
function projectFast(p: [number, number, number]): [number, number, number] {
  // rotY
  const a0 = p[0] * _cY - p[2] * _sY;
  const a1 = p[1];
  const a2 = p[0] * _sY + p[2] * _cY;
  // rotX
  const b0 = a0;
  const b1 = a1 * _cX - a2 * _sX;
  const b2 = a1 * _sX + a2 * _cX;
  // rotZ
  const c0 = b0 * _cZ - b1 * _sZ;
  const c1 = b0 * _sZ + b1 * _cZ;

  return [CX + c0 * R, CY - c1 * R, b2];
}

// ─── Path builders (reuse pre-computed sphere points) ─────────────────────────

function buildLatPath(latIdx: number): string {
  const pts = LAT_SPHERE_PTS[latIdx];
  const parts: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const [x, y] = projectFast(pts[i]);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return parts.join(" ") + " Z";
}

function buildLonPaths(lonIdx: number): {
  mainFront: string; mainBack: string;
  antiFront: string; antiBack: string;
} {
  const { main, anti } = LON_SPHERE_PTS[lonIdx];

  const mf: string[] = [], mb: string[] = [];
  const af: string[] = [], ab: string[] = [];

  for (let i = 0; i <= SEGMENTS; i++) {
    const [mx, my, mz] = projectFast(main[i]);
    const coord = `${mx.toFixed(1)},${my.toFixed(1)}`;
    if (mz >= 0) {
      mf.push(`${mf.length === 0 ? "M" : "L"}${coord}`);
    } else {
      mb.push(`${mb.length === 0 ? "M" : "L"}${coord}`);
    }

    const [ax, ay, az] = projectFast(anti[i]);
    const acoord = `${ax.toFixed(1)},${ay.toFixed(1)}`;
    if (az >= 0) {
      af.push(`${af.length === 0 ? "M" : "L"}${acoord}`);
    } else {
      ab.push(`${ab.length === 0 ? "M" : "L"}${acoord}`);
    }
  }

  return {
    mainFront: mf.join(" "),
    mainBack: mb.join(" "),
    antiFront: af.join(" "),
    antiBack: ab.join(" "),
  };
}

// ─── Frame data type ──────────────────────────────────────────────────────────

type FrameData = {
  latPaths: string[];
  lonPaths: { mainFront: string; mainBack: string; antiFront: string; antiBack: string }[];
  dots: { x: number; y: number; z: number }[];
  northPole: [number, number, number];
  southPole: [number, number, number];
};

function computeFrame(spin: number, tiltX: number, tiltZ: number): FrameData {
  updateRotationCache(spin, tiltX, tiltZ);

  const latPaths = LAT_ANGLES.map((_, i) => buildLatPath(i));
  const lonPaths = LON_ANGLES.map((_, i) => buildLonPaths(i));

  const dots: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < DOT_SPHERE_PTS.length; i++) {
    const [x, y, z] = projectFast(DOT_SPHERE_PTS[i]);
    if (z >= 0) dots.push({ x, y, z }); // cull back-face during computation
  }

  const northPole = projectFast([0, 1, 0]);
  const southPole = projectFast([0, -1, 0]);

  return { latPaths, lonPaths, dots, northPole, southPole };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Globe: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const spinRef = useRef(0);
  const lastT = useRef<number | null>(null);
  const lastRender = useRef(0);      // timestamp of last frame commit

  // Wobble accumulators
  const wobbleTheta = useRef(0);
  const wobblePhi = useRef(0);

  const [frame, setFrame] = useState<FrameData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useAnimationFrame((time) => {
    if (!isMounted) return;

    const dt = lastT.current === null ? 0 : (time - lastT.current) / 1000;
    lastT.current = time;

    // Always accumulate spin (smooth) but only render at TARGET_FPS
    spinRef.current = (spinRef.current + SPIN_SPEED * dt) % (2 * Math.PI);
    wobbleTheta.current += WOBBLE_SPEED * 0.7 * dt;
    wobblePhi.current += WOBBLE_SPEED * dt;

    // Throttle: skip React render if not enough time elapsed
    if (time - lastRender.current < FRAME_MS) return;
    lastRender.current = time;

    const tiltX = Math.sin(wobbleTheta.current) * 0.18;
    const tiltZ = Math.sin(wobblePhi.current) * 0.10;

    setFrame(computeFrame(spinRef.current, tiltX, tiltZ));
  });

  if (!isMounted || !frame) return null;

  const { latPaths, lonPaths, dots, northPole, southPole } = frame;

  // Axis line
  const [nx, ny] = northPole;
  const [sx, sy] = southPole;
  const axDx = nx - sx, axDy = ny - sy;
  const axLen = Math.hypot(axDx, axDy) || 1;
  const ux = axDx / axLen, uy = axDy / axLen;
  const EXT = 10;

  return (
    <div
      className="absolute -right-24 bottom-10 w-[400px] h-[400px] pointer-events-none select-none opacity-[0.17]"
      style={{ willChange: "transform", contain: "layout style paint" }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="rimGlow" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor={COLOR} stopOpacity="0" />
            <stop offset="88%" stopColor={COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={COLOR} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sphereFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLOR} stopOpacity="0.03" />
            <stop offset="100%" stopColor={COLOR} stopOpacity="0" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Sphere fill */}
        <circle cx={CX} cy={CY} r={R} fill="url(#sphereFill)" />

        {/* ── Back-face grid ─────────────────────────────────────────── */}
        <g clipPath="url(#globeClip)" opacity="0.18">
          {latPaths.map((d, i) => (
            <path
              key={`lb-${i}`}
              d={d}
              fill="none"
              stroke={COLOR}
              strokeWidth={Math.abs(LAT_ANGLES[i]) < 0.01 ? "0.4" : "0.25"}
              strokeDasharray={Math.abs(LAT_ANGLES[i]) < 0.01 ? "none" : "2 3"}
            />
          ))}
          {lonPaths.map((lp, i) => (
            <g key={`lonb-${i}`}>
              {lp.mainBack && <path d={lp.mainBack} fill="none" stroke={COLOR} strokeWidth="0.25" strokeDasharray="2 3" />}
              {lp.antiBack && <path d={lp.antiBack} fill="none" stroke={COLOR} strokeWidth="0.25" strokeDasharray="2 3" />}
            </g>
          ))}
        </g>

        {/* ── Front-face grid ────────────────────────────────────────── */}
        <g clipPath="url(#globeClip)">
          {latPaths.map((d, i) => {
            const isEq = Math.abs(LAT_ANGLES[i]) < 0.01;
            return (
              <path
                key={`lf-${i}`}
                d={d}
                fill="none"
                stroke={COLOR}
                strokeWidth={isEq ? "0.55" : "0.3"}
                opacity={isEq ? 0.65 : 0.38}
              />
            );
          })}
          {lonPaths.map((lp, i) => (
            <g key={`lonf-${i}`}>
              {lp.mainFront && <path d={lp.mainFront} fill="none" stroke={COLOR} strokeWidth="0.3" opacity="0.38" />}
              {lp.antiFront && <path d={lp.antiFront} fill="none" stroke={COLOR} strokeWidth="0.3" opacity="0.38" />}
            </g>
          ))}

          {/* Graticule dots (already back-face culled) */}
          {dots.map((dot, i) => {
            const depth = (dot.z + 1) / 2;
            return (
              <circle
                key={`d-${i}`}
                cx={dot.x}
                cy={dot.y}
                r={0.4 + depth * 0.5}
                fill={COLOR}
                opacity={0.15 + depth * 0.55}
              />
            );
          })}

          {/* Poles */}
          {northPole[2] > 0 && (
            <circle cx={northPole[0]} cy={northPole[1]} r="1.8" fill={COLOR} opacity="0.7" />
          )}
          {southPole[2] > 0 && (
            <circle cx={southPole[0]} cy={southPole[1]} r="1.8" fill={COLOR} opacity="0.5" />
          )}
        </g>

        {/* Outer boundary */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={COLOR} strokeWidth="0.6" opacity="0.5" />

        {/* Atmospheric rim glow */}
        <circle cx={CX} cy={CY} r={R + 6} fill="url(#rimGlow)" />

        {/* Tilted axis */}
        <line
          x1={sx - ux * EXT} y1={sy - uy * EXT}
          x2={nx + ux * EXT} y2={ny + uy * EXT}
          stroke={COLOR} strokeWidth="0.4" strokeDasharray="2.5 2.5" opacity="0.25"
        />
      </svg>
    </div>
  );
};