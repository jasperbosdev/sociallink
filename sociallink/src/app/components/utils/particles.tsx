import React, { useRef, useEffect } from 'react';

const ParticleEffectComponent = ({
  className = '',
  quantity = 40,
  size = 1.5,
  color = '#ffffff',
  speed = 0.1 // Adjusted speed parameter for more noticeable spread
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<any[]>([]);
  const canvasSize = useRef({ w: 0, h: 0 });
  const devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // Helper to generate random positions and velocities
  const randomPosition = (max: number) => Math.random() * max;
  const randomVelocity = (max: number) => (Math.random() - 0.5) * max;

  // Initialize particles with spread
  const createParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < quantity; i++) {
      particlesRef.current.push({
        x: randomPosition(canvasSize.current.w),
        y: randomPosition(canvasSize.current.h),
        size: Math.random() * size + 1,
        dx: randomVelocity(speed), // Random velocity for spread
        dy: randomVelocity(speed)  // Random velocity for spread
      });
    }
  };

  // Update and move particles
  const updateParticles = () => {
    const context = contextRef.current;
    if (!context) return;

    const { w, h } = canvasSize.current;
    context.clearRect(0, 0, w, h);

    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.dx;
      particle.y += particle.dy;

      // Boundary detection and wrap-around
      if (particle.x < 0) particle.x = w;
      if (particle.x > w) particle.x = 0;
      if (particle.y < 0) particle.y = h;
      if (particle.y > h) particle.y = 0;

      // Draw particle
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
    });

    requestAnimationFrame(updateParticles);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parentElement = canvas.parentElement;
      if (parentElement) {
        canvasSize.current.w = parentElement.offsetWidth;
        canvasSize.current.h = parentElement.offsetHeight;
        canvas.width = canvasSize.current.w * devicePixelRatio;
        canvas.height = canvasSize.current.h * devicePixelRatio;
        canvas.style.width = `${canvasSize.current.w}px`;
        canvas.style.height = `${canvasSize.current.h}px`;
        const context = contextRef.current;
        if (context) {
          context.scale(devicePixelRatio, devicePixelRatio);
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      contextRef.current = canvas.getContext('2d');
      resizeCanvas();
      createParticles();
      updateParticles();
      window.addEventListener('resize', resizeCanvas);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [quantity, size, color, speed]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full h-full bg-transparent"></canvas>
    </div>
  );
};

export default ParticleEffectComponent;