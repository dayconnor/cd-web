// The weather over the homepage scene: drifting fog that the lamp lights up,
// three depths of falling snow (the nearest ones soft, like out-of-focus
// flakes in front of a lens), and halation around the bulb.
//
// One fragment shader on a transparent canvas laid over the SVG landscape.
// It draws at reduced resolution, stops when the hero is off screen or the
// tab is hidden, and draws a single still frame for reduced motion. Without
// WebGL the page is unchanged; the landscape underneath is complete on its own.

const FRAG = `
precision highp float;
uniform vec2 R;     // drawing buffer size
uniform float T;    // seconds
uniform vec2 L;     // lamp position in buffer pixels, origin bottom-left

float h(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.0), f.x), f.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * n(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
  return s;
}

// One depth of snow. Each grid cell holds at most one flake.
float snow(vec2 uv, float scale, float speed, float size, float seed, float density) {
  uv *= scale;
  uv.y += T * speed;
  uv.x += sin(T * 0.37 + uv.y * 0.31 + seed) * 0.35;
  vec2 c = floor(uv), f = fract(uv);
  if (h(c + seed) > density) return 0.0;
  vec2 o = vec2(h(c + seed + 3.1), h(c + seed + 7.7)) * 0.7 + 0.15;
  float d = length(f - o);
  return smoothstep(size, size * 0.15, d) * (0.45 + 0.55 * h(c + seed + 1.3));
}

void main() {
  vec2 uv = gl_FragCoord.xy / R.y;
  float y = gl_FragCoord.y / R.y;
  float d = length(uv - L / R.y);
  float lamp = exp(-d * 6.0);

  // Fog banks: densest just above the horizon, drifting slowly sideways.
  float band = exp(-pow((y - 0.36) / 0.17, 2.0)) * 0.95 + 0.12;
  float f = fbm(vec2(uv.x * 1.5 + T * 0.016, uv.y * 3.4 - T * 0.005));
  float fogA = smoothstep(0.38, 0.86, f) * band * (0.15 + 0.55 * lamp);
  vec3 fogC = mix(vec3(0.42, 0.48, 0.56), vec3(0.96, 0.95, 0.9), clamp(lamp * 1.5, 0.0, 1.0));

  float s = snow(uv, 26.0, 0.8, 0.09, 1.0, 0.33) * 0.35
          + snow(uv + 3.0, 13.0, 1.2, 0.07, 4.0, 0.24) * 0.6
          + snow(uv + 7.0, 5.5, 1.6, 0.14, 9.0, 0.10) * 0.28;
  s *= 0.4 + 1.7 * lamp;

  float glow = 0.5 * exp(-d * 30.0) + 0.12 * lamp;

  vec3 col = fogC * fogA + vec3(0.88, 0.92, 0.97) * s + vec3(1.0, 0.98, 0.93) * glow;
  gl_FragColor = vec4(col, clamp(fogA + s + glow, 0.0, 1.0));
}`;

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Without a bulb (the photo homepage) the lamp terms fall to zero and only
// soft snow and a faint fog remain.
function start(canvas: HTMLCanvasElement, bulb: Element | null) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  // One triangle that covers the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(prog, "R");
  const uT = gl.getUniformLocation(prog, "T");
  const uL = gl.getUniformLocation(prog, "L");

  // Fog and snow have no fine detail, so a smaller buffer is enlarged by the
  // browser at no visible cost: about one buffer pixel per CSS pixel at most.
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.66;
    canvas.width = Math.max(1, Math.round(box.width * scale));
    canvas.height = Math.max(1, Math.round(box.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uR, canvas.width, canvas.height);
    if (bulb) {
      const b = bulb.getBoundingClientRect();
      gl.uniform2f(
        uL,
        (b.left + b.width / 2 - box.left) * scale,
        (box.bottom - (b.top + b.height / 2)) * scale,
      );
    } else {
      gl.uniform2f(uL, -1e5, -1e5);
    }
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let frame = 0;
  const t0 = performance.now() - 40_000 * Math.random();

  const draw = (now: number) => {
    // Wrapped so float precision in the shader never degrades on long visits.
    gl.uniform1f(uT, ((now - t0) / 1000) % 900);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (now: number) => {
    draw(now);
    frame = requestAnimationFrame(loop);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    if (reduce.matches) draw(performance.now());
    else if (visible && !document.hidden) frame = requestAnimationFrame(loop);
  };

  resize();
  draw(performance.now());
  canvas.classList.add("is-on");
  sync();

  new ResizeObserver(() => {
    resize();
    if (reduce.matches || !visible) draw(performance.now());
  }).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener("visibilitychange", sync);
  reduce.addEventListener("change", sync);
  canvas.addEventListener("webglcontextlost", () => cancelAnimationFrame(frame));
}

const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-atmo]");
const bulb = document.querySelector("[data-bulb]");
if (canvas) {
  // Wait until the page has painted and gone idle, so the weather never
  // competes with the content for the first frame.
  const go = () => start(canvas, bulb);
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1200 });
  else setTimeout(go, 200);
}
