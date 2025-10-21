/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
  dotOpacity?: number; // 0..1 - multiplier applied to resulting dot alpha
}

/**
 * Resolve CSS variable values like "var(--my-color)" to the computed value.
 * Falls back to the original string if not found.
 */
function resolveCssVariable(color: string) {
  try {
    const trimmed = color.trim();
    if (!trimmed.startsWith('var(')) return trimmed;
    const inner = trimmed
      .slice(trimmed.indexOf('(') + 1, trimmed.lastIndexOf(')'))
      .trim();
    // inner can be "--my-color" or "--my-color, fallback"
    const varName = inner.split(',')[0].trim();
    const computed = getComputedStyle(
      document.documentElement
    ).getPropertyValue(varName);
    return computed ? computed.trim() : trimmed;
  } catch {
    return color;
  }
}

/**
 * Convert a color string (hex, #abc/#aabbcc, rgb()/rgba(), or CSS var(...))
 * into an { r,g,b, a } object. Always returns a numeric RGB object (a defaults to 1).
 */
function colorStringToRgba(color: string) {
  if (!color) return { r: 0, g: 0, b: 0, a: 1 };
  // Resolve CSS var(...) first
  let c = color.trim();
  if (c.startsWith('var(')) {
    c = resolveCssVariable(c);
  }

  // rgb() or rgba()
  const rgbMatch = c.match(
    /rgba?\(\s*([+-]?\d+%?)\s*[,\s]+\s*([+-]?\d+%?)\s*[,\s]+\s*([+-]?\d+%?)(?:[,\s]+([0-9.]+))?\s*\)/i
  );
  if (rgbMatch) {
    // handle percentages if any (convert to 0-255)
    const parseChannel = (v: string) =>
      v.endsWith('%')
        ? Math.round((parseFloat(v) / 100) * 255)
        : Math.round(parseInt(v, 10));
    const r = parseChannel(rgbMatch[1]);
    const g = parseChannel(rgbMatch[2]);
    const b = parseChannel(rgbMatch[3]);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return {
      r: isNaN(r) ? 0 : r,
      g: isNaN(g) ? 0 : g,
      b: isNaN(b) ? 0 : b,
      a: isNaN(a) ? 1 : a,
    };
  }

  // hex #abc or #aabbcc
  const hex = c.replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b, a: 1 };
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }

  // As a last resort, try letting the browser compute it by applying to a temporary element
  try {
    const el = document.createElement('div');
    el.style.color = c;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const fallbackMatch = computed.match(
      /rgba?\(\s*([0-9]+)[,\s]+([0-9]+)[,\s]+([0-9]+)(?:[,\s]+([0-9.]+))?\s*\)/i
    );
    if (fallbackMatch) {
      return {
        r: parseInt(fallbackMatch[1], 10),
        g: parseInt(fallbackMatch[2], 10),
        b: parseInt(fallbackMatch[3], 10),
        a: fallbackMatch[4] !== undefined ? parseFloat(fallbackMatch[4]) : 1,
      };
    }
  } catch {
    // ignore
  }

  // fallback
  return { r: 0, g: 0, b: 0, a: 1 };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 16,
  gap = 32,
  baseColor = '#5227FF',
  activeColor = '#5227FF',
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style,
  dotOpacity = 1,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  // current numeric colours used by draw loop (mutated during color transitions)
  const initialBaseRgb = useMemo(
    () => colorStringToRgba(baseColor),
    [baseColor]
  );
  const initialActiveRgb = useMemo(
    () => colorStringToRgba(activeColor),
    [activeColor]
  );
  const currentBaseRgbRef = useRef(initialBaseRgb);
  const currentActiveRgbRef = useRef(initialActiveRgb);

  // transition descriptor: null when idle
  const colorTransitionRef = useRef<{
    start: number;
    duration: number;
    fromBase: { r: number; g: number; b: number; a?: number };
    toBase: { r: number; g: number; b: number; a?: number };
    fromActive: { r: number; g: number; b: number; a?: number };
    toActive: { r: number; g: number; b: number; a?: number };
  } | null>(null);

  // schedule color refresh when theme/css var changes; debounce rapid changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const targets = [document.documentElement, document.body].filter(
      Boolean
    ) as Element[];
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const duration = 260; // transition duration in ms
    const startColorTransition = () => {
      // compute target colours (resolves var(...) if present)
      const toBase = colorStringToRgba(baseColor);
      const toActive = colorStringToRgba(activeColor);
      // set up transition from current values
      const fromBase = { ...currentBaseRgbRef.current };
      const fromActive = { ...currentActiveRgbRef.current };
      colorTransitionRef.current = {
        start: performance.now(),
        duration,
        fromBase,
        toBase,
        fromActive,
        toActive,
      };
    };

    const obs = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        startColorTransition();
      }, 60);
    });

    targets.forEach((t) =>
      obs.observe(t, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme'],
      })
    );
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      obs.disconnect();
    };
  }, [baseColor, activeColor]);

  // helper to stringify rgba object for canvas
  const rgbaToCss = useCallback(
    (
      c: { r: number; g: number; b: number; a?: number },
      opacityMultiplier = 1
    ) => {
      const baseA = c.a === undefined ? 1 : c.a;
      const a = baseA * opacityMultiplier;
      // clamp
      const aa = Math.max(0, Math.min(1, a));
      return aa === 1
        ? `rgb(${c.r},${c.g},${c.b})`
        : `rgba(${c.r},${c.g},${c.b},${+aa.toFixed(3)})`;
    },
    []
  );

  // stable CSS strings for base/active colors (canvas-safe)
  // baseStyleStr / activeStyleStr are derived on each draw from current refs,
  // but keep small memo helpers for initial mount
  const baseStyleStr = useMemo(
    () => rgbaToCss(initialBaseRgb, dotOpacity),
    [initialBaseRgb, rgbaToCss, dotOpacity]
  );
  const activeStyleStr = useMemo(
    () => rgbaToCss(initialActiveRgb, dotOpacity),
    [initialActiveRgb, rgbaToCss, dotOpacity]
  );

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;

    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const now = performance.now();
      // animate color transition if active
      const ct = colorTransitionRef.current;
      if (ct) {
        const t = Math.max(0, Math.min(1, (now - ct.start) / ct.duration));
        const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
        currentBaseRgbRef.current = {
          r: lerp(ct.fromBase.r, ct.toBase.r),
          g: lerp(ct.fromBase.g, ct.toBase.g),
          b: lerp(ct.fromBase.b, ct.toBase.b),
          a:
            (ct.fromBase.a ?? 1) +
            ((ct.toBase.a ?? 1) - (ct.fromBase.a ?? 1)) * t,
        };
        currentActiveRgbRef.current = {
          r: lerp(ct.fromActive.r, ct.toActive.r),
          g: lerp(ct.fromActive.g, ct.toActive.g),
          b: lerp(ct.fromActive.b, ct.toActive.b),
          a:
            (ct.fromActive.a ?? 1) +
            ((ct.toActive.a ?? 1) - (ct.fromActive.a ?? 1)) * t,
        };
        if (t >= 1) {
          colorTransitionRef.current = null;
        }
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        // use current (possibly animating) colours
        const baseRgbCur = currentBaseRgbRef.current;
        const activeRgbCur = currentActiveRgbRef.current;
        let style = rgbaToCss(baseRgbCur, dotOpacity);
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(
            baseRgbCur.r + (activeRgbCur.r - baseRgbCur.r) * t
          );
          const g = Math.round(
            baseRgbCur.g + (activeRgbCur.g - baseRgbCur.g) * t
          );
          const b = Math.round(
            baseRgbCur.b + (activeRgbCur.b - baseRgbCur.b) * t
          );
          const ai =
            ((baseRgbCur.a ?? 1) +
              ((activeRgbCur.a ?? 1) - (baseRgbCur.a ?? 1)) * t) *
            dotOpacity;
          const aClamped = Math.max(0, Math.min(1, ai));
          style =
            aClamped === 1
              ? `rgb(${r},${g},${b})`
              : `rgba(${r},${g},${b},${+aClamped.toFixed(3)})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, circlePath, dotOpacity, rgbaToCss]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      (window as Window).addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current!.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
  ]);

  return (
    <section
      className={`p-4 flex items-center justify-center h-full w-full relative ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </section>
  );
};

export default DotGrid;
