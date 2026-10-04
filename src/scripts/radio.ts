// Canvas animation: the hero's interactive wave field. Ported from the "Leyline Site v3" design. Honors
// prefers-reduced-motion by drawing a single still frame.

interface PacketSeed {
  P: number;
  off: number;
  seed: number;
  beat: number;
}

interface Packet {
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  amp: number;
  k: number;
  w: number;
  tilt: number;
  skew: number;
  s: number;
}

interface Ripple {
  x: number;
  y: number;
  t: number;
  v: number;
  wd: number;
  tau: number;
  a: number;
}

interface Graphics {
  x: CanvasRenderingContext2D;
  W: number;
  H: number;
}

const STILL_T = 9;

function sn(v: number, a: number, b: number, c: number) {
  return (Math.sin(v * a) + Math.sin(v * b + 1.7) * 0.6 + Math.sin(v * c + 4.1) * 0.35) / 1.95;
}

// A slowly drifting wave packet that crosses the field.
function packet(p: PacketSeed, t: number, W: number, H: number): Packet {
  const ph = t / p.P + p.off;
  const u = ph % 1;
  const s = p.seed + Math.floor(ph) * 3.7;
  const life = Math.sin(u * Math.PI);
  const bt = t / p.beat + s;
  const bf = ((bt % 1) + 1) % 1;
  const contract =
    bf < 0.22 ? Math.sin(((bf / 0.22) * Math.PI) / 2) : Math.pow(1 - (bf - 0.22) / 0.78, 2.2);
  const jolt = (1 - Math.pow(1 - Math.min(1, bf / 0.35), 3)) * (1 - bf) * 26;
  const st = t * 0.33;
  return {
    cx: -380 + u * (W + 760) + jolt + sn(st + s, 0.31, 0.53, 0.97) * 50,
    cy: H * (0.42 + 0.22 * Math.sin(s * 1.3)) + sn(st + s, 0.11, 0.23, 0.41) * 90 - contract * 10,
    sx: (210 + sn(st + s, 0.17, 0.29, 0.61) * 70) * (1 - contract * 0.16),
    sy: (125 + sn(st + s * 2, 0.13, 0.37, 0.71) * 40) * (1 + contract * 0.1),
    amp: (14 + sn(st + s, 0.21, 0.43, 0.83) * 6 + contract * 9) * Math.pow(life, 0.7),
    k: 0.032 + sn(st + s * 3, 0.09, 0.19, 0.33) * 0.009 + contract * 0.006,
    w: 0.42 + sn(st + s, 0.07, 0.15, 0.27) * 0.18,
    tilt: sn(st + s, 0.05, 0.12, 0.2) * 0.012,
    skew: sn(st + s, 0.19, 0.31, 0.5) * 0.004,
    s,
  };
}

// Draw the field of horizontal lines, displaced by packets and ripples, with
// energetic segments highlighted in teal.
function field(g: Graphics, t: number, packets: Packet[], ripples: Ripple[], n: number) {
  const { x, W, H } = g;
  const top = 60;
  const gap = (H - top - 40) / n;
  for (let i = 0; i <= n; i++) {
    const y = top + i * gap;
    const hot: [number, number, number][] = [];
    x.lineWidth = 1;
    x.strokeStyle = 'rgba(155,161,166,0.10)';
    x.beginPath();
    for (let px = 0; px <= W; px += 5) {
      let dy = Math.sin(px * 0.005 + t * 0.12 + i * 0.41) * 1.1;
      let E = 0;
      for (const p of packets) {
        const ddx = px - p.cx;
        const ddy = y - p.cy;
        const lump = 1 + 0.35 * Math.sin(ddx * 0.011 + ddy * 0.017 + t * 0.2 + p.s);
        const e = Math.exp(-Math.pow(ddx / p.sx, 2) - Math.pow(ddy / p.sy, 2)) * lump;
        if (e < 0.002) continue;
        const kk = p.k + p.skew * (ddx / p.sx);
        dy += e * p.amp * Math.sin(ddx * kk + ddy * p.tilt * 10 - t * p.w + p.s);
        E += e * Math.min(1, p.amp / 18);
      }
      for (const r of ripples) {
        const age = t - r.t;
        const d = Math.hypot(px - r.x, y - r.y);
        const q = (d - age * r.v) / r.wd;
        if (q * q > 9) continue;
        const e = r.a * Math.exp(-age / r.tau) * Math.exp(-q * q);
        dy += e * 14 * Math.sin((d - age * r.v) * 0.07);
        E += e * 0.9;
      }
      const py = y + dy;
      if (px === 0) x.moveTo(px, py);
      else x.lineTo(px, py);
      if (E > 0.04) hot.push([px, py, Math.min(1, E)]);
    }
    x.stroke();
    for (let k = 1; k < hot.length; k++) {
      const [x0, y0] = hot[k - 1];
      const [x1, y1, e] = hot[k];
      if (x1 - x0 > 6) continue;
      x.strokeStyle = `rgba(47,182,163,${Math.min(0.9, e * 0.95)})`;
      x.lineWidth = 1.2;
      x.beginPath();
      x.moveTo(x0, y0);
      x.lineTo(x1, y1);
      x.stroke();
    }
  }
}

