// components/spotlight.tsx
import { useRef, useState, useEffect } from 'react';

const SpotlightEffect = ({ children }: { children: React.ReactNode }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (divRef.current) {
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    const div = divRef.current;
    if (div) {
      div.addEventListener('mousemove', handleMouseMove);
      div.addEventListener('mouseenter', handleMouseEnter);
      div.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        div.removeEventListener('mousemove', handleMouseMove);
        div.removeEventListener('mouseenter', handleMouseEnter);
        div.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="relative overflow-hidden"
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.1), transparent)`,
          opacity,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
    </div>
  );
};

export default SpotlightEffect;