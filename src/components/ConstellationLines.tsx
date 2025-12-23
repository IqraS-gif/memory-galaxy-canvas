import { useEffect, useRef } from 'react';
import { Memory } from '@/types/memory';

interface ConstellationLinesProps {
  memories: Memory[];
}

export const ConstellationLines = ({ memories }: ConstellationLinesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (memories.length < 2) return;

    // Sort memories by creation date to draw lines in order
    const sortedMemories = [...memories].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Draw constellation lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Create a soft glow effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 10;

    sortedMemories.forEach((memory, index) => {
      const x = memory.position.x + 12; // Center of star
      const y = memory.position.y + 12;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw additional connecting lines for a more complex constellation
    if (memories.length > 3) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;

      // Connect some non-adjacent stars
      for (let i = 0; i < sortedMemories.length; i += 2) {
        const nextIndex = (i + 2) % sortedMemories.length;
        if (nextIndex !== i) {
          const x1 = sortedMemories[i].position.x + 12;
          const y1 = sortedMemories[i].position.y + 12;
          const x2 = sortedMemories[nextIndex].position.x + 12;
          const y2 = sortedMemories[nextIndex].position.y + 12;

          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }

      ctx.stroke();
    }
  }, [memories]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};
