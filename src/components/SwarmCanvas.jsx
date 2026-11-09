import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks';

// Optimisation par essaim particulaire (PSO), en direct.
// La fonction à minimiser est la distance à une cible : le pointeur du visiteur,
// ou un point qui se promène tant que personne ne bouge la souris.
//   v <- w.v + c1.r1.(meilleur_perso - x) + c2.r2.(meilleur_global - x)
const N = 110;
const W = 0.93, C1 = 0.04, C2 = 0.022, VMAX = 10;
const COLORS = ['#FFC914', '#FF4B2B', '#35D6A4', '#FFF6E5'];

export default function SwarmCanvas() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const [hud, setHud] = useState({ best: 0, iter: 0, mode: 'auto' });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;
    let w = 0, h = 0, raf = 0, iter = 0, lastHud = 0;
    const target = { x: 0, y: 0, manual: false, idle: 0 };

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const P = Array.from({ length: N }, (_, i) => {
      const x = Math.random() * w, y = Math.random() * h;
      return { x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, bx: x, by: y, bd: Infinity, c: COLORS[i % COLORS.length], r: 1.2 + Math.random() * 2.2 };
    });

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      target.x = x; target.y = y; target.manual = true; target.idle = 0;
      for (const p of P) p.bd = Infinity; // la cible a bougé : les records ne valent plus
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onMove, { passive: true });
    addEventListener('resize', size);

    const frame = (t) => {
      iter++;
      if (!target.manual || ++target.idle > 240) {
        target.manual = false;
        target.x = w * (0.5 + 0.34 * Math.sin(t / 2300));
        target.y = h * (0.5 + 0.3 * Math.sin(t / 1500 + 1));
        if (iter % 40 === 0) for (const p of P) p.bd = Infinity;
      }
      // évaluation : meilleur personnel et meilleur global
      let g = P[0], gd = Infinity;
      for (const p of P) {
        const d = Math.hypot(p.x - target.x, p.y - target.y);
        if (d < p.bd) { p.bd = d; p.bx = p.x; p.by = p.y; }
        if (d < gd) { gd = d; g = p; }
      }
      // redémarrage aléatoire : quand l'essaim a convergé, une partie repart explorer
      if (gd < 18 && iter % 90 === 0) {
        for (let k = 0; k < N; k += 3) { const p = P[k]; const a = Math.random() * 7, s = 6 + Math.random() * 4; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s; p.bd = Infinity; }
      }
      // traînées
      ctx.fillStyle = 'rgba(23, 18, 79, 0.13)';
      ctx.fillRect(0, 0, w, h);
      // cible
      ctx.strokeStyle = 'rgba(255, 246, 229, .55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(target.x, target.y, 14 + 4 * Math.sin(t / 200), 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(target.x - 22, target.y); ctx.lineTo(target.x + 22, target.y);
      ctx.moveTo(target.x, target.y - 22); ctx.lineTo(target.x, target.y + 22); ctx.stroke();
      // mise à jour et dessin
      for (const p of P) {
        const r1 = Math.random(), r2 = Math.random();
        p.vx = W * p.vx + C1 * r1 * (p.bx - p.x) + C2 * r2 * (g.x - p.x) + (Math.random() - 0.5) * 1.7;
        p.vy = W * p.vy + C1 * r1 * (p.by - p.y) + C2 * r2 * (g.y - p.y) + (Math.random() - 0.5) * 1.7;
        const s = Math.hypot(p.vx, p.vy);
        if (s > VMAX) { p.vx *= VMAX / s; p.vy *= VMAX / s; }
        const ox = p.x, oy = p.y;
        p.x += p.vx; p.y += p.vy;
        ctx.strokeStyle = p.c; ctx.lineWidth = p.r; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      // lien entre le meilleur global et la cible
      ctx.strokeStyle = 'rgba(255, 201, 20, .5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(target.x, target.y); ctx.stroke();

      if (t - lastHud > 180) { lastHud = t; setHud({ best: Math.round(gd), iter, mode: target.manual ? 'vous' : 'auto' }); }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      ctx.fillStyle = '#17124F'; ctx.fillRect(0, 0, w, h);
      for (const p of P) { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    } else {
      const io = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) raf = requestAnimationFrame(frame);
      });
      io.observe(canvas);
      return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onMove); removeEventListener('resize', size); };
    }
    return () => { removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onMove); removeEventListener('resize', size); };
  }, [reduced]);

  return (
    <>
      <canvas ref={canvasRef} className="swarm" aria-hidden="true" />
      {!reduced && (
        <p className="swarm-hud">
          <span>Essaim particulaire en direct</span>
          <span>{N} particules</span>
          <span>itération <b>{hud.iter}</b></span>
          <span>meilleure distance <b>{hud.best} px</b></span>
          <span>{hud.mode === 'vous' ? 'cible : votre pointeur' : 'déplacez le pointeur ou touchez l’écran : la cible vous suit'}</span>
        </p>
      )}
    </>
  );
}
