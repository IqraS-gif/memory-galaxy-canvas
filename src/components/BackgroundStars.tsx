import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BackgroundStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

export const BackgroundStars = () => {
  const stars = useMemo<BackgroundStar[]>(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Nebula effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-mood-nostalgic/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-mood-calm/5 blur-[80px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[60px]" />
    </div>
  );
};
