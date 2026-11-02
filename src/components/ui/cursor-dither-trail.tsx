// CursorDitherTrail.tsx – fluid monochrome dither tail that follows the cursor
// -----------------------------------------------------------------------------
// Concept: as the user moves the mouse, we paint tiny 2×2 pixel blocks onto a
// full‑size canvas.  Each new block is chosen either as `trailColor` or fully
// transparent based on a pseudo‑random threshold (simple Bayer matrix), giving
// the appearance of a dynamic dithering effect that fades out with time.
//
// Props
//  • trailColor     ‑ HEX string used for the dots (default lime‑green)
//  • dotSize        ‑ pixel size of each painted square (1–4 recommended)
//  • fadeDuration   ‑ ms until a dot fully fades (via alpha decay)
//  • className      ‑ tailwind classes for outer wrapper (size control)
//
// The component uses `requestAnimationFrame` to gradually clear older drawings
// creating a smooth, fluid tail rather than an instantly filling canvas.
// -----------------------------------------------------------------------------
import React, { useRef, useEffect } from "react";

interface CursorDitherTrailProps {
  trailColor?: string; // monochrome colour of dots
  dotSize?: number; // side length of a pixel square (1‑4px)
  fadeDuration?: number; // milliseconds for a dot to vanish
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

export function CursorDitherTrail({
  trailColor = "#D0FBB6", // lime by default
  dotSize = 4,
  fadeDuration = 600,
  className = "w-full h-full",
  containerRef,
}: CursorDitherTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust on resize
    const onResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    // Convert hex → rgba once
    const int = parseInt(trailColor.replace("#", ""), 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    // Cada ponto guarda o instante em que foi pintado e o quadro redesenha o
    // canvas inteiro com o alfa calculado pela idade. Apagar com
    // "destination-out" a cada quadro deixava um resíduo: o canal alfa tem 8
    // bits e valores baixos arredondam de volta para si mesmos, então o rastro
    // nunca sumia por completo.
    const dots = new Map<number, { x: number; y: number; t: number }>();
    let frame = 0;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      dots.forEach((dot, key) => {
        const alpha = 1 - (now - dot.t) / fadeDuration;
        if (alpha <= 0) {
          dots.delete(key);
          return;
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
      });
      // Sem pontos restantes o canvas já está limpo: para o loop.
      frame = dots.size > 0 ? requestAnimationFrame(draw) : 0;
    };

    const paintDot = (x: number, y: number) => {
      dots.set(y * 100000 + x, { x, y, t: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / dotSize) * dotSize;
      const y = Math.floor((e.clientY - rect.top) / dotSize) * dotSize;

      // Only paint if mouse is within canvas bounds
      if (x >= 0 && x < width && y >= 0 && y < height) {
        paintDot(x, y);
      }
    };

    const target = containerRef?.current || canvas;
    target.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [trailColor, dotSize, fadeDuration, containerRef]);

  return <canvas ref={canvasRef} className={className} style={{ pointerEvents: 'none' }} />;
}

export default CursorDitherTrail;