class HeroField {
  private seed: PacketSeed = { P: 95, off: 0.45, seed: 2.3, beat: 6.4 };
  private ptr = { x: 0, y: 0, in: false, held: false, lx: null as number | null, ly: 0, down: 0 };
  private wake = { rip: [] as Ripple[], dn: 0, auto: 0 };

  constructor(
    private canvas: HTMLCanvasElement,
    private host: HTMLElement
  ) {
    this.bindPointer();
  }

  private bindPointer() {
    const el = this.host;
    const pos = (e: PointerEvent): [number, number] => {
      const r = el.getBoundingClientRect();
      const k = el.clientWidth / r.width;
      return [(e.clientX - r.left) * k, (e.clientY - r.top) * k];
    };
    el.addEventListener('pointermove', (e) => {
      [this.ptr.x, this.ptr.y] = pos(e);
      this.ptr.in = true;
    });
    el.addEventListener('pointerleave', () => {
      if (!this.ptr.held) this.ptr.in = false;
    });
    el.addEventListener('pointerdown', (e) => {
      const target = e.target as Element | null;
      if (target?.closest('a,button')) return;
      [this.ptr.x, this.ptr.y] = pos(e);
      this.ptr.in = true;
      this.ptr.held = true;
      this.ptr.down++;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Capture is best-effort.
      }
      e.preventDefault();
    });
    const up = (e: PointerEvent) => {
      this.ptr.held = false;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        this.ptr.in = false;
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }

  private context(): Graphics | null {
    const c = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    const x = c.getContext('2d');
    if (!x) return null;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#0B0D0F';
    x.fillRect(0, 0, W, H);
    return { x, W, H };
  }

  draw(t: number) {
    const g = this.context();
    if (!g) return;
    const p = this.ptr;
    const S = this.wake;
    const R = S.rip;
    if (p.in) {
      if (p.lx == null) {
        p.lx = p.x;
        p.ly = p.y;
      }
      const d = Math.hypot(p.x - p.lx, p.y - p.ly);
      if (d > 46) {
        R.push({ x: p.x, y: p.y, t, v: 34, wd: 34, tau: 5, a: Math.min(0.9, 0.25 + d / 260) });
        p.lx = p.x;
        p.ly = p.y;
      }
    } else {
      p.lx = null;
      if (t - S.auto > 10) {
        S.auto = t;
        R.push({
          x: g.W * (0.55 + 0.3 * Math.sin(t * 0.7)),
          y: g.H * (0.35 + 0.25 * Math.sin(t * 1.3)),
          t,
          v: 30,
          wd: 44,
          tau: 7,
          a: 0.9,
        });
      }
    }
    if (p.down !== S.dn) {
      S.dn = p.down;
      R.push({ x: p.x, y: p.y, t, v: 46, wd: 52, tau: 7, a: 1.5 });
    }
    while (R.length && (t - R[0].t > 22 || R.length > 24)) R.shift();
    field(g, t, [packet(this.seed, t, g.W, g.H)], R, Math.max(28, Math.round(g.H / 16)));
  }
}

export function initRadio() {
  const heroCanvas = document.querySelector<HTMLCanvasElement>('[data-field]');
  const heroHost = document.querySelector<HTMLElement>('[data-hero]');
  const hero = heroCanvas && heroHost ? new HeroField(heroCanvas, heroHost) : null;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let heroVisible = true;

  const loop = (ts: number) => {
    if (heroVisible) hero?.draw(ts / 1000);
    raf = requestAnimationFrame(loop);
  };

  const drawStill = () => hero?.draw(STILL_T);

  const start = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', drawStill);
    if (motion.matches) {
      drawStill();
      window.addEventListener('resize', drawStill);
    } else {
      raf = requestAnimationFrame(loop);
    }
  };

  // Skip the hero's per-frame work while it is scrolled out of view.
  if (heroHost && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
    }).observe(heroHost);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });
  motion.addEventListener('change', start);
  start();
}
