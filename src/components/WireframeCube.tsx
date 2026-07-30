import { useEffect, useRef } from 'react';

export default function WireframeCube({ size = 220 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const s = size * 0.28;
    const fov = size * 1.4;

    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ].map(([x, y, z]) => ({ x: x * s, y: y * s, z: z * s }));

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      angleX += 0.004;
      angleY += 0.007;
      angleZ += 0.002;

      const rotate = (p: { x: number; y: number; z: number }) => {
        let { x, y, z } = p;
        let cos = Math.cos(angleY), sin = Math.sin(angleY);
        let nx = x * cos - z * sin;
        let nz = x * sin + z * cos;
        x = nx; z = nz;
        cos = Math.cos(angleX); sin = Math.sin(angleX);
        let ny = y * cos - z * sin;
        nz = y * sin + z * cos;
        y = ny; z = nz;
        cos = Math.cos(angleZ); sin = Math.sin(angleZ);
        nx = x * cos - y * sin;
        ny = x * sin + y * cos;
        return { x: nx, y: ny, z };
      };

      const projected = vertices.map((v) => {
        const r = rotate(v);
        const scale = fov / (fov + r.z + s * 2);
        return { sx: cx + r.x * scale, sy: cy + r.y * scale, depth: (r.z + s * 2) / (s * 4), scale };
      });

      // Edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.depth + pb.depth) / 2;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.strokeStyle = `rgba(255, ${Math.floor(40 + depth * 80)}, ${Math.floor(40 + depth * 60)}, ${0.15 + depth * 0.35})`;
        ctx.lineWidth = 0.6 + depth * 0.8;
        ctx.stroke();
      }

      // Vertices
      for (const p of projected) {
        const r = 1.5 + p.depth * 2;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(60 + p.depth * 100)}, ${Math.floor(60 + p.depth * 80)}, ${0.3 + p.depth * 0.7})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />;
}
