"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  baseOpacity: number;
};

const COLORS = ["#8b5cf6", "#8b5cf6", "#8b5cf6", "#a78bfa", "#34d399"];
const COUNT = 70;
const LINK_DIST = 100;
const REPEL_DIST = 115;
const REPEL_FORCE = 0.55;

function spawn(w: number, h: number, scatter = false): Particle {
  return {
    x: Math.random() * w,
    y: scatter ? Math.random() * h : h + 8,
    vx: (Math.random() - 0.5) * 0.28,
    vy: -(Math.random() * 0.38 + 0.18),
    size: Math.random() * 1.7 + 0.7,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: scatter ? Math.random() * 0.55 + 0.15 : 0,
    baseOpacity: Math.random() * 0.55 + 0.35,
  };
}

function hex2rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const safe = Math.max(0, Math.min(1, a));
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${safe.toFixed(3)})`;
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: Particle[] = Array.from({ length: COUNT }, () =>
      spawn(w, h, true),
    );

    let mouse = { x: -9999, y: -9999 };
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const ro = new ResizeObserver(() => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    });
    ro.observe(canvas);

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Draw connection lines first (behind particles)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const lineOpacity =
              (1 - dist / LINK_DIST) *
              Math.min(particles[i].opacity, particles[j].opacity) *
              0.25;
            ctx!.beginPath();
            ctx!.strokeStyle = hex2rgba(particles[i].color, lineOpacity);
            ctx!.lineWidth = 0.6;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy = p.vy * 0.99 - (Math.random() * 0.38 + 0.18) * 0.01;
        // Keep rising
        if (p.vy > -0.12) p.vy = -0.18;

        p.x += p.vx;
        p.y += p.vy;

        // Fade in at bottom 12%, fade out at top 12%
        const fadeZone = h * 0.12;
        if (p.y > h - fadeZone) {
          p.opacity = p.baseOpacity * (1 - (p.y - (h - fadeZone)) / fadeZone);
        } else if (p.y < fadeZone) {
          p.opacity = p.baseOpacity * (p.y / fadeZone);
        } else {
          p.opacity = p.baseOpacity;
        }
        p.opacity = Math.max(0, Math.min(1, p.opacity));

        // Wrap horizontally, respawn from bottom when off top
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -12) {
          const np = spawn(w, h);
          p.x = np.x;
          p.y = np.y;
          p.vx = np.vx;
          p.vy = np.vy;
          p.size = np.size;
          p.color = np.color;
          p.opacity = 0;
          p.baseOpacity = np.baseOpacity;
        }

        // Glow halo
        const grd = ctx!.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 4,
        );
        grd.addColorStop(0, hex2rgba(p.color, p.opacity * 0.3));
        grd.addColorStop(1, hex2rgba(p.color, 0));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = grd;
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = hex2rgba(p.color, p.opacity);
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
