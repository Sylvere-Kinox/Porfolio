import { useCallback, useEffect, useRef, useState } from 'react';
import { Reveal } from './ui';
import { useInView, useReducedMotion } from '../hooks';

// Le labo : trois stratégies de recherche de chemin sur la même grille.
// Une seule boucle « meilleur d'abord » ; seule la priorité change :
//   Dijkstra : g          (coût parcouru)
//   A*       : g + h      (coût parcouru + distance de Manhattan restante)
//   Glouton  : h          (distance restante seulement)
const COLS = 30, ROWS = 14, N = COLS * ROWS;
const START = (ROWS >> 1) * COLS + 1, GOAL = (ROWS >> 1) * COLS + COLS - 2;
const ALGOS = [
  { key: 'astar', label: 'A*', note: 'Trouve le plus court chemin en se laissant guider par la distance restante.' },
  { key: 'dijkstra', label: 'Dijkstra', note: 'Trouve aussi le plus court chemin, mais explore dans toutes les directions.' },
  { key: 'greedy', label: 'Glouton', note: 'Fonce vers la cible. Rapide, sans garantie que le chemin soit le plus court.' },
];
const C = { bg: '#17124F', grid: 'rgba(255,246,229,.08)', wall: '#FFF6E5', seen: '#0B8F6C', front: '#35D6A4', path: '#FFC914', start: '#FF4B2B', goal: '#FF4B2B' };

function solve(walls, algo) {
  const g = new Float32Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
  const gx = GOAL % COLS, gy = (GOAL / COLS) | 0;
  const h = (i) => Math.abs((i % COLS) - gx) + Math.abs(((i / COLS) | 0) - gy);
  const f = (i) => (algo === 'dijkstra' ? g[i] : algo === 'greedy' ? h(i) : g[i] + h(i));
  const open = [START], order = [];
  g[START] = 0;
  let found = false;
  while (open.length) {
    let b = 0;
    for (let k = 1; k < open.length; k++) {
      const d = f(open[k]) - f(open[b]);
      if (d < 0 || (d === 0 && h(open[k]) < h(open[b]))) b = k;
    }
    const cur = open.splice(b, 1)[0];
    if (closed[cur]) continue;
    closed[cur] = 1; order.push(cur);
    if (cur === GOAL) { found = true; break; }
    const x = cur % COLS, y = (cur / COLS) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, n = ny * COLS + nx;
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || walls[n] || closed[n]) continue;
      if (g[cur] + 1 < g[n]) { g[n] = g[cur] + 1; prev[n] = cur; open.push(n); }
    }
  }
  const path = [];
  if (found) for (let i = GOAL; i !== -1; i = prev[i]) path.unshift(i);
  return { order, path, found };
}

function randomWalls() {
  const w = new Uint8Array(N);
  for (let i = 0; i < N; i++) w[i] = Math.random() < 0.27 ? 1 : 0;
  for (const p of [START, GOAL]) for (const d of [0, 1, -1, COLS, -COLS]) w[p + d] = 0;
  return w;
}

