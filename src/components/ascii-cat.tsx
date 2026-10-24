"use client";

import { useEffect, useRef } from "react";

const TICK_MS = 250;
const SLEEP_AFTER_MS = 20_000;
const HAPPY_MS = 1_500;

const TAILS = {
  right: ["   )", "  (", "__/"],
  up: ["  |", "  |", "__/"],
  left: [" (", "  )", "__/"],
  down: ["", "", "___~"],
};
const SWISH = [TAILS.right, TAILS.up, TAILS.left, TAILS.up];
const SWISH_TICKS = 3;

// Random wait in ticks, so the cat mostly sits still between small movements.
function pause(minTicks: number, spreadTicks: number) {
  return minTicks + Math.floor(Math.random() * spreadTicks);
}
const ZZZ = ["z", "zZ", "zZz", "zZz"];

function draw(face: string, tail: string[], above = "") {
  return [
    `    ${above}`,
    `  /\\_/\\`,
    ` (${face})`,
    `  > ^ <`,
    ` /     \\ ${tail[0]}`,
    `(  | |  )${tail[1]}`,
    ` \\_|_|_/${tail[2]}`,
  ].join("\n");
}

// Writes frames straight into the <pre> instead of going through React state,
// so the animation never re-renders anything. One timer drives it all, and it
// stops while the tab is hidden.
export function AsciiCat() {
  const preRef = useRef<HTMLPreElement>(null);
  const happyUntil = useRef(0);
  const lastActive = useRef(0);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pre.textContent = draw(" o.o ", TAILS.down);
      return;
    }

    let tick = 0;
    let blinkAt = pause(24, 32);
    let swishAt = pause(32, 32);
    let mouseX = -1;
    let timer: number | undefined;
    lastActive.current = Date.now();

    function render() {
      const now = Date.now();
      const asleep = now - lastActive.current > SLEEP_AFTER_MS;

      if (now < happyUntil.current) {
        pre!.textContent = draw(" ^.^ ", SWISH[Math.floor(tick / 2) % 4], " <3");
      } else if (asleep) {
        pre!.textContent = draw(" -.- ", TAILS.down, ZZZ[Math.floor(tick / 8) % 4]);
      } else {
        let face = " o.o ";
        if (tick >= blinkAt) {
          face = " -.- ";
          blinkAt = tick + pause(32, 32);
        } else if (mouseX >= 0) {
          const box = pre!.getBoundingClientRect();
          if (mouseX < box.left - 40) face = "o.o  ";
          else if (mouseX > box.right + 40) face = "  o.o";
        }

        // One slow swish, then the tail rests curled until the next one.
        let tail = TAILS.down;
        const swishFrame = Math.floor((tick - swishAt) / SWISH_TICKS);
        if (swishFrame >= SWISH.length) swishAt = tick + pause(32, 32);
        else if (swishFrame >= 0) tail = SWISH[swishFrame];

        pre!.textContent = draw(face, tail);
      }
      tick++;
    }

    function loop() {
      render();
      timer = window.setTimeout(loop, TICK_MS);
    }

    function onVisibility() {
      window.clearTimeout(timer);
      if (!document.hidden) loop();
    }

    function onMove(e: PointerEvent) {
      mouseX = e.clientX;
      lastActive.current = Date.now();
    }

    loop();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  function pet() {
    happyUntil.current = Date.now() + HAPPY_MS;
    lastActive.current = Date.now();
  }

  return (
    <button
      type="button"
      onClick={pet}
      aria-label="Pet the cat"
      className="fixed right-6 bottom-6 hidden cursor-pointer text-neutral-500 select-none lg:block"
    >
      <pre
        ref={preRef}
        aria-hidden="true"
        className="text-left font-mono text-sm leading-tight"
      >
        {draw(" o.o ", TAILS.down)}
      </pre>
    </button>
  );
}
