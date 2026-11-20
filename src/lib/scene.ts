// Procedural winter-night scenery, generated at build time as SVG strings.
// Everything is seeded, so a given seed always draws the same picture and the
// built HTML never changes between deploys unless the content does.

export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedOf(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const r1 = (n: number) => Math.round(n * 10) / 10;
type Rand = () => number;

// One pine: a stack of drooping tiers on a thin trunk, standing on `base`.
// Small, distant trees get fewer tiers: the detail wouldn't show, and every
// point is bytes in the page. `q` rounds coordinates (1 = whole units).
export function pine(x: number, base: number, h: number, rand: Rand, q = 0.1) {
  const top = base - h;
  const w = h * (0.34 + rand() * 0.1);
  const tiers = h < 12 ? 2 : h < 30 ? 3 : h < 70 ? 4 : 4 + Math.floor(rand() * 3);
  const rd = (n: number) => Math.round(n / q) * q;
  const trunk = Math.max(0.6, h * 0.012);
  const left: [number, number][] = [[x, top]];
  for (let i = 1; i <= tiers; i++) {
    const y = top + (h * 0.86 * i) / tiers;
    const hw = (w / 2) * (0.3 + 0.7 * (i / tiers)) * (0.9 + rand() * 0.2);
    left.push([x - hw, y]);
    if (i < tiers) left.push([x - hw * 0.45, y - h * 0.035]);
  }
  left.push([x - trunk, top + h * 0.86], [x - trunk, base]);
  const right = left
    .slice(1)
    .reverse()
    .map(([px, py]) => [2 * x - px, py] as [number, number]);
  return "M" + [...left, ...right].map(([px, py]) => `${+rd(px).toFixed(1)} ${+rd(py).toFixed(1)}`).join("L") + "Z";
}

interface TreeOpts {
  seed: number;
  from: number;
  to: number;
  base: number | ((x: number) => number);
  minH: number;
  maxH: number;
  gap: [number, number];
  tall?: number;
  wrap?: number; // tile width, to repeat trees that cross the edge
  q?: number;    // coordinate rounding, see pine()
}

export function trees(o: TreeOpts) {
  const rand = rng(o.seed);
  const out: string[] = [];
  for (let x = o.from; x < o.to; x += o.gap[0] + rand() * o.gap[1]) {
    const h = (o.minH + rand() * (o.maxH - o.minH)) * (rand() < (o.tall ?? 0.12) ? 1.35 : 1);
    const base = typeof o.base === "function" ? o.base(x) : o.base;
    const s = Math.floor(rand() * 1e9);
    out.push(pine(x, base, h, rng(s), o.q));
    if (o.wrap && x < 40) out.push(pine(x + o.wrap, base, h, rng(s), o.q));
    if (o.wrap && x > o.wrap - 40) out.push(pine(x - o.wrap, base, h, rng(s), o.q));
  }
  return out.join("");
}

// A sagging wire between two points.
export const wire = (x1: number, y1: number, x2: number, y2: number, sag: number) =>
  `M${r1(x1)} ${r1(y1)}Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + sag)} ${r1(x2)} ${r1(y2)}`;

// Three moods taken from the reference photographs: blue-slate dusk, the
// brown-black of snowfall under a lamp, and the teal of a lit snowbank.
export const moods = [
  { sky: ["#0b0e14", "#161c26", "#2a3341"], snow: ["#36404d", "#66768a"], tree: "#090c11", far: "#1b222c" },
  { sky: ["#0d0c0d", "#1d1a1a", "#332d2b"], snow: ["#3b3a3e", "#727684"], tree: "#0a0a0b", far: "#221f1f" },
  { sky: ["#0a0f12", "#142027", "#253a43"], snow: ["#33454f", "#6d8796"], tree: "#070b0d", far: "#16232a" },
];

// A small scene for each project. The seed (the slug) picks the mood, where
// the lamp stands, which side the woods are on, and whether there's a road.
export function vignette(slug: string, opts: { w?: number; h?: number } = {}) {
  const W = opts.w ?? 400;
  const H = opts.h ?? 200;
  const rand = rng(seedOf(slug));
  const mood = moods[Math.floor(rand() * moods.length)];
  const id = `v-${slug}`;
  const hz = H * (0.6 + rand() * 0.06);
  const woodsLeft = rand() < 0.5;
  const lampX = W * (woodsLeft ? 0.6 + rand() * 0.18 : 0.22 + rand() * 0.18);
  const lampTop = H * (0.2 + rand() * 0.08);
  const poleBase = H * 0.94;
  const bulbX = lampX + (woodsLeft ? -14 : 14);
  const bulbY = lampTop + 5;
  const road = rand() < 0.6;
  const vx = W * (0.42 + rand() * 0.16);
  const exitY = lampTop - 14 + rand() * 10;

  const far = trees({ seed: seedOf(slug + "far"), from: -10, to: W + 10, base: hz + 1, minH: 5, maxH: 14, gap: [9, 10], q: 0.5 });
  const woods = trees({
    seed: seedOf(slug + "woods"),
    from: woodsLeft ? -12 : W * 0.62,
    to: woodsLeft ? W * 0.38 : W + 12,
    base: (x) => hz + 4 + Math.abs(x - (woodsLeft ? 0 : W)) * 0.02,
    minH: H * 0.18,
    maxH: H * 0.48,
    gap: [10, 14],
    tall: 0.2,
    q: 0.5,
  });
  const wires = [
    wire(-10, lampTop - 6, lampX, lampTop + 2, 18),
    wire(-10, lampTop + 6, lampX, lampTop + 10, 20),
    wire(lampX, lampTop + 2, W + 10, exitY, 12),
  ].join("");

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mood.sky[0]}"/><stop offset=".7" stop-color="${mood.sky[1]}"/><stop offset="1" stop-color="${mood.sky[2]}"/></linearGradient>
<linearGradient id="${id}-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mood.snow[0]}"/><stop offset="1" stop-color="${mood.snow[1]}"/></linearGradient>
<radialGradient id="${id}-glow"><stop offset="0" stop-color="#f4f1e6" stop-opacity=".6"/><stop offset=".25" stop-color="#e9ecef" stop-opacity=".14"/><stop offset="1" stop-color="#e9ecef" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1e6" stop-opacity=".16"/><stop offset="1" stop-color="#f4f1e6" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
<path fill="${mood.far}" d="${far}"/>
<rect y="${r1(hz)}" width="${W}" height="${r1(H - hz)}" fill="url(#${id}-snow)"/>
${road ? `<path fill="#11151b" d="M${r1(vx - 2)} ${r1(hz)}L${r1(vx + 2)} ${r1(hz)}L${r1(vx + W * 0.36)} ${H}L${r1(vx - W * 0.36)} ${H}Z"/>` : ""}
<path fill="${mood.tree}" d="${woods}"/>
<path fill="none" stroke="#0a0d12" stroke-width=".8" d="${wires}"/>
<g class="v-lamp">
<path fill="url(#${id}-cone)" d="M${r1(bulbX - 3)} ${r1(bulbY)}L${r1(bulbX + 3)} ${r1(bulbY)}L${r1(bulbX + 60)} ${r1(poleBase)}L${r1(bulbX - 60)} ${r1(poleBase)}Z"/>
<ellipse cx="${r1(bulbX)}" cy="${r1(poleBase - 2)}" rx="70" ry="9" fill="url(#${id}-glow)"/>
<circle class="v-halo" cx="${r1(bulbX)}" cy="${r1(bulbY)}" r="${r1(H * 0.42)}" fill="url(#${id}-glow)"/>
</g>
<path stroke="#07090c" stroke-width="2.4" d="M${r1(lampX)} ${r1(poleBase)}V${r1(lampTop - 4)}"/>
<path fill="none" stroke="#07090c" stroke-width="1.6" d="M${r1(lampX)} ${r1(lampTop)}Q${r1((lampX + bulbX) / 2)} ${r1(lampTop - 5)} ${r1(bulbX)} ${r1(bulbY - 2)}"/>
<ellipse class="v-bulb" cx="${r1(bulbX)}" cy="${r1(bulbY)}" rx="4" ry="1.6" fill="#f4f1e6"/>
</svg>`;
}

// ------------------------------------------------------------------- Hero --
// The homepage landscape, 1600x900 with the horizon at y=600 and the road
// vanishing at (820, 600). Split into a back layer (hill, tower, far trees)
// and a front layer so scrolling can move them at different speeds.
export function heroScene() {
  const VX = 820;
  const HZ = 600;

  const hill =
    "M0 572C180 498 340 520 520 548S860 488 1040 520 1360 470 1600 528V610H0Z";
  const farTrees = trees({ seed: 11, from: -10, to: 1610, base: HZ + 2, minH: 14, maxH: 40, gap: [15, 16], q: 1 });

  // A lattice transmission tower standing in the fog, right of the road.
  const tx = 1350;
  const tTop = 330;
  const tBase = HZ + 4;
  const legs = (y: number) => 34 * ((y - tTop) / (tBase - tTop)) + 7;
  const towerLines: string[] = [
    `M${tx - 7} ${tTop}L${tx - legs(tBase)} ${tBase}M${tx + 7} ${tTop}L${tx + legs(tBase)} ${tBase}`,
    `M${tx - 30} ${tTop + 18}H${tx + 30}M${tx - 24} ${tTop + 44}H${tx + 24}`,
  ];
  for (let y = tTop + 44; y < tBase - 20; y += 38) {
    const a = legs(y);
    const b = legs(y + 38);
    towerLines.push(`M${r1(tx - a)} ${y}L${r1(tx + b)} ${y + 38}M${r1(tx + a)} ${y}L${r1(tx - b)} ${y + 38}`);
  }

  const back = `<path fill="#1d242e" d="${hill}"/>
<path fill="none" stroke="#202833" stroke-width="1.6" d="${towerLines.join("")}"/>
<path fill="#151b23" d="${farTrees}"/>`;

  // Poles recede along the left of the road toward the vanishing point.
  const poles: { x: number; base: number; top: number; s: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const s = 1 / (1 + 0.9 * i);
    const x = VX + (120 - VX) * s;
    const base = HZ + (910 - HZ) * s;
    poles.push({ x, base, top: base - 660 * s, s });
  }
  const wireOffsets = [-18, 0, 18];
  const wires: string[] = [];
  const first = poles[0];
  for (const dx of wireOffsets) wires.push(wire(-120, first.top - 80 + dx, first.x + dx, first.top + 22, 50));
  for (let i = 0; i < poles.length - 1; i++) {
    const a = poles[i];
    const b = poles[i + 1];
    for (const dx of wireOffsets) {
      wires.push(wire(a.x + dx * a.s, a.top + 22 * a.s, b.x + dx * b.s, b.top + 22 * b.s, 46 * a.s));
    }
    wires.push(wire(a.x, a.top + 70 * a.s, b.x, b.top + 70 * b.s, 30 * a.s));
  }
  const poleShapes = poles
    .map(
      (p) =>
        `M${r1(p.x - 4.5 * p.s)} ${r1(p.base)}L${r1(p.x - 3 * p.s)} ${r1(p.top)}H${r1(p.x + 3 * p.s)}L${r1(p.x + 4.5 * p.s)} ${r1(p.base)}Z` +
        `M${r1(p.x - 28 * p.s)} ${r1(p.top + 18 * p.s)}h${r1(56 * p.s)}v${r1(5 * p.s)}h${r1(-56 * p.s)}Z`,
    )
    .join("");

  // The lamp: its own pole on the right side of the road.
  const L = { x: 1190, base: 870, top: 248, bx: 1108, by: 300 };
  wires.push(wire(first.x, first.top + 22, L.x, L.top + 14, 110));
  wires.push(wire(L.x, L.top + 14, 1720, L.top - 30, 40));

  const midLeft = trees({
    seed: 23,
    from: -30,
    to: 560,
    base: (x) => HZ + 26 + (560 - x) * 0.05,
    minH: 70,
    maxH: 190,
    gap: [18, 26],
    tall: 0.25,
    q: 1,
  });
  const midRight = trees({
    seed: 41,
    from: 1010,
    to: 1640,
    base: (x) => HZ + 24 + (x - 1010) * 0.05,
    minH: 90,
    maxH: 250,
    gap: [20, 28],
    tall: 0.3,
    q: 1,
  });

  const front = `<defs>
<linearGradient id="h-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f3844"/><stop offset=".55" stop-color="#4a5666"/><stop offset="1" stop-color="#5d6a7b"/></linearGradient>
<linearGradient id="h-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f27"/><stop offset="1" stop-color="#0c0f14"/></linearGradient>
<linearGradient id="h-bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4958"/><stop offset="1" stop-color="#5f6c7e"/></linearGradient>
<radialGradient id="h-glow"><stop offset="0" stop-color="#fbf8ee" stop-opacity=".55"/><stop offset=".12" stop-color="#eef0ee" stop-opacity=".2"/><stop offset=".45" stop-color="#d9e0e8" stop-opacity=".05"/><stop offset="1" stop-color="#d9e0e8" stop-opacity="0"/></radialGradient>
<radialGradient id="h-pool"><stop offset="0" stop-color="#e8eef3" stop-opacity=".42"/><stop offset="1" stop-color="#e8eef3" stop-opacity="0"/></radialGradient>
<linearGradient id="h-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f3e8" stop-opacity=".13"/><stop offset="1" stop-color="#f6f3e8" stop-opacity="0"/></linearGradient>
<linearGradient id="h-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f3e8" stop-opacity="0"/><stop offset=".5" stop-color="#f6f3e8" stop-opacity=".12"/><stop offset="1" stop-color="#f6f3e8" stop-opacity="0"/></linearGradient>
</defs>
<rect y="${HZ}" width="1600" height="300" fill="url(#h-snow)"/>
<path fill="url(#h-road)" d="M${VX - 4} ${HZ}H${VX + 4}L1250 900H370Z"/>
<path fill="none" stroke="#20262f" stroke-width="7" opacity=".7" d="M${VX - 1} ${HZ}L640 900M${VX + 1} ${HZ}L990 900"/>
<path fill="url(#h-bank)" d="M${VX - 6} ${HZ}L${VX - 3} ${HZ}L360 905L230 905Z"/>
<path fill="url(#h-bank)" d="M${VX + 3} ${HZ}L${VX + 7} ${HZ}L1420 905L1262 905Z"/>
<path fill="#0b0e13" d="${midLeft}"/>
<path fill="#090c10" d="${midRight}"/>
<g class="hero__lamplight">
<path fill="url(#h-cone)" d="M${L.bx - 5} ${L.by + 2}H${L.bx + 5}L${L.bx + 260} 880H${L.bx - 300}Z"/>
<ellipse cx="${L.bx - 20}" cy="860" rx="360" ry="70" fill="url(#h-pool)"/>
<ellipse cx="${L.bx - 40}" cy="840" rx="16" ry="70" fill="url(#h-sheen)"/>
<circle cx="${L.bx}" cy="${L.by}" r="520" fill="url(#h-glow)"/>
</g>
<path fill="none" stroke="#0b0e13" stroke-width="1.3" d="${wires.join("")}"/>
<path fill="#0a0d11" d="${poleShapes}"/>
<path fill="#0a0d11" d="M${L.x - 6} ${L.base}L${L.x - 4} ${L.top}H${L.x + 4}L${L.x + 6} ${L.base}Z"/>
<path fill="none" stroke="#0a0d11" stroke-width="5" d="M${L.x} ${L.top + 26}C${L.x - 30} ${L.top + 4} ${L.bx + 30} ${L.by - 22} ${L.bx + 8} ${L.by - 6}"/>
<path fill="#0a0d11" d="M${L.bx - 20} ${L.by - 2}Q${L.bx} ${L.by - 18} ${L.bx + 20} ${L.by - 2}Z"/>
<ellipse data-bulb cx="${L.bx}" cy="${L.by}" rx="15" ry="4.5" fill="#fbf8ee" class="hero__bulb"/>`;

  return { back, front };
}
