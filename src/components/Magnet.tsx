import { useRef, useState, useCallback, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [style, setStyle] = useState({ transform: 'translate3d(0,0,0)' });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      setStyle({
        transform: `translate3d(${dx / strength}px, ${dy / strength}px, 0)`,
      });
    },
    [strength]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setActive(true);
      handleMouseMove(e);
    },
    [handleMouseMove]
  );

  const handleMouseLeave = useCallback(() => {
    setActive(false);
    setStyle({ transform: 'translate3d(0,0,0)' });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ padding, margin: -padding, display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          ...style,
          transition: active ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
