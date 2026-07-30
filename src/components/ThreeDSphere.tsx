import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
}

export default function ThreeDSphere({ size = 340 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const targetTiltX = useRef(0.25);
  const targetTiltY = useRef(0);
  const tiltX = useRef(0.25);
  const tiltY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;
    const fov = size * 1.5;

    const points: Point3D[] = [];
    const rings = 14;
    const pointsPerRing = 18;

    for (let i = 0; i <= rings; i++) {
      const phi = (Math.PI * i) / rings;
      const count = i === 0 || i === rings ? 1 : pointsPerRing;
      for (let j = 0; j < count; j++) {
        const theta = (2 * Math.PI * j) / count;
        const x = R * Math.sin(phi) * Math.cos(theta);
        const y = R * Math.cos(phi);
        const z = R * Math.sin(phi) * Math.sin(theta);
        points.push({ x, y, z, ox: x, oy: y, oz: z });
      }
    }

    const project = (p: Point3D) => {
      const scale = fov / (fov + p.z + R);
      return {
        sx: cx + p.x * scale,
        sy: cy + p.y * scale,
        scale,
        depth: (p.z + R) / (2 * R),
      };
    };

    const rotateY = (p: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { ...p, x: p.ox * cos - p.oz * sin, z: p.ox * sin + p.oz * cos, y: p.oy };
    };

    const rotateX = (p: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { ...p, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetTiltY.current = nx * 0.5;
      targetTiltX.current = 0.25 + ny * 0.35;
    };
    const onPointerLeave = () => {
      targetTiltY.current = 0;
      targetTiltX.current = 0.25;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      angleRef.current += 0.004;
      tiltX.current += (targetTiltX.current - tiltX.current) * 0.06;
      tiltY.current += (targetTiltY.current - tiltY.current) * 0.06;

      const rotated = points.map((p) => {
        const ry = rotateY(p, angleRef.current + tiltY.current);
        return rotateX(ry, tiltX.current);
      });

      const projected = rotated.map((p) => ({ ...p, ...project(p) }));

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < R * 0.52) {
            const avgDepth = (a.depth + b.depth) / 2;
            const opacity = 0.06 + avgDepth * 0.24;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `rgba(255, ${Math.floor(30 + avgDepth * 70)}, ${Math.floor(30 + avgDepth * 50)}, ${opacity})`;
            ctx.lineWidth = 0.4 + avgDepth * 0.6;
            ctx.stroke();
          }
        }
      }

      for (const p of projected) {
        const r = 1.2 + p.depth * 2.2;
        const opacity = 0.25 + p.depth * 0.75;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(50 + p.depth * 90)}, ${Math.floor(50 + p.depth * 70)}, ${opacity})`;
        ctx.fill();

        if (p.depth > 0.55) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 3);
          grad.addColorStop(0, `rgba(255,90,90,${(p.depth - 0.55) * 0.6})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />;
}
