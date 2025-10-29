import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  isFast: boolean;
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 100 stars with only 5 fast-moving ones
    const stars: Star[] = [];
    const totalStars = 100;
    const fastStars = 5;
    
    // Create 5 fast-moving stars
    for (let i = 0; i < fastStars; i++) {
      const speed = Math.random() * 2 + 3; // Fast speed: 3-5
      const angle = Math.random() * Math.PI * 2;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 0.5 + 0.5, // Tiny: 0.5-1px
        opacity: Math.random() * 0.4 + 0.6,
        isFast: true
      });
    }
    
    // Create 95 slow-moving/stationary stars
    for (let i = fastStars; i < totalStars; i++) {
      const speed = Math.random() * 0.1 + 0.05; // Very slow: 0.05-0.15
      const angle = Math.random() * Math.PI * 2;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 0.5 + 0.3, // Tiny particles: 0.3-0.8px
        opacity: Math.random() * 0.3 + 0.5,
        isFast: false
      });
    }

    let animationId: number;
    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
      lastTime = currentTime;
      
      // Clear canvas with slight fade for trail effect on fast stars
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Update position
        star.x += star.vx * deltaTime;
        star.y += star.vy * deltaTime;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Subtle twinkle effect (only for slow stars)
        if (!star.isFast) {
          star.opacity = 0.5 + Math.abs(Math.sin(currentTime * 0.001 + star.x)) * 0.4;
        }

        // Draw tiny white star particle
        if (star.isFast) {
          // Fast stars with slight glow
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(0.4, `rgba(255, 255, 255, ${star.opacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Slow stars as tiny white dots
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default StarField;