export default function SearchLab() {
  const canvasRef = useRef(null);
  const walls = useRef(randomWalls());
  const run = useRef({ result: null, shown: 0, pathShown: 0, raf: 0 });
  const paint = useRef(null);
  const reduced = useReducedMotion();
  const [algo, setAlgo] = useState('astar');
  const [stats, setStats] = useState({ explored: 0, length: 0, state: 'idle' });
  const [ref, inView] = useInView();

  const draw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = cv.clientWidth, cell = w / COLS, hgt = cell * ROWS;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(hgt * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, hgt);
    const box = (i, color, inset = 1.5, round = 4) => {
      const x = (i % COLS) * cell, y = ((i / COLS) | 0) * cell;
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2, round); ctx.fill();
    };
    for (let i = 0; i < N; i++) box(i, walls.current[i] ? C.wall : C.grid);
    const { result, shown, pathShown } = run.current;
    if (result) {
      for (let k = 0; k < shown; k++) box(result.order[k], k > shown - 12 && shown < result.order.length ? C.front : C.seen);
      for (let k = 0; k < pathShown; k++) box(result.path[k], C.path, 3, 6);
    }
    for (const p of [START, GOAL]) {
      const x = (p % COLS + 0.5) * cell, y = (((p / COLS) | 0) + 0.5) * cell;
      ctx.fillStyle = C.start; ctx.beginPath(); ctx.arc(x, y, cell * 0.36, 0, 7); ctx.fill();
      ctx.fillStyle = C.wall; ctx.beginPath(); ctx.arc(x, y, cell * (p === GOAL ? 0.16 : 0), 0, 7); ctx.fill();
    }
  }, []);

  const stop = useCallback(() => { cancelAnimationFrame(run.current.raf); }, []);
  const clearRun = useCallback(() => { stop(); run.current = { result: null, shown: 0, pathShown: 0, raf: 0 }; setStats({ explored: 0, length: 0, state: 'idle' }); draw(); }, [stop, draw]);

  const launch = useCallback((which) => {
    stop();
    const result = solve(walls.current, which);
    const r = (run.current = { result, shown: 0, pathShown: 0, raf: 0 });
    const end = () => setStats({ explored: result.order.length, length: result.found ? result.path.length - 1 : 0, state: result.found ? 'found' : 'none' });
    if (reduced) { r.shown = result.order.length; r.pathShown = result.path.length; draw(); end(); return; }
    setStats({ explored: 0, length: 0, state: 'running' });
    const tick = () => {
      if (r.shown < result.order.length) r.shown = Math.min(result.order.length, r.shown + 3);
      else if (r.pathShown < result.path.length) r.pathShown++;
      else { draw(); end(); return; }
      draw();
      if (r.shown % 9 === 0) setStats((s) => ({ ...s, explored: r.shown }));
      r.raf = requestAnimationFrame(tick);
    };
    r.raf = requestAnimationFrame(tick);
  }, [draw, stop, reduced]);

  // Premier passage à l'écran : une recherche se lance toute seule.
  useEffect(() => { if (inView) launch('astar'); }, [inView, launch]);
  useEffect(() => { draw(); addEventListener('resize', draw); return () => { removeEventListener('resize', draw); stop(); }; }, [draw, stop]);

  const cellAt = (e) => {
    const r = canvasRef.current.getBoundingClientRect(), cell = r.width / COLS;
    const x = Math.floor((e.clientX - r.left) / cell), y = Math.floor((e.clientY - r.top) / cell);
    return x < 0 || y < 0 || x >= COLS || y >= ROWS ? -1 : y * COLS + x;
  };
  const onDown = (e) => {
    const i = cellAt(e); if (i < 0 || i === START || i === GOAL) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (run.current.result) clearRun();
    paint.current = walls.current[i] ? 0 : 1; walls.current[i] = paint.current; draw();
  };
  const onMove = (e) => {
    if (paint.current === null) return;
    const i = cellAt(e); if (i < 0 || i === START || i === GOAL) return;
    walls.current[i] = paint.current; draw();
  };
  const onUp = () => { paint.current = null; };
  const choose = (key) => { setAlgo(key); launch(key); };
  const current = ALGOS.find((a) => a.key === algo);

  return (
    <section className="block tone-cream lab" id="labo" ref={ref}>
      <div className="wrap">
        <Reveal as="h2" className="display xl">Le labo</Reveal>
        <p className="section-lede">Trois façons de chercher un chemin. Dessinez des murs sur la grille, changez d’algorithme et comparez le nombre de cases explorées.</p>
        <div className="lab-bar">
          <div className="filters" role="group" aria-label="Algorithme de recherche">
            {ALGOS.map((a) => <button type="button" key={a.key} aria-pressed={algo === a.key} onClick={() => choose(a.key)}>{a.label}</button>)}
          </div>
          <div className="lab-actions">
            <button type="button" className="btn btn-night" onClick={() => launch(algo)}>Relancer la recherche</button>
            <button type="button" className="btn btn-line" onClick={() => { walls.current = randomWalls(); launch(algo); }}>Nouveau labyrinthe</button>
            <button type="button" className="btn btn-line" onClick={() => { walls.current = new Uint8Array(N); clearRun(); }}>Effacer les murs</button>
          </div>
        </div>
        <canvas
          ref={canvasRef} className="lab-grid" role="img"
          aria-label="Grille de recherche de chemin. Cliquez ou glissez pour dessiner des murs."
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        />
        <div className="lab-stats" aria-live="polite">
          <p><b>{stats.explored}</b><span>cases explorées</span></p>
          <p><b>{stats.state === 'none' ? '0' : stats.length}</b><span>{stats.state === 'none' ? 'aucun chemin possible' : 'pas jusqu’à la cible'}</span></p>
          <p className="lab-note"><b>{current.label}</b><span>{current.note}</span></p>
        </div>
      </div>
    </section>
  );
}
